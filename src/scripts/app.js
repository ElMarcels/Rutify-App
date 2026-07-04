const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const DEFAULT_CATEGORIES = ['work', 'study', 'health', 'personal', 'creative'];

function getCategories() {
  const stored = JSON.parse(localStorage.getItem('rutify_categories') || '[]');
  const fromRoutines = [...new Set(routines.map((r) => r.category).filter(Boolean))];
  return [...new Set(['all', ...stored, ...DEFAULT_CATEGORIES, ...fromRoutines])];
}

function addCustomCategory(cat) {
  if (!cat) return;
  const stored = JSON.parse(localStorage.getItem('rutify_categories') || '[]');
  if (!stored.includes(cat) && !DEFAULT_CATEGORIES.includes(cat)) {
    stored.push(cat);
    localStorage.setItem('rutify_categories', JSON.stringify(stored));
  }
}

const TEMPLATES = [
  { name: 'Morning Routine', description: 'Start your day with focus', category: 'personal', exercises: [{ name: 'Meditate', duration: 10 }, { name: 'Journal', duration: 15 }, { name: 'Plan day', duration: 5 }] },
  { name: 'Deep Work Session', description: 'Focused work with breaks', category: 'work', exercises: [{ name: 'Deep focus block', duration: 90 }, { name: 'Review & notes', duration: 15 }] },
  { name: 'Evening Wind-Down', description: 'Relax and prepare for sleep', category: 'personal', exercises: [{ name: 'Stretch', duration: 10 }, { name: 'Read', duration: 20 }, { name: 'Plan tomorrow', duration: 5 }] },
  { name: 'Study Session', description: 'Effective study block', category: 'study', exercises: [{ name: 'Review material', duration: 25 }, { name: 'Active recall', duration: 20 }, { name: 'Summarize', duration: 10 }] },
  { name: 'Exercise Routine', description: 'Quick workout', category: 'health', exercises: [{ name: 'Warm up', duration: 5 }, { name: 'Main set', duration: 20 }, { name: 'Cool down', duration: 5 }] },
  { name: 'Creative Sprint', description: 'Unlock your creativity', category: 'creative', exercises: [{ name: 'Free writing', duration: 15 }, { name: 'Brainstorm', duration: 10 }, { name: 'Create', duration: 25 }] },
  { name: 'Weekly Review', description: 'Reflect on the past week', category: 'work', exercises: [{ name: 'Review wins', duration: 10 }, { name: 'Review challenges', duration: 10 }, { name: 'Plan next week', duration: 15 }] },
  { name: 'Read & Learn', description: 'Absorb knowledge', category: 'study', exercises: [{ name: 'Read actively', duration: 30 }, { name: 'Take notes', duration: 15 }, { name: 'Connect ideas', duration: 10 }] },
];

const SOUNDS = {
  beep: { freq: 880, dur: 0.4 },
  bell: { freq: 660, dur: 0.6 },
  chime: { freq: [523, 659, 784], dur: 0.5 },
};

const i18n = {
  en: {
    routines: 'Routines', history: 'History', stats: 'Stats', settings: 'Settings', templates: 'Templates',
    newRoutine: 'New Routine', routineName: 'Routine Name', description: 'Description',
    tasks: 'Tasks', addTask: 'Add Task', taskName: 'Task name', durationMin: 'min',
    cancel: 'Cancel', saveRoutine: 'Save Routine', deleteRoutine: 'Delete Routine',
    deleteConfirm: 'Are you sure you want to delete this routine?', delete: 'Delete',
    language: 'Language / Idioma', theme: 'Theme', light: 'Light', dark: 'Dark',
    interfaceSize: 'Interface Size', small: 'Small', medium: 'Medium', large: 'Large', xlarge: 'X-Large',
    updates: 'Updates', currentVersion: 'Version', checkUpdates: 'Check for Updates',
    downloadUpdate: 'Download Update', installUpdate: 'Restart & Install',
    checking: 'Checking for updates...', available: 'New version available!',
    notAvailable: 'You have the latest version.', downloading: 'Downloading... {{percent}}%',
    downloaded: 'Update ready. Restart to install.', error: 'Update check failed.',
    noRoutines: 'No Routines Yet', noRoutinesDesc: 'Click "New Routine" to create your first routine.',
    noTasks: 'No tasks yet. Add one below.',
    noHistory: 'No History Yet', historyDesc: 'Completed routines will appear here.',
    noStats: 'No Stats Available', statsDesc: 'Complete some routines to see your stats.',
    noTemplates: 'No Templates', noTemplatesDesc: 'All templates have been imported.',
    edit: 'Edit', searchPlaceholder: 'Search routines...', editRoutine: 'Edit Routine',
    nameRequired: 'Please enter a routine name.',
    all: 'All', work: 'Work', study: 'Study', health: 'Health', personal: 'Personal', creative: 'Creative',
    category: 'Category', favorites: 'Favorites', archived: 'Archived',
    start: 'Start', pause: 'Pause', resume: 'Resume', stop: 'Stop', skip: 'Skip', finish: 'Finish',
    task: 'Task', of: 'of', taskComplete: 'Task Complete!', routineComplete: 'Routine Complete!',
    rest: 'Rest', next: 'Next', addNote: 'Add a note...',
    totalSessions: 'Total Sessions', totalTime: 'Total Time',
    currentStreak: 'Current Streak', bestStreak: 'Best Streak', mostUsed: 'Most Used',
    thisWeek: 'This Week', hours: 'h', sessions: 'sessions',
    exportRoutines: 'Export Routines', importRoutines: 'Import Routines',
    dataManagement: 'Data Management',
    exportSuccess: 'Routines exported!', importSuccess: 'Routines imported!', importError: 'Invalid file.',
    deleteEntry: 'Delete Entry', confirmDeleteHistory: 'Delete this history entry?',
    completed: 'Completed', notes: 'Notes', actualTime: 'Actual Time',
    noSessions: 'No sessions yet', today: 'Today',
    mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun',
    tags: 'Tags', repeat: 'Repeat', never: 'Never', daily: 'Daily', weekdays: 'Weekdays', weekly: 'Weekly',
    shareRoutine: 'Share Routine', shareDesc: 'The routine data has been copied to your clipboard. You can paste it into a file to share.',
    copyToClipboard: 'Copy to Clipboard', downloadFile: 'Download File', copied: 'Copied!',
    pomodoro: 'Pomodoro', routine: 'Routine', focus: 'Focus', shortBreak: 'Short Break', longBreak: 'Long Break',
    pomodoroSettings: 'Pomodoro Settings', pomodoroLength: 'Focus length', shortBreakLabel: 'Short break', longBreakLabel: 'Long break',
    minutes: 'min', soundSettings: 'Sound', timerSound: 'Timer sound', uploadSound: 'Upload .mp3', custom: 'Custom',
    autoDarkMode: 'Auto dark mode', weeklyGoal: 'Weekly Goal', routinesPerWeek: 'Routines per week',
    importTemplate: 'Import', imported: 'Imported!', archive: 'Archive', archiveRoutine: 'Archive Routine',
    archiveConfirm: 'Archive this routine? It will be hidden from the main view.', restore: 'Restore',
    showArchived: 'Show archived', focusMode: 'Focus mode (block minimize/close)',
    pinToTop: 'Pin on top', popOut: 'Pop out', taskNotes: 'Task Notes',
    exportStatsCsv: 'Export Stats CSV', deviation: 'Deviation (estimated vs actual)',
  },
  es: {
    routines: 'Rutinas', history: 'Historial', stats: 'Estadísticas', settings: 'Ajustes', templates: 'Plantillas',
    newRoutine: 'Nueva Rutina', routineName: 'Nombre de la Rutina', description: 'Descripción',
    tasks: 'Tareas', addTask: 'Agregar Tarea', taskName: 'Nombre de la tarea', durationMin: 'min',
    cancel: 'Cancelar', saveRoutine: 'Guardar Rutina', deleteRoutine: 'Eliminar Rutina',
    deleteConfirm: '¿Estás seguro de que quieres eliminar esta rutina?', delete: 'Eliminar',
    language: 'Idioma / Language', theme: 'Tema', light: 'Claro', dark: 'Oscuro',
    interfaceSize: 'Tamaño de Interfaz', small: 'Pequeño', medium: 'Mediano', large: 'Grande', xlarge: 'Muy Grande',
    updates: 'Actualizaciones', currentVersion: 'Versión', checkUpdates: 'Buscar Actualizaciones',
    downloadUpdate: 'Descargar Actualización', installUpdate: 'Reiniciar e Instalar',
    checking: 'Buscando actualizaciones...', available: '¡Nueva versión disponible!',
    notAvailable: 'Tienes la última versión.', downloading: 'Descargando... {{percent}}%',
    downloaded: 'Actualización lista. Reinicia para instalar.', error: 'Error al buscar actualizaciones.',
    noRoutines: 'Sin Rutinas', noRoutinesDesc: 'Haz clic en "Nueva Rutina" para crear tu primera rutina.',
    noTasks: 'Sin tareas. Agrega una abajo.',
    noHistory: 'Sin Historial', historyDesc: 'Las rutinas completadas aparecerán aquí.',
    noStats: 'Sin Estadísticas', statsDesc: 'Completa algunas rutinas para ver tus estadísticas.',
    noTemplates: 'Sin Plantillas', noTemplatesDesc: 'Todas las plantillas han sido importadas.',
    edit: 'Editar', searchPlaceholder: 'Buscar rutinas...', editRoutine: 'Editar Rutina',
    nameRequired: 'Por favor ingresa un nombre para la rutina.',
    all: 'Todas', work: 'Trabajo', study: 'Estudio', health: 'Salud', personal: 'Personal', creative: 'Creativo',
    category: 'Categoría', favorites: 'Favoritos', archived: 'Archivadas',
    start: 'Iniciar', pause: 'Pausa', resume: 'Reanudar', stop: 'Detener', skip: 'Saltar', finish: 'Finalizar',
    task: 'Tarea', of: 'de', taskComplete: '¡Tarea Completada!', routineComplete: '¡Rutina Completada!',
    rest: 'Descanso', next: 'Siguiente', addNote: 'Agrega una nota...',
    totalSessions: 'Sesiones Totales', totalTime: 'Tiempo Total',
    currentStreak: 'Racha Actual', bestStreak: 'Mejor Racha', mostUsed: 'Más Usada',
    thisWeek: 'Esta Semana', hours: 'h', sessions: 'sesiones',
    exportRoutines: 'Exportar Rutinas', importRoutines: 'Importar Rutinas',
    dataManagement: 'Administrar Datos',
    exportSuccess: '¡Rutinas exportadas!', importSuccess: '¡Rutinas importadas!', importError: 'Archivo inválido.',
    deleteEntry: 'Eliminar Entrada', confirmDeleteHistory: '¿Eliminar esta entrada del historial?',
    completed: 'Completada', notes: 'Notas', actualTime: 'Tiempo Real',
    noSessions: 'Sin sesiones aún', today: 'Hoy',
    mon: 'Lun', tue: 'Mar', wed: 'Mié', thu: 'Jue', fri: 'Vie', sat: 'Sáb', sun: 'Dom',
    tags: 'Etiquetas', repeat: 'Repetir', never: 'Nunca', daily: 'Diario', weekdays: 'Semanal', weekly: 'Semanal',
    shareRoutine: 'Compartir Rutina', shareDesc: 'Los datos de la rutina se han copiado al portapapeles. Puedes pegarlos en un archivo para compartir.',
    copyToClipboard: 'Copiar al Portapapeles', downloadFile: 'Descargar Archivo', copied: '¡Copiado!',
    pomodoro: 'Pomodoro', routine: 'Rutina', focus: 'Enfoque', shortBreak: 'Descanso Corto', longBreak: 'Descanso Largo',
    pomodoroSettings: 'Configuración Pomodoro', pomodoroLength: 'Duración enfoque', shortBreakLabel: 'Descanso corto', longBreakLabel: 'Descanso largo',
    minutes: 'min', soundSettings: 'Sonido', timerSound: 'Sonido del timer', uploadSound: 'Subir .mp3', custom: 'Personalizado',
    autoDarkMode: 'Modo oscuro automático', weeklyGoal: 'Meta Semanal', routinesPerWeek: 'Rutinas por semana',
    importTemplate: 'Importar', imported: '¡Importada!', archive: 'Archivar', archiveRoutine: 'Archivar Rutina',
    archiveConfirm: '¿Archivar esta rutina? Se ocultará de la vista principal.', restore: 'Restaurar',
    showArchived: 'Mostrar archivadas', focusMode: 'Modo concentración (bloquear minimizar/cerrar)',
    pinToTop: 'Fijar arriba', popOut: 'Ventana flotante', taskNotes: 'Notas de Tarea',
    exportStatsCsv: 'Exportar Stats CSV', deviation: 'Desviación (estimado vs real)',
  },
};

