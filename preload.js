const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('minimize'),
  maximize: () => ipcRenderer.send('maximize'),
  close: () => ipcRenderer.send('close'),
  setAlwaysOnTop: (on) => ipcRenderer.send('set-always-on-top', on),
  setFocusMode: (on) => ipcRenderer.send('set-focus-mode', on),
  onFocusModeChanged: (cb) => {
    const h = (_, v) => cb(v);
    ipcRenderer.on('focus-mode-changed', h);
    return () => ipcRenderer.removeListener('focus-mode-changed', h);
  },
  showNotification: (title, body) => ipcRenderer.send('show-notification', { title, body }),
  openTimerPopup: (data) => ipcRenderer.send('open-timer-popup', data),
  updateTimerPopup: (data) => ipcRenderer.send('update-timer-popup', data),
  closeTimerPopup: () => ipcRenderer.send('close-timer-popup'),
  onTimerState: (cb) => {
    const h = (_, data) => cb(data);
    ipcRenderer.on('timer-state', h);
    return () => ipcRenderer.removeListener('timer-state', h);
  },
  checkForUpdates: () => ipcRenderer.send('check-for-updates'),
  downloadUpdate: () => ipcRenderer.send('download-update'),
  installUpdate: () => ipcRenderer.send('install-update'),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  onUpdateStatus: (callback) => {
    const handler = (_event, data) => callback(data);
    ipcRenderer.on('update-status', handler);
    return () => ipcRenderer.removeListener('update-status', handler);
  },
});
