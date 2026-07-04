const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const i18n = {
  en: {
    routines: 'Routines',
    history: 'History',
    stats: 'Stats',
    settings: 'Settings',
    newRoutine: 'New Routine',
    routineName: 'Routine Name',
    description: 'Description',
    exercises: 'Exercises',
    addExercise: 'Add Exercise',
    cancel: 'Cancel',
    saveRoutine: 'Save Routine',
    deleteRoutine: 'Delete Routine',
    deleteConfirm: 'Are you sure you want to delete this routine?',
    delete: 'Delete',
    language: 'Language / Idioma',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    interfaceSize: 'Interface Size',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    xlarge: 'X-Large',
    updates: 'Updates',
    currentVersion: 'Version',
    checkUpdates: 'Check for Updates',
    downloadUpdate: 'Download Update',
    installUpdate: 'Restart & Install',
    checking: 'Checking for updates...',
    available: 'New version available!',
    notAvailable: 'You have the latest version.',
    downloading: 'Downloading... {{percent}}%',
    downloaded: 'Update ready. Restart to install.',
    error: 'Update check failed.',
    noRoutines: 'No Routines Yet',
    noRoutinesDesc: 'Click "New Routine" to create your first routine.',
    noExercises: 'No exercises yet. Add one below.',
    exerciseName: 'Exercise name',
    durationMin: 'min',
    noHistory: 'No History Yet',
    historyDesc: 'Completed routines will appear here.',
    noStats: 'No Stats Available',
    statsDesc: 'Complete some routines to see your stats.',
    edit: 'Edit',
    searchPlaceholder: 'Search routines...',
    editRoutine: 'Edit Routine',
    nameRequired: 'Please enter a routine name.',
  },
  es: {
    routines: 'Rutinas',
    history: 'Historial',
    stats: 'Estadísticas',
    settings: 'Ajustes',
    newRoutine: 'Nueva Rutina',
    routineName: 'Nombre de la Rutina',
    description: 'Descripción',
    exercises: 'Ejercicios',
    addExercise: 'Agregar Ejercicio',
    cancel: 'Cancelar',
    saveRoutine: 'Guardar Rutina',
    deleteRoutine: 'Eliminar Rutina',
    deleteConfirm: '¿Estás seguro de que quieres eliminar esta rutina?',
    delete: 'Eliminar',
    language: 'Idioma / Language',
    theme: 'Tema',
    light: 'Claro',
    dark: 'Oscuro',
    interfaceSize: 'Tamaño de Interfaz',
    small: 'Pequeño',
    medium: 'Mediano',
    large: 'Grande',
    xlarge: 'Muy Grande',
    updates: 'Actualizaciones',
    currentVersion: 'Versión',
    checkUpdates: 'Buscar Actualizaciones',
    downloadUpdate: 'Descargar Actualización',
    installUpdate: 'Reiniciar e Instalar',
    checking: 'Buscando actualizaciones...',
    available: '¡Nueva versión disponible!',
    notAvailable: 'Tienes la última versión.',
    downloading: 'Descargando... {{percent}}%',
    downloaded: 'Actualización lista. Reinicia para instalar.',
    error: 'Error al buscar actualizaciones.',
    noRoutines: 'Sin Rutinas',
    noRoutinesDesc: 'Haz clic en "Nueva Rutina" para crear tu primera rutina.',
    noExercises: 'Sin ejercicios. Agrega uno abajo.',
    exerciseName: 'Nombre del ejercicio',
    durationMin: 'min',
    noHistory: 'Sin Historial',
    historyDesc: 'Las rutinas completadas aparecerán aquí.',
    noStats: 'Sin Estadísticas',
    statsDesc: 'Completa algunas rutinas para ver tus estadísticas.',
    edit: 'Editar',
    searchPlaceholder: 'Buscar rutinas...',
    editRoutine: 'Editar Rutina',
    nameRequired: 'Por favor ingresa un nombre para la rutina.',
  },
};

let currentLang = localStorage.getItem('rutify_lang') || 'en';
let currentTheme = localStorage.getItem('rutify_theme') || 'light';
let currentScale = parseFloat(localStorage.getItem('rutify_scale') || '1.0');

let routines = JSON.parse(localStorage.getItem('rutify_routines') || '[]');
let editingId = null;
let deleteTargetId = null;

function t(key) {
  return i18n[currentLang][key] || key;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = t(key);
    } else if (el.tagName === 'SPAN' && el.parentElement?.dataset?.i18n) {
      // nested span inside nav-btn or btn, skip (parent handled)
    } else {
      el.textContent = t(key);
    }
  });
  const searchInput = $('#searchInput');
  if (searchInput) searchInput.placeholder = t('searchPlaceholder');
}

function applyTheme(theme) {
  currentTheme = theme;
  localStorage.setItem('rutify_theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
  $$('.toggle-btn[data-theme]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.theme === theme);
  });
}