// ====== STATE ======

let currentLang = localStorage.getItem('rutify_lang') || 'en';
let currentTheme = localStorage.getItem('rutify_theme') || 'light';
let currentScale = parseFloat(localStorage.getItem('rutify_scale') || '1.0');
let autoDark = localStorage.getItem('rutify_autoDark') === 'true';
let currentFilter = 'all';
let favFilter = false;
let showArchived = false;

let routines = JSON.parse(localStorage.getItem('rutify_routines') || '[]');
let historyData = JSON.parse(localStorage.getItem('rutify_history') || '[]');
let routineOrder = JSON.parse(localStorage.getItem('rutify_order') || '[]');
let importedTemplates = JSON.parse(localStorage.getItem('rutify_imported_templates') || '[]');
let editingId = null;
let deleteTargetId = null;
let deleteHistoryTargetId = null;
let archiveTargetId = null;
let timerState = null;
let timerInterval = null;
let timerRestInterval = null;
let pomodoroState = null;
let pomodoroInterval = null;
let isPinned = false;
let tags = [];

// ====== I18N ======

function t(key) { return i18n[currentLang][key] || key; }

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = t(key);
    else if (el.tagName === 'SELECT') Array.from(el.options).forEach((o) => { if (o.dataset.i18n) o.textContent = t(o.dataset.i18n); });
    else if (el.tagName === 'SPAN' && el.parentElement?.dataset?.i18n) {}
    else el.textContent = t(key);
  });
  const si = $('#searchInput');
  if (si) si.placeholder = t('searchPlaceholder');
  renderFilterChips();
  renderRoutines();
  if ($('#historyView').classList.contains('active')) renderHistory();
  if ($('#statsView').classList.contains('active')) renderStats();
  if ($('#templatesView').classList.contains('active')) renderTemplates();
}

// ====== THEME / SCALE / LANG ======

function applyTheme(theme) {
  currentTheme = theme;
  localStorage.setItem('rutify_theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
  $$('.toggle-btn[data-theme]').forEach((b) => b.classList.toggle('active', b.dataset.theme === theme));
}

function applyScale(scale) {
  currentScale = scale;
  localStorage.setItem('rutify_scale', scale.toString());
  document.body.style.zoom = scale;
  $$('.size-btn').forEach((b) => b.classList.toggle('active', Math.abs(parseFloat(b.dataset.scale) - scale) < 0.01));
}

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('rutify_lang', lang);
  document.documentElement.lang = lang;
  $$('.toggle-btn[data-lang]').forEach((b) => b.classList.toggle('active', b.dataset.lang === lang));
  applyTranslations();
}

// ====== AUTO DARK MODE (#12) ======

function checkAutoDark() {
  if (!autoDark) return;
  const h = new Date().getHours();
  applyTheme(h >= 19 || h < 7 ? 'dark' : 'light');
}

// ====== SOUND (#14) ======

function playSound() {
  const soundType = localStorage.getItem('rutify_sound') || 'beep';
  const customSound = localStorage.getItem('rutify_custom_sound');
  if (soundType === 'custom' && customSound) {
    try {
      const audio = new Audio(customSound);
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch {}
    return;
  }
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const conf = SOUNDS[soundType] || SOUNDS.beep;
    if (Array.isArray(conf.freq)) {
      conf.freq.forEach((f, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value = f;
        g.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.12);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + conf.dur);
        o.start(ctx.currentTime + i * 0.12);
        o.stop(ctx.currentTime + i * 0.12 + conf.dur);
      });
      setTimeout(() => ctx.close(), 2000);
    } else {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = conf.freq;
      g.gain.setValueAtTime(0.3, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + conf.dur);
      o.start(); o.stop(ctx.currentTime + conf.dur);
      setTimeout(() => ctx.close(), 1000);
    }
  } catch {}
}

// ====== NOTIFICATIONS (#3) ======

