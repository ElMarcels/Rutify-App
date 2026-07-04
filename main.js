const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

let mainWindow;
let timerPopup = null;
let isFocusMode = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    icon: path.join(__dirname, 'build', 'rutify.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  ipcMain.on('minimize', () => {
    if (!isFocusMode) mainWindow.minimize();
  });
  ipcMain.on('maximize', () => {
    if (!isFocusMode) {
      mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
    }
  });
  ipcMain.on('close', () => {
    if (!isFocusMode) mainWindow.close();
  });
}

// Always on top
ipcMain.on('set-always-on-top', (_, on) => {
  mainWindow.setAlwaysOnTop(on);
});

// Focus mode
ipcMain.on('set-focus-mode', (_, on) => {
  isFocusMode = on;
  mainWindow.setAlwaysOnTop(on);
  mainWindow.webContents.send('focus-mode-changed', on);
});

// Notifications
ipcMain.on('show-notification', (_, { title, body }) => {
  if (Notification.isSupported()) {
    const n = new Notification({ title, body, icon: path.join(__dirname, 'build', 'rutify.ico') });
    n.show();
    n.on('click', () => {
      if (mainWindow) { mainWindow.show(); mainWindow.focus(); }
    });
  }
});

// Timer popup
ipcMain.on('open-timer-popup', (_, data) => {
  if (timerPopup && !timerPopup.isDestroyed()) { timerPopup.focus(); return; }
  timerPopup = new BrowserWindow({
    width: 320,
    height: 220,
    alwaysOnTop: true,
    resizable: false,
    frame: true,
    skipTaskbar: true,
    icon: path.join(__dirname, 'build', 'rutify.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  timerPopup.loadFile(path.join(__dirname, 'src', 'timer-popup.html'));
  timerPopup.on('closed', () => { timerPopup = null; });
  timerPopup.webContents.on('did-finish-load', () => {
    timerPopup.webContents.send('timer-state', data);
  });
});

ipcMain.on('update-timer-popup', (_, data) => {
  if (timerPopup && !timerPopup.isDestroyed()) {
    timerPopup.webContents.send('timer-state', data);
  }
});

ipcMain.on('close-timer-popup', () => {
  if (timerPopup && !timerPopup.isDestroyed()) timerPopup.close();
  timerPopup = null;
});

ipcMain.handle('get-app-version', () => app.getVersion());

// Auto-updater
ipcMain.on('check-for-updates', () => autoUpdater.checkForUpdates());
ipcMain.on('download-update', () => autoUpdater.downloadUpdate());
ipcMain.on('install-update', () => autoUpdater.quitAndInstall());

autoUpdater.on('checking-for-update', () => {
  mainWindow?.webContents.send('update-status', { status: 'checking' });
});
autoUpdater.on('update-available', (info) => {
  mainWindow?.webContents.send('update-status', { status: 'available', data: info });
});
autoUpdater.on('update-not-available', () => {
  mainWindow?.webContents.send('update-status', { status: 'not-available' });
});
autoUpdater.on('download-progress', (progress) => {
  mainWindow?.webContents.send('update-status', { status: 'downloading', data: progress });
});
autoUpdater.on('update-downloaded', (info) => {
  mainWindow?.webContents.send('update-status', { status: 'downloaded', data: info });
});
autoUpdater.on('error', (err) => {
  mainWindow?.webContents.send('update-status', { status: 'error', data: err });
});

app.whenReady().then(() => {
  createWindow();
  autoUpdater.checkForUpdates();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