function applyScale(scale) {
  currentScale = scale;
  localStorage.setItem('rutify_scale', scale.toString());
  document.body.style.zoom = scale;
  $$('.size-btn').forEach((btn) => {
    btn.classList.toggle('active', Math.abs(parseFloat(btn.dataset.scale) - scale) < 0.01);
  });
}

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('rutify_lang', lang);
  document.documentElement.lang = lang;
  $$('.toggle-btn[data-lang]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  applyTranslations();
  renderRoutines();
}

function save() {
  localStorage.setItem('rutify_routines', JSON.stringify(routines));
  renderRoutines();
}

function esc(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function totalDuration(exercises) {
  if (!exercises || exercises.length === 0) return 0;
  return exercises.reduce((sum, e) => sum + (parseInt(e.duration) || 0), 0);
}

function renderRoutines() {
  const grid = $('#routinesGrid');
  const search = ($('#searchInput').value || '').toLowerCase();
  const filtered = routines.filter((r) =>
    r.name.toLowerCase().includes(search)
  );

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg>
        <h2>${t('noRoutines')}</h2>
        <p>${t('noRoutinesDesc')}</p>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map((r, idx) => `
    <div class="routine-card" data-id="${r.id}" style="--i: ${idx}">
      <div class="routine-card-header">
        <h3>${esc(r.name)}</h3>
        <div class="routine-card-actions">
          <button class="edit-btn" data-id="${r.id}" title="${t('edit')}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="delete-btn" data-id="${r.id}" title="${t('delete')}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
          </button>
        </div>
      </div>
      ${r.description ? `<p>${esc(r.description)}</p>` : ''}
      <div class="routine-card-meta">
        <span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          ${r.exercises ? r.exercises.length : 0} ${t('exercises').toLowerCase()}
        </span>
        <span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          ${totalDuration(r.exercises)} ${t('durationMin')}
        </span>
      </div>
    </div>
  `).join('');
}

function openModal(routine) {
  editingId = routine ? routine.id : null;
  $('#modalTitle').textContent = routine ? t('editRoutine') : t('newRoutine');
  $('#routineName').value = routine ? routine.name : '';
  $('#routineDescription').value = routine ? (routine.description || '') : '';
  renderExercises(routine ? routine.exercises : []);
  $('#routineModal').classList.add('open');
  $('#routineName').focus();
}

function closeModal() {
  $('#routineModal').classList.remove('open');
  editingId = null;
}

function renderExercises(exercises) {
  const container = $('#exercisesList');
  if (!exercises || exercises.length === 0) {
    container.innerHTML = `
      <div style="padding:12px;text-align:center;color:var(--text-tertiary);font-size:13px">
        ${t('noExercises')}
      </div>`;
    return;
  }
  container.innerHTML = exercises.map((e, i) => `
    <div class="exercise-item" data-index="${i}" style="--i: ${i}">
      <input type="text" class="exercise-name" value="${esc(e.name || '')}" placeholder="${t('exerciseName')}" />
      <input type="number" class="exercise-duration" value="${e.duration || ''}" placeholder="${t('durationMin')}" min="0" />
      <button class="remove-exercise" data-index="${i}">
        <svg width="12" height="12" viewBox="0 0 12 12"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>
      </button>
    </div>
  `).join('');
}

function getExercisesFromDOM() {
  const items = $$('.exercise-item');
  return Array.from(items).map((el) => ({
    name: el.querySelector('.exercise-name').value.trim(),
    duration: parseInt(el.querySelector('.exercise-duration').value) || 0,
  })).filter((e) => e.name !== '');
}

function addExerciseToDOM() {
  const container = $('#exercisesList');
  container.innerHTML = '';
  const div = document.createElement('div');
  div.className = 'exercise-item';
  div.innerHTML = `
    <input type="text" class="exercise-name" value="" placeholder="${t('exerciseName')}" />
    <input type="number" class="exercise-duration" value="" placeholder="${t('durationMin')}" min="0" />
    <button class="remove-exercise">
      <svg width="12" height="12" viewBox="0 0 12 12"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>
    </button>
  `;
  container.appendChild(div);
  div.querySelector('.exercise-name').focus();
}

// Settings initialization
applyTheme(currentTheme);
applyScale(currentScale);
applyLang(currentLang);

// Settings event handlers
$$('.toggle-btn[data-lang]').forEach((btn) => {
  btn.addEventListener('click', () => applyLang(btn.dataset.lang));
});

$$('.toggle-btn[data-theme]').forEach((btn) => {
  btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
});

$$('.size-btn').forEach((btn) => {
  btn.addEventListener('click', () => applyScale(parseFloat(btn.dataset.scale)));
});

// Search
$('#searchInput').addEventListener('input', renderRoutines);

// New routine
$('#addRoutineBtn').addEventListener('click', () => openModal(null));

// Modal close
$('#closeModalBtn').addEventListener('click', closeModal);
$('#cancelModalBtn').addEventListener('click', closeModal);
$('#routineModal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeModal();
});

// Add exercise
$('#addExerciseBtn').addEventListener('click', addExerciseToDOM);

// Remove exercise
$('#exercisesList').addEventListener('click', (e) => {
  if (e.target.closest('.remove-exercise')) {
    const item = e.target.closest('.exercise-item');
    item.remove();
  }
});