function notify(title, body) {
  if (window.electronAPI) window.electronAPI.showNotification(title, body);
}

// ====== PERSISTENCE ======

function save() {
  localStorage.setItem('rutify_routines', JSON.stringify(routines));
  localStorage.setItem('rutify_history', JSON.stringify(historyData));
  localStorage.setItem('rutify_order', JSON.stringify(routineOrder));
  localStorage.setItem('rutify_imported_templates', JSON.stringify(importedTemplates));
  renderRoutines();
}

function esc(str) { const d = document.createElement('div'); d.textContent = str; return d.innerHTML; }

function totalDuration(exercises) {
  if (!exercises || !exercises.length) return 0;
  return exercises.reduce((s, e) => s + (parseInt(e.duration) || 0), 0);
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(currentLang === 'es' ? 'es-ES' : 'en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatDateShort(iso) {
  return new Date(iso).toLocaleDateString(currentLang === 'es' ? 'es-ES' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

// ====== FILTER CHIPS ======

function renderFilterChips() {
  const bar = $('#filterBar');
  const cats = getCategories();
  const search = ($('#searchInput').value || '').toLowerCase();
  let visible = search ? cats : cats.filter((c) => c === 'all' || routines.some((r) => (r.category || 'other') === c));
  bar.innerHTML = visible.map((c) =>
    `<button class="filter-chip ${c === currentFilter ? 'active' : ''}" data-filter="${c}">${esc(c)}</button>`
  ).join('');
  bar.querySelectorAll('.filter-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      currentFilter = chip.dataset.filter;
      renderFilterChips();
      renderRoutines();
    });
  });
}

// ====== ROUTINE ORDER (#16) ======

function getOrderedRoutines() {
  if (routineOrder.length === 0) return routines;
  const ordered = [];
  const remaining = [...routines];
  for (const id of routineOrder) {
    const idx = remaining.findIndex((r) => r.id === id);
    if (idx !== -1) { ordered.push(remaining[idx]); remaining.splice(idx, 1); }
  }
  return [...ordered, ...remaining];
}

function saveRoutineOrder() {
  const cards = $$('.routine-card');
  routineOrder = Array.from(cards).map((c) => c.dataset.id);
  localStorage.setItem('rutify_order', JSON.stringify(routineOrder));
}

// ====== ROUTINES RENDER ======

function renderRoutines() {
  const grid = $('#routinesGrid');
  const search = ($('#searchInput').value || '').toLowerCase();
  let filtered = routines.filter((r) => r.name.toLowerCase().includes(search));
  if (currentFilter !== 'all') filtered = filtered.filter((r) => (r.category || 'other') === currentFilter);
  if (favFilter) filtered = filtered.filter((r) => r.favorite);
  if (!showArchived) filtered = filtered.filter((r) => !r.archived);

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg><h2>${t('noRoutines')}</h2><p>${t('noRoutinesDesc')}</p></div>`;
    return;
  }

  const ordered = getOrderedRoutines().filter((r) => filtered.includes(r));
  grid.innerHTML = ordered.map((r, idx) => {
    const cat = r.category || 'other';
    const tagsHtml = (r.tags || []).map((tag) => `<span class="tag-badge">${esc(tag)}</span>`).join('');
    const repeatLabel = r.repeat && r.repeat !== 'none' ? `<span class="repeat-badge">↻ ${t(r.repeat)}</span>` : '';
    return `
    <div class="routine-card" draggable="true" data-id="${r.id}" style="--i: ${idx}">
      <div class="routine-card-header">
        <div class="routine-card-title-row">
          <h3>${esc(r.name)}</h3>
          <button class="fav-btn ${r.favorite ? 'active' : ''}" data-id="${r.id}" title="${t('favorites')}"><svg width="16" height="16" viewBox="0 0 24 24" fill="${r.favorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></button>
        </div>
        <div class="routine-card-actions">
          <button class="start-btn" data-id="${r.id}" title="${t('start')}"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg></button>
          <button class="share-btn" data-id="${r.id}" title="${t('shareRoutine')}"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg></button>
          <button class="edit-btn" data-id="${r.id}" title="${t('edit')}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
          <button class="delete-btn" data-id="${r.id}" title="${t('delete')}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>
          <button class="archive-btn" data-id="${r.id}" title="${t('archive')}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg></button>
        </div>
      </div>
      <div class="routine-card-tags"><span class="cat-tag">${esc(cat)}</span>${tagsHtml}${repeatLabel}</div>
      ${r.description ? `<p>${esc(r.description)}</p>` : ''}
      <div class="routine-card-meta">
        <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> ${r.exercises ? r.exercises.length : 0} ${t('tasks').toLowerCase()}</span>
        <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${totalDuration(r.exercises)} ${t('durationMin')}</span>
      </div>
    </div>`;
  }).join('');
  setupRoutineDragDrop();
}

// ====== ROUTINE DRAG & DROP (#16) ======

let routineDragIndex = null;

function setupRoutineDragDrop() {
  $$('.routine-card').forEach((card) => {
    card.addEventListener('dragstart', (e) => {
      routineDragIndex = Array.from(card.parentNode.children).indexOf(card);
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      $$('.routine-card').forEach((c) => c.classList.remove('drag-over'));
      routineDragIndex = null;
      saveRoutineOrder();
    });
    card.addEventListener('dragover', (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; });
    card.addEventListener('dragenter', (e) => { e.preventDefault(); if (card !== e.currentTarget) card.classList.add('drag-over'); });
    card.addEventListener('dragleave', () => card.classList.remove('drag-over'));
    card.addEventListener('drop', (e) => {
      e.preventDefault();
      card.classList.remove('drag-over');
      const grid = $('#routinesGrid');
      const cards = Array.from(grid.children);
      const from = routineDragIndex;
      const to = cards.indexOf(card);
      if (from === null || from === to) return;
      const ordered = getOrderedRoutines();
      const [moved] = ordered.splice(from, 1);
      ordered.splice(to, 0, moved);
      routineOrder = ordered.map((r) => r.id);
      save();
    });
  });
}

// ====== CRUD ======

function openModal(routine) {
  editingId = routine ? routine.id : null;
  $('#modalTitle').textContent = routine ? t('editRoutine') : t('newRoutine');
  $('#routineName').value = routine ? routine.name : '';
  $('#routineDescription').value = routine ? (routine.description || '') : '';
  $('#routineCategory').value = routine ? (routine.category || '') : '';
  tags = routine ? (routine.tags || []) : [];
  renderTags();
  // Populate category datalist
  const dl = $('#categoryList');
  dl.innerHTML = getCategories().filter((c) => c !== 'all').map((c) => `<option value="${esc(c)}">`).join('');
  $('#repeatSelect').value = routine ? (routine.repeat || 'none') : 'none';
  renderTasks(routine ? routine.exercises : []);
  $('#routineModal').classList.add('open');
  $('#routineName').focus();
}

function closeModal() { $('#routineModal').classList.remove('open'); editingId = null; }

// ====== TAGS (#10) ======

function renderTags() {
  const list = $('#tagsList');
  list.innerHTML = tags.map((tag) =>
    `<span class="tag-item">${esc(tag)} <button class="tag-remove" data-tag="${esc(tag)}">×</button></span>`
  ).join('');
}

$('#tagInputField').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const val = e.target.value.trim();
    if (val && !tags.includes(val)) {
      tags.push(val);
      renderTags();
    }
    e.target.value = '';
  }
});

$('#tagsList').addEventListener('click', (e) => {
  const btn = e.target.closest('.tag-remove');
  if (btn) {
    tags = tags.filter((t) => t !== btn.dataset.tag);
    renderTags();
  }
});

// ====== TASKS / DRAG & DROP ======

function renderTasks(exercises) {
  const container = $('#tasksList');
  if (!exercises || exercises.length === 0) {
    container.innerHTML = `<div style="padding:12px;text-align:center;color:var(--text-tertiary);font-size:13px">${t('noTasks')}</div>`;
    return;
  }
  container.innerHTML = exercises.map((e, i) => `
    <div class="exercise-item" data-index="${i}" draggable="true" style="--i: ${i}">
      <div class="drag-handle"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" opacity="0.4"><circle cx="8" cy="6" r="2"/><circle cx="16" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="8" cy="18" r="2"/><circle cx="16" cy="18" r="2"/></svg></div>
      <input type="text" class="exercise-name" value="${esc(e.name || '')}" placeholder="${t('taskName')}" />
      <input type="number" class="exercise-duration" value="${e.duration || ''}" placeholder="${t('durationMin')}" min="0" />
      <button class="remove-exercise" data-index="${i}"><svg width="12" height="12" viewBox="0 0 12 12"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" stroke-width="1.5" fill="none"/></svg></button>
    </div>
  `).join('');
  setupTaskDragDrop();
}

function getTasksFromDOM() {
  return Array.from($$('.exercise-item')).map((el) => ({
    name: el.querySelector('.exercise-name').value.trim(),
    duration: parseInt(el.querySelector('.exercise-duration').value) || 0,
  })).filter((e) => e.name !== '');
}

function addTaskToDOM() {
  const container = $('#tasksList');
  const div = document.createElement('div');
  div.className = 'exercise-item'; div.draggable = true;
  div.innerHTML = `<div class="drag-handle"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" opacity="0.4"><circle cx="8" cy="6" r="2"/><circle cx="16" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="8" cy="18" r="2"/><circle cx="16" cy="18" r="2"/></svg></div>
    <input type="text" class="exercise-name" value="" placeholder="${t('taskName')}" />
    <input type="number" class="exercise-duration" value="" placeholder="${t('durationMin')}" min="0" />
    <button class="remove-exercise"><svg width="12" height="12" viewBox="0 0 12 12"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" stroke-width="1.5" fill="none"/></svg></button>`;
  container.appendChild(div);
  div.querySelector('.exercise-name').focus();
  setupTaskDragDrop();
}

let taskDragIndex = null;

function setupTaskDragDrop() {
  $$('.exercise-item').forEach((item) => {
    item.addEventListener('dragstart', (e) => { taskDragIndex = parseInt(item.dataset.index); item.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; });
    item.addEventListener('dragend', () => { item.classList.remove('dragging'); $$('.exercise-item').forEach((el) => el.classList.remove('drag-over')); taskDragIndex = null; });
    item.addEventListener('dragover', (e) => e.preventDefault());
    item.addEventListener('dragenter', (e) => { e.preventDefault(); if (parseInt(item.dataset.index) !== taskDragIndex) item.classList.add('drag-over'); });
    item.addEventListener('dragleave', () => item.classList.remove('drag-over'));
    item.addEventListener('drop', (e) => {
      e.preventDefault(); item.classList.remove('drag-over');
      if (taskDragIndex === null || taskDragIndex === parseInt(item.dataset.index)) return;
      const ex = getTasksFromDOM();
      const [moved] = ex.splice(taskDragIndex, 1);
      ex.splice(parseInt(item.dataset.index), 0, moved);
      renderTasks(ex);
      taskDragIndex = null;
    });
  });
}

// ====== SAVE ROUTINE ======

function saveRoutine() {
  const name = $('#routineName').value.trim();
  if (!name) { $('#routineName').focus(); $('#routineName').style.borderColor = 'var(--danger)'; setTimeout(() => $('#routineName').style.borderColor = '', 1500); return; }
  const description = $('#routineDescription').value.trim();
  const repeat = $('#repeatSelect').value;
  const exercises = getTasksFromDOM();
  const categoryInput = $('#routineCategory').value.trim();
  const category = categoryInput || 'other';
  const filteredTags = tags.filter((t) => t);
  addCustomCategory(category);

  if (editingId) {
    const idx = routines.findIndex((r) => r.id === editingId);
    if (idx !== -1) routines[idx] = { ...routines[idx], name, description, tags: filteredTags, category, repeat, exercises };
  } else {
    routines.push({ id: Date.now().toString(), name, description, tags: filteredTags, category, repeat, exercises, favorite: false, archived: false, createdAt: new Date().toISOString(), lastUsed: null });
  }
  save();
  renderFilterChips();
  closeModal();
}

// ====== TEMPLATES (#4) ======

function renderTemplates() {
  const grid = $('#templatesGrid');
  const available = TEMPLATES.filter((_, i) => !importedTemplates.includes(i));
  if (available.length === 0) {
    grid.innerHTML = `<div class="empty-state"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg><h2>${t('noTemplates')}</h2><p>${t('noTemplatesDesc')}</p></div>`;
    return;
  }
  grid.innerHTML = available.map((tmpl, idx) => {
    const realIdx = TEMPLATES.indexOf(tmpl);
    return `<div class="template-card" style="--i: ${idx}">
      <h3>${esc(tmpl.name)}</h3>
      <p>${esc(tmpl.description)}</p>
      <div class="routine-card-tags"><span class="cat-tag">${t(tmpl.category)}</span></div>
      <div class="routine-card-meta"><span>${tmpl.exercises.length} ${t('tasks').toLowerCase()}</span><span>${totalDuration(tmpl.exercises)} ${t('durationMin')}</span></div>
      <button class="btn btn-primary template-import-btn" data-index="${realIdx}" style="margin-top:12px">${t('importTemplate')}</button>
    </div>`;
  }).join('');
}

// ====== TIMER ======

function startTimer(routine) {
  if (!routine.exercises || routine.exercises.length === 0) return;
  if (window.electronAPI) window.electronAPI.setFocusMode(true);
  timerState = {
    routineId: routine.id, routineName: routine.name,
    tasks: routine.exercises.map((e) => ({ name: e.name, duration: parseInt(e.duration) || 0, actualSeconds: 0, note: '' })),
    currentTask: 0, secondsRemaining: (parseInt(routine.exercises[0].duration) || 0) * 60,
    totalSeconds: (parseInt(routine.exercises[0].duration) || 0) * 60, paused: false, phase: 'running', startTime: Date.now(),
  };
  showTimerUI(routine.name);
  updateTimerDisplay();
  clearInterval(timerInterval);
  timerInterval = setInterval(timerTick, 1000);
  updateTimerPopup();
}

function showTimerUI(title) {
  $('#timerTitle').textContent = title;
  $('#timerRest').style.display = 'none'; $('#timerComplete').style.display = 'none'; $('#timerRunning').style.display = 'block';
  $('#pomodoroRunning').style.display = 'none';
  $$('.timer-mode-tab').forEach((t) => t.classList.remove('active'));
  $('.timer-mode-tab[data-mode="routine"]').classList.add('active');
  $('#timerModal').classList.add('open');
}

function timerTick() {
  if (timerState.paused) return;
  if (timerState.phase === 'rest') return;
  timerState.secondsRemaining--;
  timerState.tasks[timerState.currentTask].actualSeconds++;
  updateTimerDisplay();
  updateTimerPopup();
  if (timerState.secondsRemaining <= 0) nextTask();
}

function nextTask() {
  playSound();
  notify(timerState.routineName, `${t('taskComplete')} ${timerState.tasks[timerState.currentTask].name}`);
  const total = timerState.tasks.length;
  if (timerState.currentTask < total - 1) {
    timerState.currentTask++;
    timerState.phase = 'rest';
    let restSec = 15;
    if (timerState.tasks[timerState.currentTask].duration > 0) restSec = Math.min(30, Math.max(5, Math.floor(timerState.tasks[timerState.currentTask].duration * 6)));
    showRest(restSec);
  } else {
    completeRoutine();
  }
}

function showRest(seconds) {
  clearInterval(timerInterval); clearInterval(timerRestInterval);
  $('#timerRunning').style.display = 'none'; $('#timerComplete').style.display = 'none'; $('#timerRest').style.display = 'block';
  const next = timerState.tasks[timerState.currentTask];
  $('#timerRestNext').textContent = `${t('next')}: ${next.name}`;
  let rest = seconds;
  $('#timerRestCountdown').textContent = rest;
  timerRestInterval = setInterval(() => {
    rest--; if (rest <= 0) { clearInterval(timerRestInterval); resumeFromRest(); return; }
    $('#timerRestCountdown').textContent = rest;
  }, 1000);
}

function resumeFromRest() {
  $('#timerRest').style.display = 'none'; $('#timerRunning').style.display = 'block';
  timerState.phase = 'running';
  const task = timerState.tasks[timerState.currentTask];
  timerState.secondsRemaining = task.duration * 60 || 10;
  timerState.totalSeconds = task.duration * 60 || 10;
  updateTimerDisplay();
  clearInterval(timerInterval);
  timerInterval = setInterval(timerTick, 1000);
  updateTimerPopup();
}