// Save routine
$('#saveRoutineBtn').addEventListener('click', () => {
  const name = $('#routineName').value.trim();
  if (!name) {
    $('#routineName').focus();
    $('#routineName').style.borderColor = 'var(--danger)';
    setTimeout(() => $('#routineName').style.borderColor = '', 1500);
    return;
  }
  const description = $('#routineDescription').value.trim();
  const exercises = getExercisesFromDOM();

  if (editingId) {
    const idx = routines.findIndex((r) => r.id === editingId);
    if (idx !== -1) {
      routines[idx] = { ...routines[idx], name, description, exercises };
    }
  } else {
    routines.push({
      id: Date.now().toString(),
      name,
      description,
      exercises,
      createdAt: new Date().toISOString(),
    });
  }
  save();
  closeModal();
});

// Routine card actions
$('#routinesGrid').addEventListener('click', (e) => {
  const editBtn = e.target.closest('.edit-btn');
  const deleteBtn = e.target.closest('.delete-btn');

  if (editBtn) {
    e.stopPropagation();
    const id = editBtn.dataset.id;
    const routine = routines.find((r) => r.id === id);
    if (routine) openModal(routine);
    return;
  }
  if (deleteBtn) {
    e.stopPropagation();
    const id = deleteBtn.dataset.id;
    deleteTargetId = id;
    $('#confirmModal').classList.add('open');
    return;
  }
});

// Confirm delete
$('#cancelDeleteBtn').addEventListener('click', () => {
  $('#confirmModal').classList.remove('open');
  deleteTargetId = null;
});

$('#confirmDeleteBtn').addEventListener('click', () => {
  if (deleteTargetId) {
    routines = routines.filter((r) => r.id !== deleteTargetId);
    save();
    deleteTargetId = null;
  }
  $('#confirmModal').classList.remove('open');
});

$('#confirmModal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) {
    $('#confirmModal').classList.remove('open');
    deleteTargetId = null;
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if ($('#routineModal').classList.contains('open')) closeModal();
    if ($('#confirmModal').classList.contains('open')) {
      $('#confirmModal').classList.remove('open');
      deleteTargetId = null;
    }
  }
  if (e.key === 'Enter' && $('#routineModal').classList.contains('open')) {
    const active = document.activeElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA') && active.id !== 'saveRoutineBtn') return;
    $('#saveRoutineBtn').click();
  }
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
      target.style.animation = 'none';
      void target.offsetHeight;
      target.style.animation = '';
    }
    if (view === 'settings') {
      $$('.settings-card').forEach((card, i) => {
        card.style.setProperty('--i', i);
        card.style.animation = 'none';
        void card.offsetHeight;
        card.style.animation = '';
      });
    }
  });
});

// Window controls
$('#minimizeBtn').addEventListener('click', () => window.electronAPI.minimize());
$('#maximizeBtn').addEventListener('click', () => window.electronAPI.maximize());
$('#closeBtn').addEventListener('click', () => window.electronAPI.close());

// Auto-update
if (window.electronAPI) {
  window.electronAPI.getAppVersion().then((version) => {
    $('#appVersion').textContent = version;
  });

  window.electronAPI.onUpdateStatus(({ status, data }) => {
    const el = $('#updateStatus');
    const downloadBtn = $('#downloadUpdateBtn');
    const installBtn = $('#installUpdateBtn');
    const checkBtn = $('#checkUpdatesBtn');

    switch (status) {
      case 'checking':
        el.innerHTML = `<span class="checking">${t('checking')}</span>`;
        checkBtn.disabled = true;
        break;
      case 'available':
        el.innerHTML = `<span class="available">${t('available')} v${data.version}</span>`;
        downloadBtn.style.display = '';
        checkBtn.disabled = false;
        break;
      case 'not-available':
        el.innerHTML = `<span class="done">${t('notAvailable')}</span>`;
        checkBtn.disabled = false;
        break;
      case 'downloading':
        el.innerHTML = `<span class="downloading">${t('downloading').replace('{{percent}}', Math.round(data.percent || 0))}</span>`;
        downloadBtn.style.display = 'none';
        break;
      case 'downloaded':
        el.innerHTML = `<span class="done">${t('downloaded')}</span>`;
        installBtn.style.display = '';
        downloadBtn.style.display = 'none';
        break;
      case 'error':
        el.innerHTML = `<span class="error">${t('error')}</span>`;
        checkBtn.disabled = false;
        break;
    }
  });

  $('#checkUpdatesBtn').addEventListener('click', () => {
    window.electronAPI.checkForUpdates();
  });

  $('#downloadUpdateBtn').addEventListener('click', () => {
    window.electronAPI.downloadUpdate();
  });

  $('#installUpdateBtn').addEventListener('click', () => {
    window.electronAPI.installUpdate();
  });
}

// Ripple effect on buttons
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-primary, .btn-secondary, .btn-danger');
  if (!btn) return;
  const rect = btn.getBoundingClientRect();
  btn.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
  btn.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
});

// Init
renderRoutines();