function completeRoutine() {
  clearInterval(timerInterval); clearInterval(timerRestInterval);
  timerState.phase = 'done';
  if (window.electronAPI) window.electronAPI.setFocusMode(false);
  playSound();
  notify(timerState.routineName, t('routineComplete'));
  $('#timerRunning').style.display = 'none'; $('#timerRest').style.display = 'none'; $('#timerComplete').style.display = 'block';
  const totalSec = timerState.tasks.reduce((s, t) => s + t.actualSeconds, 0);
  $('#timerTotalTime').textContent = `${t('totalTime')}: ${formatTime(totalSec)}`;
  // Task notes (#11)
  const notesContainer = $('#taskNotesContainer');
  notesContainer.innerHTML = '<h4 style="font-size:13px;font-weight:600;margin-bottom:8px;color:var(--text-secondary)">' + t('taskNotes') + '</h4>';
  timerState.tasks.forEach((task, i) => {
    const div = document.createElement('div');
    div.style.cssText = 'margin-bottom:6px';
    div.innerHTML = `<label style="font-size:12px;color:var(--text-tertiary);display:block;margin-bottom:2px">${esc(task.name)}</label>
      <input class="task-note-input" data-task="${i}" value="${esc(task.note || '')}" placeholder="${t('addNote')}" style="width:100%;padding:6px 10px;border:1px solid var(--glass-border);border-radius:6px;background:var(--input-bg);font-size:13px;color:var(--text-primary);font-family:var(--font);outline:none" />`;
    notesContainer.appendChild(div);
  });
  closeTimerPopup();
}

function finishRoutine() {
  // Collect task notes
  $$('.task-note-input').forEach((input) => {
    const i = parseInt(input.dataset.task);
    if (timerState.tasks[i]) timerState.tasks[i].note = input.value.trim();
  });
  const notes = $('#timerNotes').value.trim();
  const totalSec = timerState.tasks.reduce((s, t) => s + t.actualSeconds, 0);
  const estimatedSec = timerState.tasks.reduce((s, t) => s + (t.duration * 60 || 0), 0);
  const entry = {
    id: Date.now().toString(), routineId: timerState.routineId, routineName: timerState.routineName,
    date: new Date().toISOString(),
    tasks: timerState.tasks.map((t) => ({ name: t.name, plannedDuration: t.duration, actualSeconds: t.actualSeconds, note: t.note })),
    totalActualSeconds: totalSec, totalEstimatedSeconds: estimatedSec || totalSec, notes,
  };
  historyData.push(entry);
  // Update lastUsed
  const r = routines.find((r) => r.id === timerState.routineId);
  if (r) r.lastUsed = new Date().toISOString();
  save();
  $('#timerModal').classList.remove('open');
  $('#timerNotes').value = '';
  $('#taskNotesContainer').innerHTML = '';
  timerState = null;
  if (window.electronAPI) window.electronAPI.setFocusMode(false);
  if ($('#historyView').classList.contains('active')) renderHistory();
  if ($('#statsView').classList.contains('active')) renderStats();
}

function pauseTimer() {
  timerState.paused = true;
  $('#timerPauseBtn').innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>${t('resume')}</span>`;
}

function resumeTimer() {
  timerState.paused = false;
  $('#timerPauseBtn').innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg><span>${t('pause')}</span>`;
}

function togglePause() {
  if (!timerState || timerState.phase === 'done') return;
  if (timerState.paused) resumeTimer(); else pauseTimer();
}

function stopTimer() {
  clearInterval(timerInterval); clearInterval(timerRestInterval);
  timerState = null;
  $('#timerModal').classList.remove('open');
  $('#timerNotes').value = ''; $('#taskNotesContainer').innerHTML = '';
  if (window.electronAPI) window.electronAPI.setFocusMode(false);
  closeTimerPopup();
}

function updateTimerDisplay() {
  if (!timerState) return;
  const task = timerState.tasks[timerState.currentTask];
  const total = timerState.tasks.length;
  const current = timerState.currentTask + 1;
  $('#timerTaskName').textContent = task.name || `Task ${current}`;
  $('#timerTaskCounter').textContent = `${t('task')} ${current} ${t('of')} ${total}`;
  $('#timerDisplay').textContent = formatTime(Math.max(0, timerState.secondsRemaining));
  const p = timerState.totalSeconds > 0 ? ((timerState.totalSeconds - timerState.secondsRemaining) / timerState.totalSeconds) * 100 : 0;
  $('#timerProgressFill').style.width = `${Math.min(100, Math.max(0, p))}%`;
}

function updateTimerPopup() {
  if (!timerState || !window.electronAPI) return;
  window.electronAPI.updateTimerPopup({
    taskName: timerState.tasks[timerState.currentTask]?.name || '',
    secondsRemaining: timerState.secondsRemaining,
    progress: timerState.totalSeconds > 0 ? ((timerState.totalSeconds - timerState.secondsRemaining) / timerState.totalSeconds) * 100 : 0,
    current: timerState.currentTask + 1,
    total: timerState.tasks.length,
  });
}

function closeTimerPopup() {
  if (window.electronAPI) window.electronAPI.closeTimerPopup();
}

// ====== POMODORO (#1) ======

function startPomodoro() {
  const focusLen = parseInt(localStorage.getItem('rutify_pomodoro_length') || '25') * 60;
  const shortBreak = parseInt(localStorage.getItem('rutify_short_break') || '5') * 60;
  const longBreak = parseInt(localStorage.getItem('rutify_long_break') || '15') * 60;
  if (window.electronAPI) window.electronAPI.setFocusMode(true);
  pomodoroState = { phase: 'focus', secondsRemaining: focusLen, totalSeconds: focusLen, count: 0, paused: false, focusLen, shortBreak, longBreak };
  showPomodoroUI();
  updatePomodoroDisplay();
  clearInterval(pomodoroInterval);
  pomodoroInterval = setInterval(pomodoroTick, 1000);
}

function showPomodoroUI() {
  $('#timerTitle').textContent = 'Pomodoro';
  $('#timerRunning').style.display = 'none'; $('#timerRest').style.display = 'none'; $('#timerComplete').style.display = 'none';
  $('#pomodoroRunning').style.display = 'block';
  $$('.timer-mode-tab').forEach((t) => t.classList.remove('active'));
  $('.timer-mode-tab[data-mode="pomodoro"]').classList.add('active');
  $('#timerModal').classList.add('open');
}

function pomodoroTick() {
  if (pomodoroState.paused) return;
  pomodoroState.secondsRemaining--;
  updatePomodoroDisplay();
  if (pomodoroState.secondsRemaining <= 0) pomodoroNext();
}

function pomodoroNext() {
  playSound();
  if (pomodoroState.phase === 'focus') {
    pomodoroState.count++;
    if (pomodoroState.count % 4 === 0) {
      pomodoroState.phase = 'longBreak';
      pomodoroState.secondsRemaining = pomodoroState.longBreak;
      notify('Pomodoro', t('longBreak'));
    } else {
      pomodoroState.phase = 'shortBreak';
      pomodoroState.secondsRemaining = pomodoroState.shortBreak;
      notify('Pomodoro', t('shortBreak'));
    }
  } else {
    pomodoroState.phase = 'focus';
    pomodoroState.secondsRemaining = pomodoroState.focusLen;
    notify('Pomodoro', t('focus'));
  }
  pomodoroState.totalSeconds = pomodoroState.secondsRemaining;
  updatePomodoroDisplay();
}

function updatePomodoroDisplay() {
  if (!pomodoroState) return;
  const phaseLabels = { focus: t('focus'), shortBreak: t('shortBreak'), longBreak: t('longBreak') };
  $('#pomodoroPhaseBadge').textContent = phaseLabels[pomodoroState.phase] || '';
  $('#pomodoroPhaseBadge').className = 'timer-mode-badge ' + pomodoroState.phase;
  $('#pomodoroDisplay').textContent = formatTime(Math.max(0, pomodoroState.secondsRemaining));
  const p = pomodoroState.totalSeconds > 0 ? ((pomodoroState.totalSeconds - pomodoroState.secondsRemaining) / pomodoroState.totalSeconds) * 100 : 0;
  $('#pomodoroProgressFill').style.width = `${Math.min(100, Math.max(0, p))}%`;
  $('#pomodoroCounter').textContent = `${pomodoroState.count} / 4`;
}

function togglePomodoroPause() {
  if (!pomodoroState) return;
  pomodoroState.paused = !pomodoroState.paused;
  $('#pomodoroPauseBtn').innerHTML = pomodoroState.paused
    ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>${t('resume')}</span>`
    : `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg><span>${t('pause')}</span>`;
}

function stopPomodoro() {
  clearInterval(pomodoroInterval);
  pomodoroState = null;
  $('#timerModal').classList.remove('open');
  if (window.electronAPI) window.electronAPI.setFocusMode(false);
}

// ====== TIMER MODE SWITCH ======

$$('.timer-mode-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    const mode = tab.dataset.mode;
    if (mode === 'routine' && pomodoroState) { stopPomodoro(); return; }
    if (mode === 'pomodoro' && timerState) { stopTimer(); return; }
    if (mode === 'pomodoro' && !timerState && !pomodoroState) startPomodoro();
  });
});

// ====== HISTORY ======

function renderHistory() {
  const container = $('#historyList');
  if (historyData.length === 0) {
    container.innerHTML = `<div class="empty-state"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.4"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><h2>${t('noHistory')}</h2><p>${t('historyDesc')}</p></div>`;
    return;
  }
  const sorted = [...historyData].reverse();
  container.innerHTML = sorted.map((h, idx) => {
    const isToday = new Date(h.date).toDateString() === new Date().toDateString();
    return `<div class="history-card" style="--i: ${idx}">
      <div class="history-card-header">
        <div><h3>${esc(h.routineName)}</h3><div class="history-date">${isToday ? t('today') : formatDateShort(h.date)}</div></div>
        <button class="win-btn history-delete-btn" data-id="${h.id}" title="${t('delete')}"><svg width="12" height="12" viewBox="0 0 12 12"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" stroke-width="1.5" fill="none"/></svg></button>
      </div>
      <div class="history-meta"><span><strong>${t('totalTime')}:</strong> ${formatTime(h.totalActualSeconds)}</span>${h.totalEstimatedSeconds ? `<span><strong>${t('actualTime')}:</strong> ${Math.round(h.totalActualSeconds / (h.totalEstimatedSeconds || 1) * 100)}%</span>` : ''}</div>
      ${h.notes ? `<div class="history-notes">📝 ${esc(h.notes)}</div>` : ''}
      <div class="history-tasks">${(h.tasks || []).map((t) => `<div class="history-task-item"><span>${esc(t.name)}${t.note ? ' — ' + esc(t.note) : ''}</span><span>${formatTime(t.actualSeconds)}</span></div>`).join('')}</div>
    </div>`;
  }).join('');
}

function deleteHistoryEntry(id) { historyData = historyData.filter((h) => h.id !== id); save(); renderHistory(); }

// ====== STATS ======

function renderStats() {
  const container = $('#statsContainer');
  if (historyData.length === 0) {
    container.innerHTML = `<div class="empty-state"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.4"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg><h2>${t('noStats')}</h2><p>${t('statsDesc')}</p></div>`;
    return;
  }

  const totalSessions = historyData.length;
  const totalSecs = historyData.reduce((s, h) => s + h.totalActualSeconds, 0);
  const totalHours = (totalSecs / 3600).toFixed(1);

  const counts = {};
  historyData.forEach((h) => { counts[h.routineName] = (counts[h.routineName] || 0) + 1; });
  const mostUsed = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];

  const dates = [...new Set(historyData.map((h) => { const d = new Date(h.date); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }))].sort().reverse();
  const today = new Date();
  const tStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  const y = new Date(today); y.setDate(y.getDate()-1);
  const yStr = `${y.getFullYear()}-${String(y.getMonth()+1).padStart(2,'0')}-${String(y.getDate()).padStart(2,'0')}`;
  let currentStreak = 0;
  if (dates[0] === tStr || dates[0] === yStr) {
    currentStreak = 1;
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i-1]), curr = new Date(dates[i]);
      if ((prev-curr)/(86400000) === 1) currentStreak++; else break;
    }
  }
  let bestStreak = 0;
  if (dates.length) {
    const asc = [...dates].reverse(); let s = 1;
    for (let i = 1; i < asc.length; i++) {
      const prev = new Date(asc[i-1]), curr = new Date(asc[i]);
      if ((curr-prev)/(86400000) === 1) s++; else { bestStreak = Math.max(bestStreak,s); s=1; }
    }
    bestStreak = Math.max(bestStreak,s);
  }

  // Weekly goal (#15)
  const weeklyGoal = parseInt(localStorage.getItem('rutify_weekly_goal') || '5');
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0,0,0,0);
  const weekSessions = historyData.filter((h) => new Date(h.date) >= weekStart).length;
  const goalPct = Math.min(100, (weekSessions / weeklyGoal) * 100);

  // Weekly chart
  const dayNames = [t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')];
  const weekDays = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate()-i);
    const str = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const ses = historyData.filter((h) => { const hd = new Date(h.date); return `${hd.getFullYear()}-${String(hd.getMonth()+1).padStart(2,'0')}-${String(hd.getDate()).padStart(2,'0')}` === str; });
    weekDays.push({ label: dayNames[d.getDay()], sessions: ses.length, seconds: ses.reduce((s,h)=>s+h.totalActualSeconds,0) });
  }
  const maxS = Math.max(...weekDays.map((w) => w.sessions), 1);
  const chartBars = weekDays.map((w) => `<div class="chart-col"><div class="chart-bar-track"><div class="chart-bar-fill" style="height:${(w.sessions/maxS)*100}%"></div></div><div class="chart-label">${w.label}</div><div class="chart-value">${w.sessions}</div></div>`).join('');

  // Deviation chart (#18)
  const last10 = [...historyData].reverse().slice(0, 10);
  const maxDev = Math.max(...last10.map((h) => Math.abs((h.totalActualSeconds - h.totalEstimatedSeconds) / (h.totalEstimatedSeconds || 1) * 100)), 1);
  const devBars = last10.map((h, i) => {
    const dev = ((h.totalActualSeconds - h.totalEstimatedSeconds) / (h.totalEstimatedSeconds || 1)) * 100;
    const pct = Math.abs(dev) / maxDev * 50;
    const isOver = dev >= 0;
    return `<div class="dev-col" title="${esc(h.routineName)}: ${isOver ? '+' : ''}${Math.round(dev)}%">
      <div class="dev-bar ${isOver ? 'over' : 'under'}" style="${isOver ? `top:${50-pct}%;height:${pct}%` : `top:50%;height:${pct}%`}"></div>
    </div>`;
  }).join('');

  container.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-value">${totalSessions}</div><div class="stat-label">${t('totalSessions')}</div></div>
      <div class="stat-card"><div class="stat-value">${totalHours}<span class="stat-unit">${t('hours')}</span></div><div class="stat-label">${t('totalTime')}</div></div>
      <div class="stat-card"><div class="stat-value">${currentStreak}</div><div class="stat-label">${t('currentStreak')}</div></div>
      <div class="stat-card"><div class="stat-value">${bestStreak}</div><div class="stat-label">${t('bestStreak')}</div></div>
      <div class="stat-card stat-card-wide"><div class="stat-value stat-value-sm">${esc(mostUsed)}</div><div class="stat-label">${t('mostUsed')}</div></div>
    </div>

    <div class="chart-section">
      <h3 class="chart-title">${t('thisWeek')} ${weekSessions}/${weeklyGoal}</h3>
      <div class="goal-track"><div class="goal-fill" style="width:${goalPct}%"></div></div>
      <div class="chart-container" style="margin-top:12px">${chartBars}</div>
    </div>

    <div class="chart-section" style="margin-top:24px">
      <h3 class="chart-title">${t('deviation')}</h3>
      <div class="dev-chart">
        <div class="dev-axis">+</div>
        <div class="dev-bars-container">${devBars}</div>
        <div class="dev-axis">−</div>
      </div>
    </div>`;
}

// ====== EXPORT STATS CSV (#19) ======

function exportStatsCsv() {
  const rows = [['Date','Routine','Total Time (s)','Estimated (s)','Deviation (%)','Notes']];
  historyData.forEach((h) => {
    rows.push([h.date, h.routineName, h.totalActualSeconds, h.totalEstimatedSeconds || 0,
      Math.round(((h.totalActualSeconds - (h.totalEstimatedSeconds || h.totalActualSeconds)) / (h.totalEstimatedSeconds || h.totalActualSeconds)) * 100),
      h.notes || '']);
  });
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `rutify-stats-${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ====== EXPORT / IMPORT ======

function exportRoutines() {
  const data = JSON.stringify({ routines, history: historyData }, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `rutify-backup-${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importRoutines(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.routines) routines = data.routines;
      if (data.history) historyData = data.history;
      save();
    } catch { alert(t('importError')); }
  };
  reader.readAsText(file);
}

// ====== SHARE (#9) ======

let shareRoutineData = null;

function openShareModal(routine) {
  shareRoutineData = routine;
  const data = JSON.stringify({ name: routine.name, description: routine.description, tags: routine.tags, exercises: routine.exercises }, null, 2);
  $('#shareTextarea').value = data;
  $('#shareModal').classList.add('open');
}

// ====== FOCUS MODE (#17) ======

if (window.electronAPI) {
  window.electronAPI.onFocusModeChanged((on) => {
    if (on) { $('#trafficLights').style.opacity = '0.3'; $$('.tl-btn').forEach((b) => b.style.pointerEvents = 'none'); }
    else { $('#trafficLights').style.opacity = '1'; $$('.tl-btn').forEach((b) => b.style.pointerEvents = ''); }
  });
}

// ====== INIT ======

applyTheme(currentTheme);
applyScale(currentScale);
applyLang(currentLang);
checkAutoDark();
if (autoDark) { setInterval(checkAutoDark, 60000); }
renderFilterChips();

// ---- Settings events ----

$$('.toggle-btn[data-lang]').forEach((b) => b.addEventListener('click', () => applyLang(b.dataset.lang)));
$$('.toggle-btn[data-theme]').forEach((b) => b.addEventListener('click', () => applyTheme(b.dataset.theme)));
$$('.size-btn').forEach((b) => b.addEventListener('click', () => applyScale(parseFloat(b.dataset.scale))));

// Auto dark
$('#autoDarkToggle').checked = autoDark;
$('#autoDarkToggle').addEventListener('change', () => {
  autoDark = $('#autoDarkToggle').checked;
  localStorage.setItem('rutify_autoDark', autoDark.toString());
  if (!autoDark) { applyTheme(localStorage.getItem('rutify_theme') || 'light'); }
  else checkAutoDark();
});

// Pomodoro settings
function setupPomSetting(id, storageKey, displayId, step) {
  const val = parseInt(localStorage.getItem(storageKey) || '25');
  $(`#${displayId}`).textContent = val;
  $(`#${id}Dec`).addEventListener('click', () => {
    let v = parseInt(localStorage.getItem(storageKey) || '25');
    v = Math.max(1, v - step);
    localStorage.setItem(storageKey, v.toString());
    $(`#${displayId}`).textContent = v;
  });
  $(`#${id}Inc`).addEventListener('click', () => {
    let v = parseInt(localStorage.getItem(storageKey) || '25');
    v = Math.min(120, v + step);
    localStorage.setItem(storageKey, v.toString());
    $(`#${displayId}`).textContent = v;
  });
}
setupPomSetting('pomodoro', 'rutify_pomodoro_length', 'pomodoroLength', 5);
setupPomSetting('shortBreak', 'rutify_short_break', 'shortBreakLength', 1);
setupPomSetting('longBreak', 'rutify_long_break', 'longBreakLength', 5);

// Sound
$('#soundSelect').value = localStorage.getItem('rutify_sound') || 'beep';
$('#soundSelect').addEventListener('change', () => {
  localStorage.setItem('rutify_sound', $('#soundSelect').value);
  $('#customSoundRow').style.display = $('#soundSelect').value === 'custom' ? 'block' : 'none';
});
if ($('#soundSelect').value === 'custom') $('#customSoundRow').style.display = 'block';
const savedSound = localStorage.getItem('rutify_custom_sound_name');
if (savedSound) $('#soundFileName').textContent = savedSound;
$('#uploadSoundBtn').addEventListener('click', () => $('#soundFileInput').click());
$('#soundFileInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    localStorage.setItem('rutify_custom_sound', ev.target.result);
    localStorage.setItem('rutify_custom_sound_name', file.name);
    $('#soundFileName').textContent = file.name;
  };
  reader.readAsDataURL(file);
  e.target.value = '';
});

// Weekly goal
const wg = parseInt(localStorage.getItem('rutify_weekly_goal') || '5');
$('#weeklyGoalValue').textContent = wg;
$('#weeklyGoalDec').addEventListener('click', () => {
  let v = parseInt(localStorage.getItem('rutify_weekly_goal') || '5');
  v = Math.max(1, v - 1);
  localStorage.setItem('rutify_weekly_goal', v.toString());
  $('#weeklyGoalValue').textContent = v;
});
$('#weeklyGoalInc').addEventListener('click', () => {
  let v = parseInt(localStorage.getItem('rutify_weekly_goal') || '5');
  v = Math.min(50, v + 1);
  localStorage.setItem('rutify_weekly_goal', v.toString());
  $('#weeklyGoalValue').textContent = v;
});

// Favorite filter
$('#favoriteFilterBtn').addEventListener('click', () => { favFilter = !favFilter; $('#favoriteFilterBtn').classList.toggle('active', favFilter); renderRoutines(); });

// Archive filter (#13)
$('#archiveFilterBtn').addEventListener('click', () => { showArchived = !showArchived; $('#archiveFilterBtn').classList.toggle('active', showArchived); renderRoutines(); });

// Search
$('#searchInput').addEventListener('input', () => { renderFilterChips(); renderRoutines(); });

// Templates grid events
$('#templatesGrid').addEventListener('click', (e) => {
  const btn = e.target.closest('.template-import-btn');
  if (btn) {
    const idx = parseInt(btn.dataset.index);
    if (!importedTemplates.includes(idx)) importedTemplates.push(idx);
    const tmpl = TEMPLATES[idx];
    routines.push({ id: Date.now().toString(), name: tmpl.name, description: tmpl.description, tags: [], category: tmpl.category, repeat: 'none', exercises: tmpl.exercises.map((e) => ({ ...e })), favorite: false, archived: false, createdAt: new Date().toISOString(), lastUsed: null });
    save();
    renderTemplates();
  }
});

// New routine
$('#addRoutineBtn').addEventListener('click', () => openModal(null));

// Modal close
$('#closeModalBtn').addEventListener('click', closeModal);
$('#cancelModalBtn').addEventListener('click', closeModal);
$('#routineModal').addEventListener('click', (e) => { if (e.target === e.currentTarget) closeModal(); });

// Add task
$('#addTaskBtn').addEventListener('click', addTaskToDOM);
$('#tasksList').addEventListener('click', (e) => { if (e.target.closest('.remove-exercise')) e.target.closest('.exercise-item').remove(); });

// Save routine
$('#saveRoutineBtn').addEventListener('click', saveRoutine);

// Routine card actions
$('#routinesGrid').addEventListener('click', (e) => {
  const editBtn = e.target.closest('.edit-btn');
  const deleteBtn = e.target.closest('.delete-btn');
  const startBtn = e.target.closest('.start-btn');
  const favBtn = e.target.closest('.fav-btn');
  const shareBtn = e.target.closest('.share-btn');
  const archiveBtn = e.target.closest('.archive-btn');
  if (favBtn) { e.stopPropagation(); const r = routines.find((r) => r.id === favBtn.dataset.id); if (r) { r.favorite = !r.favorite; save(); } return; }
  if (startBtn) { e.stopPropagation(); const r = routines.find((r) => r.id === startBtn.dataset.id); if (r) startTimer(r); return; }
  if (shareBtn) { e.stopPropagation(); const r = routines.find((r) => r.id === shareBtn.dataset.id); if (r) openShareModal(r); return; }
  if (editBtn) { e.stopPropagation(); const r = routines.find((r) => r.id === editBtn.dataset.id); if (r) openModal(r); return; }
  if (archiveBtn) { e.stopPropagation(); archiveTargetId = archiveBtn.dataset.id; $('#confirmArchiveModal').classList.add('open'); return; }
  if (deleteBtn) { e.stopPropagation(); deleteTargetId = deleteBtn.dataset.id; $('#confirmModal').classList.add('open'); return; }
});

// Confirm delete
$('#cancelDeleteBtn').addEventListener('click', () => { $('#confirmModal').classList.remove('open'); deleteTargetId = null; });
$('#confirmDeleteBtn').addEventListener('click', () => { if (deleteTargetId) { routines = routines.filter((r) => r.id !== deleteTargetId); save(); deleteTargetId = null; } $('#confirmModal').classList.remove('open'); });
$('#confirmModal').addEventListener('click', (e) => { if (e.target === e.currentTarget) { $('#confirmModal').classList.remove('open'); deleteTargetId = null; } });

// Confirm archive (#13)
$('#cancelArchiveBtn').addEventListener('click', () => { $('#confirmArchiveModal').classList.remove('open'); archiveTargetId = null; });
$('#confirmArchiveBtn').addEventListener('click', () => {
  if (archiveTargetId) {
    const r = routines.find((r) => r.id === archiveTargetId);
    if (r) { r.archived = !r.archived; save(); }
    archiveTargetId = null;
  }
  $('#confirmArchiveModal').classList.remove('open');
});

// History delete
$('#historyList').addEventListener('click', (e) => {
  const delBtn = e.target.closest('.history-delete-btn');
  if (delBtn) { deleteHistoryTargetId = delBtn.dataset.id; $('#confirmHistoryModal').classList.add('open'); }
});
$('#cancelHistoryDeleteBtn').addEventListener('click', () => { $('#confirmHistoryModal').classList.remove('open'); deleteHistoryTargetId = null; });
$('#confirmHistoryDeleteBtn').addEventListener('click', () => { if (deleteHistoryTargetId) { deleteHistoryEntry(deleteHistoryTargetId); deleteHistoryTargetId = null; } $('#confirmHistoryModal').classList.remove('open'); });
$('#confirmHistoryModal').addEventListener('click', (e) => { if (e.target === e.currentTarget) { $('#confirmHistoryModal').classList.remove('open'); deleteHistoryTargetId = null; } });

// Timer events
$('#closeTimerBtn').addEventListener('click', () => { if (timerState) stopTimer(); if (pomodoroState) stopPomodoro(); });
$('#timerModal').addEventListener('click', (e) => { if (e.target === e.currentTarget) { if (timerState) stopTimer(); if (pomodoroState) stopPomodoro(); } });
$('#timerPauseBtn').addEventListener('click', togglePause);
$('#timerStopBtn').addEventListener('click', stopTimer);
$('#timerSkipBtn').addEventListener('click', resumeFromRest);
$('#timerFinishBtn').addEventListener('click', finishRoutine);

// Pomodoro events
$('#pomodoroPauseBtn').addEventListener('click', togglePomodoroPause);
$('#pomodoroStopBtn').addEventListener('click', stopPomodoro);

// Pin (#5) / Popout (#20)
let popoutOpen = false;
$('#timerPinBtn').addEventListener('click', () => {
  isPinned = !isPinned;
  $('#timerPinBtn').classList.toggle('active', isPinned);
  if (window.electronAPI) window.electronAPI.setAlwaysOnTop(isPinned);
});
$('#timerPopoutBtn').addEventListener('click', () => {
  if (!timerState) return;
  if (popoutOpen) { closeTimerPopup(); popoutOpen = false; return; }
  popoutOpen = true;
  if (window.electronAPI) {
    window.electronAPI.openTimerPopup({
      taskName: timerState.tasks[timerState.currentTask]?.name || '',
      secondsRemaining: timerState.secondsRemaining,
      progress: timerState.totalSeconds > 0 ? ((timerState.totalSeconds - timerState.secondsRemaining) / timerState.totalSeconds) * 100 : 0,
      current: timerState.currentTask + 1,
      total: timerState.tasks.length,
    });
  }
});

// Share modal
$('#closeShareBtn').addEventListener('click', () => $('#shareModal').classList.remove('open'));
$('#shareModal').addEventListener('click', (e) => { if (e.target === e.currentTarget) $('#shareModal').classList.remove('open'); });
$('#copyShareBtn').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText($('#shareTextarea').value);
    $('#copyShareBtn').textContent = t('copied');
    setTimeout(() => { $('#copyShareBtn').textContent = t('copyToClipboard'); }, 2000);
  } catch {}
});
$('#downloadShareBtn').addEventListener('click', () => {
  const blob = new Blob([$('#shareTextarea').value], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `rutify-${(shareRoutineData?.name || 'routine').replace(/\s+/g, '-').toLowerCase()}.json`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// Export/Import
$('#exportBtn').addEventListener('click', exportRoutines);
$('#importBtn').addEventListener('click', () => $('#importFileInput').click());
$('#importFileInput').addEventListener('change', (e) => { if (e.target.files[0]) { importRoutines(e.target.files[0]); e.target.value = ''; renderFilterChips(); } });

// Export CSV stats
$('#exportStatsCsvBtn').addEventListener('click', exportStatsCsv);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if ($('#timerModal').classList.contains('open')) { if (timerState) stopTimer(); if (pomodoroState) stopPomodoro(); return; }
    if ($('#routineModal').classList.contains('open')) { closeModal(); return; }
    if ($('#shareModal').classList.contains('open')) { $('#shareModal').classList.remove('open'); return; }
    if ($('#confirmModal').classList.contains('open')) { $('#confirmModal').classList.remove('open'); deleteTargetId = null; }
    if ($('#confirmHistoryModal').classList.contains('open')) { $('#confirmHistoryModal').classList.remove('open'); deleteHistoryTargetId = null; }
    if ($('#confirmArchiveModal').classList.contains('open')) { $('#confirmArchiveModal').classList.remove('open'); archiveTargetId = null; }
  }
  if (e.key === 'Enter' && $('#routineModal').classList.contains('open')) {
    const active = document.activeElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA') && active.id !== 'saveRoutineBtn') return;
    $('#saveRoutineBtn').click();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'n') { e.preventDefault(); openModal(null); }
  if ((e.ctrlKey || e.metaKey) && e.key === 'f') { e.preventDefault(); $('#searchInput').focus(); }
});

// Navigation
$$('.nav-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    $$('.nav-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const view = btn.dataset.view;
    $$('.view').forEach((v) => v.classList.remove('active'));
    const target = $(`#${view}View`);
    if (target) {
      target.classList.add('active');
      target.style.animation = 'none'; void target.offsetHeight; target.style.animation = '';
    }
    if (view === 'settings') {
      $$('.settings-card').forEach((card, i) => { card.style.setProperty('--i', i); card.style.animation = 'none'; void card.offsetHeight; card.style.animation = ''; });
    }
    if (view === 'history') renderHistory();
    if (view === 'stats') renderStats();
    if (view === 'templates') renderTemplates();
  });
});

// Window controls
$('#minimizeBtn').addEventListener('click', () => window.electronAPI?.minimize());
$('#maximizeBtn').addEventListener('click', () => window.electronAPI?.maximize());
$('#closeBtn').addEventListener('click', () => window.electronAPI?.close());

// Auto-update
if (window.electronAPI) {
  window.electronAPI.getAppVersion().then((v) => $('#appVersion').textContent = v);
  window.electronAPI.onUpdateStatus(({ status, data }) => {
    const el = $('#updateStatus');
    const d = $('#downloadUpdateBtn'), i = $('#installUpdateBtn'), c = $('#checkUpdatesBtn');
    switch (status) {
      case 'checking': el.innerHTML = `<span class="checking">${t('checking')}</span>`; c.disabled = true; break;
      case 'available': el.innerHTML = `<span class="available">${t('available')} v${data.version}</span>`; d.style.display = ''; c.disabled = false; break;
      case 'not-available': el.innerHTML = `<span class="done">${t('notAvailable')}</span>`; c.disabled = false; break;
      case 'downloading': el.innerHTML = `<span class="downloading">${t('downloading').replace('{{percent}}', Math.round(data.percent || 0))}</span>`; d.style.display = 'none'; break;
      case 'downloaded': el.innerHTML = `<span class="done">${t('downloaded')}</span>`; i.style.display = ''; d.style.display = 'none'; break;
      case 'error': el.innerHTML = `<span class="error">${t('error')}</span>`; c.disabled = false; break;
    }
  });
  $('#checkUpdatesBtn').addEventListener('click', () => window.electronAPI.checkForUpdates());
  $('#downloadUpdateBtn').addEventListener('click', () => window.electronAPI.downloadUpdate());
  $('#installUpdateBtn').addEventListener('click', () => window.electronAPI.installUpdate());
}

// Ripple effect
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-primary, .btn-secondary, .btn-danger');
  if (!btn) return;
  const rect = btn.getBoundingClientRect();
  btn.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
  btn.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
});

// Init
renderRoutines();
