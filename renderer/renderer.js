const uploadsList = document.getElementById('uploadsList');
const calendarEl = document.getElementById('calendar');
const monthLabel = document.getElementById('monthLabel');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');

const collapseToggle = document.getElementById('collapseToggle');
const rightPanel = document.querySelector('.right-panel');
const uploadBtn = document.getElementById('uploadBtn');
const testBtn = document.getElementById('testBtn');
const checkBtn = document.getElementById('checkBtn');
const osceBtn = document.getElementById('osceBtn');
const settingsBtn = document.getElementById('settingsBtn');
const uploadBtnClassic = document.getElementById('uploadBtnClassic');
const testBtnClassic = document.getElementById('testBtnClassic');
const checkBtnClassic = document.getElementById('checkBtnClassic');
const osceBtnClassic = document.getElementById('osceBtnClassic');
const calendarBtnClassic = document.getElementById('calendarBtnClassic');
const calendarModal = document.getElementById('calendarModal');
const closeCalendarModal = document.getElementById('closeCalendarModal');
const diagnoseTab = document.getElementById('diagnoseTab');
const myHeartTab = document.getElementById('myHeartTab');

const filesModal = document.getElementById('filesModal');
const filesModalList = document.getElementById('filesModalList');
const closeFilesModal = document.getElementById('closeFilesModal');
const renameModal = document.getElementById('renameModal');
const renameForm = document.getElementById('renameForm');
const renameList = document.getElementById('renameList');
const uploadDateInput = document.getElementById('uploadDateInput');
const cancelRename = document.getElementById('cancelRename');
const limitModal = document.getElementById('limitModal');
const limitModalMessage = document.getElementById('limitModalMessage');
const closeLimitModal = document.getElementById('closeLimitModal');
const dismissLimitModal = document.getElementById('dismissLimitModal');
const osceUnavailableModal = document.getElementById('osceUnavailableModal');
const osceUnavailableMessage = document.getElementById('osceUnavailableMessage');
const closeOsceUnavailableModal = document.getElementById('closeOsceUnavailableModal');
const dismissOsceUnavailableModal = document.getElementById('dismissOsceUnavailableModal');
const deleteModal = document.getElementById('deleteModal');
const deleteDocumentName = document.getElementById('deleteDocumentName');
const closeDeleteModal = document.getElementById('closeDeleteModal');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const resetModal = document.getElementById('resetModal');
const closeResetModal = document.getElementById('closeResetModal');
const cancelResetBtn = document.getElementById('cancelResetBtn');
const confirmResetBtn = document.getElementById('confirmResetBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettingsModal = document.getElementById('closeSettingsModal');
const appearanceTab = document.getElementById('appearanceTab');
const termsTab = document.getElementById('termsTab');
const appearancePanel = document.getElementById('appearancePanel');
const termsPanel = document.getElementById('termsPanel');
const guideModal = document.getElementById('guideModal');
const openGuideBtn = document.getElementById('openGuideBtn');
const closeGuideModal = document.getElementById('closeGuideModal');
const accountBtn = document.getElementById('accountBtn');
const accountModal = document.getElementById('accountModal');
const closeAccountModal = document.getElementById('closeAccountModal');
const accountForm = document.getElementById('accountForm');
const accountNameInput = document.getElementById('accountNameInput');
const accountPictureInput = document.getElementById('accountPictureInput');
const clearAccountBtn = document.getElementById('clearAccountBtn');
const accountAvatar = document.getElementById('accountAvatar');
const accountLabel = document.getElementById('accountLabel');
const accountPreviewAvatar = document.getElementById('accountPreviewAvatar');
const accountPreviewName = document.getElementById('accountPreviewName');

const pages = {
  home: document.getElementById('homePage'),
  calendar: document.getElementById('calendarPage'),
  heart: document.getElementById('heartPage'),
  test: document.getElementById('testPage'),
  questions: document.getElementById('questionsPage'),
  osce: document.getElementById('oscePage')
};
const schedulePanel = document.querySelector('#homePage .right-panel');
if (calendarModal && schedulePanel) {
  calendarModal.querySelector('.calendar-modal-panel').appendChild(schedulePanel);
}
const testDocuments = document.getElementById('testDocuments');
const questionsTitle = document.getElementById('questionsTitle');
const questionsList = document.getElementById('questionsList');
const documentSearch = document.getElementById('documentSearch');
const searchResults = document.getElementById('searchResults');
const allDocumentsBtn = document.getElementById('allDocumentsBtn');
const questionStatus = document.getElementById('questionStatus');
const objectivesList = document.getElementById('objectivesList');
const resetQuestionsBtn = document.getElementById('resetQuestionsBtn');
const osceListView = document.getElementById('osceListView');
const oscePlayerView = document.getElementById('oscePlayerView');
const osceDocumentPicker = document.getElementById('osceDocumentPicker');
const osceTopicInput = document.getElementById('osceTopicInput');
const generateOsceBtn = document.getElementById('generateOsceBtn');
const refreshOsceBtn = document.getElementById('refreshOsceBtn');
const osceStatus = document.getElementById('osceStatus');
const osceStations = document.getElementById('osceStations');
const oscePlayerTitle = document.getElementById('oscePlayerTitle');
const osceTimer = document.getElementById('osceTimer');
const osceCandidateBrief = document.getElementById('osceCandidateBrief');
const oscePatientBrief = document.getElementById('oscePatientBrief');
const oscePatientPanel = document.getElementById('oscePatientPanel');
const osceChatPanel = document.getElementById('osceChatPanel');
const osceChatTranscript = document.getElementById('osceChatTranscript');
const osceChatForm = document.getElementById('osceChatForm');
const osceChatInput = document.getElementById('osceChatInput');
const osceStartControls = document.getElementById('osceStartControls');
const osceActiveControls = document.getElementById('osceActiveControls');
const osceFinishPanel = document.getElementById('osceFinishPanel');
const oscePerformanceText = document.getElementById('oscePerformanceText');
const osceVerdictText = document.getElementById('osceVerdictText');
const osceMarkResult = document.getElementById('osceMarkResult');
const copyFormatPromptBtn = document.getElementById('copyFormatPromptBtn');
const formatPromptText = document.getElementById('formatPromptText');

const UPLOADS_STORAGE_KEY = 'docop.uploads';
const THEME_STORAGE_KEY = 'docop.theme';
const ACCOUNT_STORAGE_KEY = 'docop.account';

let viewDate = new Date();
let selectedDate = new Date();
let selectedUploadId = null;
let selectedQuestionMode = null;
let pendingRenameResolve = null;
let pendingDeleteResolve = null;
let pendingResetResolve = null;
let currentStudyPack = null;
let selectedOsceDocIds = [];
let currentOsceStation = null;
let osceSecondsLeft = 0;
let osceTimerId = null;
let osceChatHistory = [];
let oscePhase = 'idle';

function loadAccountProfile() {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNT_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function renderAccountProfile(profile = {}) {
  const name = String(profile.name || '').trim();
  const initial = (name[0] || 'A').toUpperCase();
  [accountAvatar, accountPreviewAvatar].forEach(element => {
    element.textContent = profile.picture ? '' : initial;
    element.style.backgroundImage = profile.picture ? `url("${profile.picture}")` : '';
  });
  accountLabel.textContent = name || 'Account';
  accountPreviewName.textContent = name || 'Your name';
  accountNameInput.value = name;
}

function readProfilePicture(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve('');
      return;
    }
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(String(reader.result || '')));
    reader.addEventListener('error', reject);
    reader.readAsDataURL(file);
  });
}

function packAnswer(questionId) {
  return currentStudyPack?.answers?.[questionId] || null;
}

function applyTheme(theme) {
  const selectedTheme = theme === 'pink' ? 'pink' : 'dark';
  document.body.classList.toggle('theme-light', selectedTheme === 'light');
  document.body.classList.toggle('theme-dark', selectedTheme === 'dark');
  document.body.classList.toggle('theme-pink', selectedTheme === 'pink');
  localStorage.setItem(THEME_STORAGE_KEY, selectedTheme);
  appearancePanel.querySelector('.appearance-note').textContent = selectedTheme === 'pink'
    ? 'Pink appearance is currently in use.'
    : 'Dark appearance is currently in use.';
  document.querySelectorAll('input[name="appTheme"]').forEach(input => {
    input.checked = input.value === selectedTheme;
    const label = input.closest('label');
    const labelText = label?.querySelector('span');
    if (labelText) labelText.textContent = input.value === 'pink' ? 'Pink' : 'Dark';
  });
}

function setSettingsTab(tab) {
  const isAppearance = tab === 'appearance';
  appearanceTab.classList.toggle('active', isAppearance);
  termsTab.classList.toggle('active', !isAppearance);
  appearanceTab.setAttribute('aria-selected', String(isAppearance));
  termsTab.setAttribute('aria-selected', String(!isAppearance));
  appearancePanel.hidden = !isAppearance;
  termsPanel.hidden = isAppearance;
}

function openSettingsModal() {
  setSettingsTab('appearance');
  settingsModal.setAttribute('aria-hidden', 'false');
}

function closeSettings() {
  settingsModal.setAttribute('aria-hidden', 'true');
}

function questionTypeLabel(type) {
  return type === 'clinical' ? 'Clinical' : type === 'theoretical' ? 'Theoretical' : 'Mixed';
}

function feedbackText(feedback) {
  if (!feedback) return '';
  const notes = Array.isArray(feedback.improvements) ? feedback.improvements.join(' ') : '';
  if (feedback.verdict || feedback.score || feedback.explanation) {
    return `${feedback.verdict || 'Feedback'} (${feedback.score || 0}/100): ${feedback.explanation || ''} ${notes}`.trim();
  }
  return String(feedback);
}

function makeUploadId(upload) {
  return `${upload.path || upload.name || 'file'}-${upload.uploadedAt || ''}`;
}

function normalizeUpload(upload) {
  return {
    id: upload.id || makeUploadId(upload),
    uploadNumber: Number(upload.uploadNumber) || 0,
    originalPath: upload.originalPath || '',
    path: upload.path || '',
    name: upload.name || 'Untitled file',
    uploadedAt: upload.uploadedAt || new Date().toISOString(),
    objectives: Array.isArray(upload.objectives) ? upload.objectives : [],
    text: upload.text || '',
    textLength: Number(upload.textLength) || (upload.text || '').length,
    readingStatus: upload.readingStatus || ((upload.text || '').trim().length < 40 ? 'unreadable' : (upload.text || '').trim().length < 200 ? 'limited' : 'ready')
  };
}

function sortUploads(uploads) {
  return [...uploads].sort((a, b) => {
    const aNumber = Number(a.uploadNumber) || Number.MAX_SAFE_INTEGER;
    const bNumber = Number(b.uploadNumber) || Number.MAX_SAFE_INTEGER;
    const numberDiff = aNumber - bNumber;
    if (numberDiff !== 0) return numberDiff;
    return new Date(a.uploadedAt) - new Date(b.uploadedAt);
  });
}

function ensureUploadNumbers(uploads) {
  const ordered = sortUploads(uploads);
  let nextNumber = ordered.reduce((max, upload) => Math.max(max, Number(upload.uploadNumber) || 0), 0) + 1;
  return ordered.map(upload => {
    if (Number(upload.uploadNumber) > 0) return upload;
    const numbered = { ...upload, uploadNumber: nextNumber };
    nextNumber += 1;
    return numbered;
  });
}

function loadStoredUploads() {
  try {
    const raw = localStorage.getItem(UPLOADS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? ensureUploadNumbers(parsed.map(normalizeUpload)) : [];
  } catch (e) {
    console.error('loadStoredUploads error', e);
    return [];
  }
}

function saveStoredUploads(uploads) {
  localStorage.setItem(UPLOADS_STORAGE_KEY, JSON.stringify(ensureUploadNumbers(uploads).map(normalizeUpload)));
}

function syncStoredUploads(incoming) {
  const synced = ensureUploadNumbers((incoming || []).map(normalizeUpload));
  saveStoredUploads(synced);
  return synced;
}

function mergeStoredUploads(incoming) {
  const existing = loadStoredUploads();
  const byId = new Map(existing.map(upload => [upload.id, upload]));
  for (const upload of incoming || []) {
    const normalized = normalizeUpload(upload);
    byId.set(normalized.id, normalized);
  }
  const merged = ensureUploadNumbers(Array.from(byId.values()));
  saveStoredUploads(merged);
  return merged;
}

function removeStoredUpload(uploadId) {
  const remaining = loadStoredUploads().filter(upload => upload.id !== uploadId);
  saveStoredUploads(remaining);
  return remaining;
}

function localDateKey(date) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function startOfDayISO(d) {
  return localDateKey(d);
}

function uploadDateKey(upload) {
  return localDateKey(upload?.uploadedAt);
}

function getSelectedUpload() {
  if (selectedUploadId === '__all__') {
    const uploads = loadStoredUploads();
    return {
      id: '__all__',
      name: 'All uploaded documents',
      objectives: uploads.flatMap(upload => upload.objectives || []),
      text: uploads.map(upload => `# ${upload.name}\n${upload.text || ''}`).join('\n\n'),
      textLength: uploads.reduce((total, upload) => total + (Number(upload.textLength) || 0), 0)
    };
  }
  return loadStoredUploads().find(upload => upload.id === selectedUploadId) || null;
}

function showPage(name) {
  const currentPageName = Object.keys(pages).find(key => pages[key].classList.contains('active'));
  const nextPage = pages[name];

  if (!nextPage || nextPage === pages[currentPageName]) {
    return;
  }

  const prevPage = currentPageName ? pages[currentPageName] : null;

  if (prevPage) {
    prevPage.classList.remove('active');
    prevPage.classList.add('is-exiting');
    window.setTimeout(() => {
      prevPage.classList.remove('is-exiting');
    }, 260);
  }

  nextPage.classList.remove('is-exiting');
  nextPage.classList.add('active');

  accountBtn.hidden = name !== 'home';
  diagnoseTab.classList.toggle('active', name !== 'heart');
  myHeartTab.classList.toggle('active', name === 'heart');
}

function launchBubble(button, action) {
  button.classList.add('is-launching');
  window.setTimeout(() => {
    action();
    button.classList.remove('is-launching');
  }, 140);
}

function openCalendarModal() {
  calendarModal.setAttribute('aria-hidden', 'false');
  closeCalendarModal.focus();
}

function closeCalendarModalDialog() {
  calendarModal.setAttribute('aria-hidden', 'true');
}

async function refreshUploadsFor(dateStr) {
  const items = loadStoredUploads().filter(upload => uploadDateKey(upload) === dateStr);
  renderUploads(items);
}

function renderUploads(items) {
  uploadsList.innerHTML = '';
  if (!items || items.length === 0) {
    uploadsList.style.display = 'none';
    return;
  }
  uploadsList.style.display = 'block';
  for (const u of items) {
    const card = document.createElement('div');
    card.className = 'event-card';

    const dt = new Date(u.uploadedAt);
    const dateBox = document.createElement('div');
    dateBox.className = 'event-date';
    const day = document.createElement('div');
    day.className = 'day';
    day.textContent = dt.getDate();
    const wk = document.createElement('div');
    wk.className = 'wk';
    wk.textContent = dt.toLocaleString(undefined, { weekday: 'short' });
    dateBox.appendChild(day);
    dateBox.appendChild(wk);

    const body = document.createElement('div');
    body.className = 'event-body';
    const title = document.createElement('div');
    title.className = 'event-title';
    title.textContent = `${u.uploadNumber || '-'}  ${u.name}`;
    body.appendChild(title);

    card.appendChild(dateBox);
    card.appendChild(body);
    uploadsList.appendChild(card);
  }
}

async function renderCalendar() {
  calendarEl.innerHTML = '';
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  monthLabel.textContent = viewDate.toLocaleString(undefined, { month: 'long', year: 'numeric' });

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (const wd of weekdays) {
    const el = document.createElement('div');
    el.className = 'weekday';
    el.textContent = wd;
    calendarEl.appendChild(el);
  }

  const allUploads = loadStoredUploads();
  const uploadDates = new Set(allUploads.map(uploadDateKey).filter(Boolean));

  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthLast = new Date(year, month, 0).getDate();

  for (let i = prevMonthLast - startDay + 1; i <= prevMonthLast; i += 1) {
    const d = new Date(year, month - 1, i);
    calendarEl.appendChild(makeDayCell(d, true, uploadDates.has(startOfDayISO(d))));
  }
  for (let i = 1; i <= daysInMonth; i += 1) {
    const d = new Date(year, month, i);
    calendarEl.appendChild(makeDayCell(d, false, uploadDates.has(startOfDayISO(d))));
  }

  const totalCells = calendarEl.childNodes.length;
  const needed = (7 * Math.ceil(totalCells / 7)) - totalCells;
  for (let i = 1; i <= needed; i += 1) {
    const d = new Date(year, month + 1, i);
    calendarEl.appendChild(makeDayCell(d, true, uploadDates.has(startOfDayISO(d))));
  }
}

function makeDayCell(dateObj, otherMonth, hasEvents) {
  const iso = startOfDayISO(dateObj);
  const el = document.createElement('div');
  el.className = 'day-cell' + (otherMonth ? ' other-month' : '');
  const box = document.createElement('div');
  box.className = 'date-box';
  box.textContent = dateObj.getDate();
  el.appendChild(box);
  if (hasEvents) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    el.appendChild(dot);
  }
  if (startOfDayISO(selectedDate) === iso) el.classList.add('selected');
  el.addEventListener('click', () => {
    selectedDate = dateObj;
    updateSelection();
    refreshUploadsFor(iso);
  });
  return el;
}

function updateSelection() {
  const cells = document.querySelectorAll('.day-cell');
  cells.forEach(c => c.classList.remove('selected'));
  const nodes = Array.from(cells).filter(n => {
    const box = n.querySelector('.date-box');
    if (!box) return false;
    return Number(box.textContent) === selectedDate.getDate() && !n.classList.contains('other-month');
  });
  if (nodes[0]) nodes[0].classList.add('selected');
}

function renderModalUploads(items) {
  filesModalList.innerHTML = '';
  if (!items || items.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'modal-empty';
    empty.textContent = 'No files uploaded yet.';
    filesModalList.appendChild(empty);
    return;
  }

  for (const upload of sortUploads(items)) {
    const item = document.createElement('article');
    item.className = 'modal-file';

    const name = document.createElement('h3');
    name.textContent = `${upload.uploadNumber || '-'}  ${upload.name}`;

    const actions = document.createElement('div');
    actions.className = 'modal-file-actions';
    const deleteButton = document.createElement('button');
    deleteButton.className = 'danger-btn';
    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteUpload(upload.id));
    actions.appendChild(deleteButton);

    item.appendChild(name);
    item.appendChild(actions);
    filesModalList.appendChild(item);
  }
}

function openFilesModal(items = loadStoredUploads()) {
  renderModalUploads(items);
  filesModal.setAttribute('aria-hidden', 'false');
  closeFilesModal.focus();
}

function closeFilesListModal() {
  filesModal.setAttribute('aria-hidden', 'true');
}

function openLimitModal(message = 'todays limit reached, come back tomorrow') {
  limitModalMessage.textContent = message;
  limitModal.setAttribute('aria-hidden', 'false');
  dismissLimitModal.focus();
}

function closeDailyLimitModal() {
  limitModal.setAttribute('aria-hidden', 'true');
}

function openOsceUnavailableModal(message) {
  osceUnavailableMessage.textContent = message || 'OSCE topic generation cannot be used right now. Please try again shortly.';
  osceUnavailableModal.setAttribute('aria-hidden', 'false');
}

function closeOsceUnavailableModalDialog() {
  osceUnavailableModal.setAttribute('aria-hidden', 'true');
}

function openDeleteModal(upload) {
  deleteDocumentName.textContent = upload.name;
  deleteModal.setAttribute('aria-hidden', 'false');
  confirmDeleteBtn.focus();
  return new Promise(resolve => {
    pendingDeleteResolve = resolve;
  });
}

function resolveDeleteModal(confirmed) {
  deleteModal.setAttribute('aria-hidden', 'true');
  if (pendingDeleteResolve) pendingDeleteResolve(confirmed);
  pendingDeleteResolve = null;
}

function openResetModal() {
  resetModal.setAttribute('aria-hidden', 'false');
  confirmResetBtn.focus();
  return new Promise(resolve => {
    pendingResetResolve = resolve;
  });
}

function resolveResetModal(confirmed) {
  resetModal.setAttribute('aria-hidden', 'true');
  if (pendingResetResolve) pendingResetResolve(confirmed);
  pendingResetResolve = null;
}

async function deleteUpload(uploadId) {
  const upload = loadStoredUploads().find(item => item.id === uploadId);
  if (!upload) return;
  if (!await openDeleteModal(upload)) return;

  let result = null;
  try {
    result = await window.api.deleteUpload(uploadId);
  } catch (error) {
    console.error('deleteUpload backend request failed', error);
  }
  const backendUploads = await window.api.getUploads();
  const remaining = syncStoredUploads(backendUploads || []);
  if (!result?.ok) console.warn('Removed a stale local upload entry', uploadId);
  if (selectedUploadId === uploadId) selectedUploadId = null;
  selectedOsceDocIds = selectedOsceDocIds.filter(id => id !== uploadId);
  currentStudyPack = null;

  refreshUploadsFor(startOfDayISO(selectedDate));
  renderCalendar();
  if (filesModal.getAttribute('aria-hidden') === 'false') renderModalUploads(remaining);
  if (pages.test.classList.contains('active')) renderTestDocuments();
  if (pages.questions.classList.contains('active')) {
    renderTestDocuments();
    showPage('test');
  }
}

function openRenameModal(files) {
  renameList.innerHTML = '';
  uploadDateInput.value = startOfDayISO(selectedDate);
  for (const file of files) {
    const row = document.createElement('label');
    row.className = 'rename-row';
    const caption = document.createElement('span');
    caption.textContent = file.name;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = file.name;
    input.dataset.selectionId = file.selectionId;
    input.dataset.originalName = file.name;
    row.appendChild(caption);
    row.appendChild(input);
    renameList.appendChild(row);
  }
  renameModal.setAttribute('aria-hidden', 'false');
  const firstInput = renameList.querySelector('input');
  if (firstInput) firstInput.focus();
  return new Promise(resolve => {
    pendingRenameResolve = resolve;
  });
}

function resolveRenameModal(value) {
  renameModal.setAttribute('aria-hidden', 'true');
  if (pendingRenameResolve) pendingRenameResolve(value);
  pendingRenameResolve = null;
}

function renderTestDocuments() {
  const uploads = loadStoredUploads();
  testDocuments.innerHTML = '';
  if (uploads.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'Upload files first.';
    testDocuments.appendChild(empty);
    return;
  }
  for (const upload of uploads) {
    const card = document.createElement('article');
    card.className = 'document-tile';
    card.innerHTML = `
      <span class="document-number">${upload.uploadNumber || '-'}</span>
      <span class="document-name"></span>
      <span class="document-detail">${upload.textLength || 0} characters read</span>
    `;
    card.querySelector('.document-name').textContent = upload.name;

    const actions = document.createElement('div');
    actions.className = 'document-actions';
    const openButton = document.createElement('button');
    openButton.className = 'text-btn';
    openButton.type = 'button';
    openButton.textContent = 'Open';
    const deleteButton = document.createElement('button');
    deleteButton.className = 'danger-btn';
    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete';
    actions.appendChild(openButton);
    actions.appendChild(deleteButton);

    const openDocument = () => {
      selectedUploadId = upload.id;
      renderQuestions('mixed');
    };

    card.addEventListener('click', openDocument);
    openButton.addEventListener('click', event => {
      event.stopPropagation();
      openDocument();
    });
    deleteButton.addEventListener('click', event => {
      event.stopPropagation();
      deleteUpload(upload.id);
    });
    card.appendChild(actions);
    testDocuments.appendChild(card);
  }
  renderDocumentSearch();
}

function textSnippet(text, query) {
  const lower = text.toLowerCase();
  const index = lower.indexOf(query.toLowerCase());
  if (index < 0) return text.slice(0, 220);
  const start = Math.max(0, index - 90);
  const end = Math.min(text.length, index + query.length + 130);
  return `${start > 0 ? '...' : ''}${text.slice(start, end)}${end < text.length ? '...' : ''}`;
}

function renderDocumentSearch() {
  searchResults.innerHTML = '';
  const query = documentSearch.value.trim();
  if (!query) return;

  const matches = loadStoredUploads()
    .map(upload => ({ upload, index: (upload.text || '').toLowerCase().indexOf(query.toLowerCase()) }))
    .filter(item => item.index >= 0)
    .slice(0, 8);

  if (!matches.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'No matching document text found.';
    searchResults.appendChild(empty);
    return;
  }

  for (const { upload } of matches) {
    const result = document.createElement('button');
    result.className = 'search-result';
    result.type = 'button';
    const title = document.createElement('strong');
    title.textContent = upload.name;
    const snippet = document.createElement('span');
    snippet.textContent = textSnippet(upload.text || '', query);
    result.appendChild(title);
    result.appendChild(snippet);
    result.addEventListener('click', () => {
      selectedUploadId = upload.id;
      renderQuestions('mixed');
    });
    searchResults.appendChild(result);
  }
}

function setQuestionLoading(message) {
  currentStudyPack = null;
  questionStatus.textContent = message;
  objectivesList.innerHTML = '';
  questionsList.innerHTML = '';
}

function renderObjectives(objectives) {
  objectivesList.innerHTML = '';
  if (!objectives || !objectives.length) return;
  const heading = document.createElement('h2');
  heading.textContent = 'Objectives';
  objectivesList.appendChild(heading);
  for (const objective of objectives) {
    const item = document.createElement('article');
    item.className = 'objective-card';
    const title = document.createElement('strong');
    title.textContent = objective.title || 'Objective';
    item.appendChild(title);
    objectivesList.appendChild(item);
  }
}

function renderSources(sources) {
  if (!sources || !sources.length) return null;
  const wrap = document.createElement('div');
  wrap.className = 'source-list';
  const label = document.createElement('span');
  label.textContent = 'Google sources';
  wrap.appendChild(label);
  for (const source of sources) {
    const link = document.createElement('a');
    link.href = source.uri;
    link.textContent = source.title || source.uri;
    link.target = '_blank';
    wrap.appendChild(link);
  }
  return wrap;
}

function renderMcq(mcq, index) {
  const saved = packAnswer(mcq.id);
  const item = document.createElement('article');
  item.className = 'question-card';
  const meta = document.createElement('span');
  meta.className = 'question-type';
  meta.textContent = questionTypeLabel(mcq.type);
  const title = document.createElement('h2');
  title.textContent = `Multiple Choice ${index + 1}`;
  const prompt = document.createElement('p');
  prompt.textContent = mcq.question;
  const options = document.createElement('div');
  options.className = 'mcq-options';
  const feedback = document.createElement('div');
  feedback.className = 'answer-feedback';

  for (const option of mcq.options || []) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'mcq-option';
    button.textContent = `${option.label}. ${option.text}`;
    if (saved?.selectedLabel === option.label) button.classList.add(option.isCorrect ? 'correct' : 'incorrect');
    button.addEventListener('click', async () => {
      options.querySelectorAll('.mcq-option').forEach(node => node.classList.remove('correct', 'incorrect'));
      button.classList.add(option.isCorrect ? 'correct' : 'incorrect');
      feedback.textContent = option.explanation || (option.isCorrect ? 'Correct.' : 'Not quite.');
      currentStudyPack.answers = currentStudyPack.answers || {};
      currentStudyPack.answers[mcq.id] = {
        selectedLabel: option.label,
        feedback: feedback.textContent
      };
      await window.api.saveStudyAnswer({
        uploadId: selectedUploadId,
        mode: selectedQuestionMode,
        questionId: mcq.id,
        selectedLabel: option.label,
        feedback: feedback.textContent
      });
    });
    options.appendChild(button);
  }
  if (saved?.feedback) feedback.textContent = feedbackText(saved.feedback);

  item.appendChild(meta);
  item.appendChild(title);
  item.appendChild(prompt);
  item.appendChild(options);
  item.appendChild(feedback);
  return item;
}

function renderLongAnswer(question, index) {
  const saved = packAnswer(question.id);
  const item = document.createElement('article');
  item.className = 'question-card';
  const meta = document.createElement('span');
  meta.className = 'question-type';
  meta.textContent = questionTypeLabel(question.type);
  const title = document.createElement('h2');
  title.textContent = `Long Answer ${index + 1}`;
  const prompt = document.createElement('p');
  prompt.textContent = question.question;
  const textarea = document.createElement('textarea');
  textarea.placeholder = 'Type your answer here';
  textarea.value = saved?.text || '';
  const actions = document.createElement('div');
  actions.className = 'long-answer-actions';
  const showModel = document.createElement('button');
  showModel.className = 'text-btn';
  showModel.type = 'button';
  showModel.textContent = 'Show Model Answer';
  const mark = document.createElement('button');
  mark.className = 'primary-btn';
  mark.type = 'button';
  mark.textContent = 'Mark Answer';
  const feedback = document.createElement('div');
  feedback.className = 'answer-feedback';
  feedback.textContent = feedbackText(saved?.feedback);

  let saveTimer = null;
  textarea.addEventListener('input', () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      currentStudyPack.answers = currentStudyPack.answers || {};
      currentStudyPack.answers[question.id] = {
        ...(currentStudyPack.answers[question.id] || {}),
        text: textarea.value
      };
      window.api.saveStudyAnswer({
        uploadId: selectedUploadId,
        mode: selectedQuestionMode,
        questionId: question.id,
        text: textarea.value
      });
    }, 500);
  });

  showModel.addEventListener('click', () => {
    const answer = question.documentAnswer || question.modelAnswer || 'No model answer returned.';
    feedback.textContent = answer;
  });
  mark.addEventListener('click', async () => {
    mark.disabled = true;
    feedback.textContent = 'Marking...';
    try {
      const result = await window.api.gradeLongAnswer({
        uploadId: selectedUploadId,
        mode: selectedQuestionMode,
        questionId: question.id,
        question: question.question,
        modelAnswer: question.modelAnswer,
        rubric: question.rubric,
        userAnswer: textarea.value
      });
      if (!result.ok) {
        feedback.textContent = result.error || 'Could not mark the answer.';
        return;
      }
      currentStudyPack.answers = currentStudyPack.answers || {};
      currentStudyPack.answers[question.id] = {
        text: textarea.value,
        feedback: result.feedback
      };
      feedback.textContent = feedbackText(result.feedback);
    } finally {
      mark.disabled = false;
    }
  });

  actions.appendChild(showModel);
  actions.appendChild(mark);
  item.appendChild(meta);
  item.appendChild(title);
  item.appendChild(prompt);
  item.appendChild(textarea);
  item.appendChild(actions);
  item.appendChild(feedback);
  return item;
}

function renderStudyPack(pack) {
  currentStudyPack = {
    ...pack,
    answers: pack.answers || {}
  };
  const mcqCount = currentStudyPack.multipleChoice?.length || 0;
  const longCount = currentStudyPack.longAnswer?.length || 0;
  const savedCount = Object.keys(currentStudyPack.answers || {}).length;
  const generated = currentStudyPack.generatedWith ? `Generated with ${currentStudyPack.generatedWith}` : 'Question set ready';
  questionStatus.textContent = `${generated}. ${mcqCount} MCQs, ${longCount} long-answer questions, ${savedCount} saved answers.`;
  renderObjectives(currentStudyPack.objectives || []);
  questionsList.innerHTML = '';

  const sources = renderSources(currentStudyPack.sources);
  if (sources) questionsList.appendChild(sources);

  for (const [index, mcq] of (currentStudyPack.multipleChoice || []).entries()) {
    questionsList.appendChild(renderMcq(mcq, index));
  }
  for (const [index, question] of (currentStudyPack.longAnswer || []).entries()) {
    questionsList.appendChild(renderLongAnswer(question, index));
  }
  if (currentStudyPack.error) {
    const warning = document.createElement('div');
    warning.className = 'question-status warning';
    warning.textContent = `Gemini fallback used: ${currentStudyPack.error}`;
    questionsList.prepend(warning);
  }
}

async function renderQuestions(mode, force = false) {
  const upload = getSelectedUpload();
  if (!upload) {
    renderTestDocuments();
    showPage('test');
    return;
  }
  selectedQuestionMode = 'mixed';
  questionsTitle.textContent = `Mixed Exam - ${upload.name}`;
  showPage('questions');
  setQuestionLoading(force
    ? 'Resetting the saved set and rebuilding questions from the full document text...'
    : 'Loading saved questions, or building them from the full document text if needed...');
  const result = await window.api.generateStudyPack(selectedUploadId, selectedQuestionMode, force);
  if (!result.ok) {
    if (result.limitReached) {
      const message = result.error || 'todays limit reached, come back tomorrow';
      questionStatus.textContent = message;
      openLimitModal(message);
      return;
    }
    questionStatus.textContent = result.error || 'Could not generate questions.';
    return;
  }
  renderStudyPack(result.pack);
}

function renderOsceDocumentPicker() {
  const uploads = loadStoredUploads();
  osceDocumentPicker.innerHTML = '';
  if (!uploads.length) {
    osceDocumentPicker.textContent = 'Upload documents before generating OSCE stations.';
    return;
  }
  for (const upload of uploads) {
    const label = document.createElement('label');
    label.className = 'osce-document-option';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = selectedOsceDocIds.includes(upload.id);
    input.addEventListener('change', () => {
      selectedOsceDocIds = input.checked
        ? [...new Set([...selectedOsceDocIds, upload.id])]
        : selectedOsceDocIds.filter(id => id !== upload.id);
    });
    const name = document.createElement('span');
    name.textContent = upload.name;
    label.append(input, name);
    osceDocumentPicker.appendChild(label);
  }
}

function renderOsceStations(stations) {
  osceStations.innerHTML = '';
  for (const station of stations || []) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'osce-station-card';
    const title = document.createElement('strong');
    title.textContent = station.title;
    const details = document.createElement('span');
    details.textContent = `${Math.round(station.durationSeconds / 60)} min station`;
    card.append(title, details);
    card.addEventListener('click', () => openOscePlayer(station));
    osceStations.appendChild(card);
  }
}

function updateOsceTimer() {
  const minutes = String(Math.floor(osceSecondsLeft / 60)).padStart(2, '0');
  const seconds = String(osceSecondsLeft % 60).padStart(2, '0');
  osceTimer.textContent = `${minutes}:${seconds}`;
  osceTimer.classList.toggle('warning', osceSecondsLeft <= 30);
}

function stopOsceTimer() {
  if (osceTimerId) clearInterval(osceTimerId);
  osceTimerId = null;
}

function openOscePlayer(station) {
  currentOsceStation = station;
  osceSecondsLeft = station.durationSeconds;
  osceChatHistory = [];
  oscePhase = 'brief';
  stopOsceTimer();
  osceListView.hidden = true;
  oscePlayerView.hidden = false;
  oscePlayerTitle.textContent = station.title;
  osceCandidateBrief.textContent = station.candidateBrief;
  oscePatientBrief.textContent = station.patientInformation || station.patientBrief;
  oscePatientPanel.hidden = true;
  document.getElementById('revealPatientBtn').disabled = false;
  document.getElementById('revealPatientBtn').textContent = 'Reveal Patient Information';
  osceChatPanel.hidden = true;
  osceStartControls.hidden = false;
  osceActiveControls.hidden = true;
  osceFinishPanel.hidden = true;
  oscePerformanceText.value = '';
  osceVerdictText.value = '';
  osceMarkResult.innerHTML = '';
  osceChatTranscript.innerHTML = '';
  updateOsceTimer();
}

function exitOscePlayer() {
  stopOsceTimer();
  oscePhase = 'idle';
  currentOsceStation = null;
  oscePlayerView.hidden = true;
  osceListView.hidden = false;
}

function beginOsceStation() {
  if (!currentOsceStation || oscePhase !== 'brief') return;
  stopOsceTimer();
  oscePhase = 'active';
  osceStartControls.hidden = true;
  osceActiveControls.hidden = false;
  osceChatPanel.hidden = false;
  osceChatInput.disabled = false;
  osceChatInput.focus();
  osceTimerId = setInterval(() => {
    osceSecondsLeft = Math.max(0, osceSecondsLeft - 1);
    updateOsceTimer();
    if (osceSecondsLeft === 0) finishOsceStation();
  }, 1000);
}

function finishOsceStation() {
  if (!currentOsceStation || oscePhase === 'finished' || oscePhase === 'idle') return;
  stopOsceTimer();
  oscePhase = 'finished';
  osceActiveControls.hidden = true;
  osceChatPanel.hidden = true;
  osceChatInput.disabled = true;
  osceFinishPanel.hidden = false;
}

function appendOsceChatTurn(role, text) {
  const turn = document.createElement('div');
  turn.className = `osce-chat-turn ${role}`;
  turn.textContent = text;
  osceChatTranscript.appendChild(turn);
  osceChatTranscript.scrollTop = osceChatTranscript.scrollHeight;
}

function renderOsceMarkResult(result) {
  osceMarkResult.innerHTML = '';
  const heading = document.createElement('h3');
  heading.textContent = `Result: ${result.score?.achieved || 0}/${result.score?.total || 0} - ${result.verdict || 'review'}`;
  const rationale = document.createElement('p');
  rationale.textContent = result.verdictRationale || '';
  osceMarkResult.append(heading, rationale);
  const groups = [
    ['Unsafe omissions', result.unsafeOmissions],
    ['Missed key points', result.missedKeyPoints],
    ['Better phrasing', (result.betterPhrasing || []).map(item => item.suggestion)]
  ];
  for (const [label, items] of groups) {
    if (!items?.length) continue;
    const title = document.createElement('h4');
    title.textContent = label;
    const list = document.createElement('ul');
    for (const item of items) {
      const entry = document.createElement('li');
      entry.textContent = item;
      list.appendChild(entry);
    }
    osceMarkResult.append(title, list);
  }
  if (result.source === 'local-fallback') {
    const note = document.createElement('p');
    note.className = 'question-status warning';
    note.textContent = 'Offline marking was used. Treat this result as a rough guide.';
    osceMarkResult.appendChild(note);
  }
}

collapseToggle.addEventListener('click', () => {
  rightPanel.classList.toggle('collapsed');
  const collapsed = rightPanel.classList.contains('collapsed');
  collapseToggle.textContent = collapsed ? '>' : '<';
});

prevMonthBtn.addEventListener('click', () => { viewDate.setMonth(viewDate.getMonth() - 1); renderCalendar(); });
nextMonthBtn.addEventListener('click', () => { viewDate.setMonth(viewDate.getMonth() + 1); renderCalendar(); });

closeFilesModal.addEventListener('click', closeFilesListModal);
filesModal.addEventListener('click', event => {
  if (event.target.hasAttribute('data-close-modal')) closeFilesListModal();
});
closeLimitModal.addEventListener('click', closeDailyLimitModal);
dismissLimitModal.addEventListener('click', closeDailyLimitModal);
limitModal.addEventListener('click', event => {
  if (event.target.hasAttribute('data-close-limit-modal')) closeDailyLimitModal();
});
closeOsceUnavailableModal.addEventListener('click', closeOsceUnavailableModalDialog);
dismissOsceUnavailableModal.addEventListener('click', closeOsceUnavailableModalDialog);
osceUnavailableModal.addEventListener('click', event => {
  if (event.target.hasAttribute('data-close-osce-unavailable')) closeOsceUnavailableModalDialog();
});
closeDeleteModal.addEventListener('click', () => resolveDeleteModal(false));
cancelDeleteBtn.addEventListener('click', () => resolveDeleteModal(false));
confirmDeleteBtn.addEventListener('click', () => resolveDeleteModal(true));
deleteModal.addEventListener('click', event => {
  if (event.target.hasAttribute('data-close-delete-modal')) resolveDeleteModal(false);
});
closeResetModal.addEventListener('click', () => resolveResetModal(false));
cancelResetBtn.addEventListener('click', () => resolveResetModal(false));
confirmResetBtn.addEventListener('click', () => resolveResetModal(true));
resetModal.addEventListener('click', event => {
  if (event.target.hasAttribute('data-close-reset-modal')) resolveResetModal(false);
});
settingsBtn.addEventListener('click', openSettingsModal);
closeSettingsModal.addEventListener('click', closeSettings);
settingsModal.addEventListener('click', event => {
  if (event.target.hasAttribute('data-close-settings')) closeSettings();
});
openGuideBtn.addEventListener('click', () => {
  guideModal.setAttribute('aria-hidden', 'false');
  closeGuideModal.focus();
});
closeGuideModal.addEventListener('click', () => guideModal.setAttribute('aria-hidden', 'true'));
guideModal.addEventListener('click', event => {
  if (event.target.hasAttribute('data-close-guide')) guideModal.setAttribute('aria-hidden', 'true');
});
accountBtn.addEventListener('click', () => {
  renderAccountProfile(loadAccountProfile());
  accountModal.setAttribute('aria-hidden', 'false');
  closeAccountModal.focus();
});
closeAccountModal.addEventListener('click', () => accountModal.setAttribute('aria-hidden', 'true'));
accountModal.addEventListener('click', event => {
  if (event.target.hasAttribute('data-close-account')) accountModal.setAttribute('aria-hidden', 'true');
});
accountForm.addEventListener('submit', async event => {
  event.preventDefault();
  const current = loadAccountProfile();
  const picture = accountPictureInput.files[0] ? await readProfilePicture(accountPictureInput.files[0]) : (current.picture || '');
  const profile = { name: accountNameInput.value.trim(), picture };
  localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(profile));
  renderAccountProfile(profile);
  accountModal.setAttribute('aria-hidden', 'true');
});
clearAccountBtn.addEventListener('click', () => {
  localStorage.removeItem(ACCOUNT_STORAGE_KEY);
  accountPictureInput.value = '';
  renderAccountProfile();
});
appearanceTab.addEventListener('click', () => setSettingsTab('appearance'));
termsTab.addEventListener('click', () => setSettingsTab('terms'));
document.querySelectorAll('input[name="appTheme"]').forEach(input => {
  input.addEventListener('change', () => applyTheme(input.value));
});
copyFormatPromptBtn.addEventListener('click', async () => {
  const prompt = formatPromptText.textContent.trim();
  try {
    await navigator.clipboard.writeText(prompt);
    copyFormatPromptBtn.textContent = 'Copied';
  } catch (error) {
    console.warn('Could not copy formatting prompt', error);
    copyFormatPromptBtn.textContent = 'Select and copy text';
  }
  window.setTimeout(() => { copyFormatPromptBtn.textContent = 'Copy prompt'; }, 1800);
});
cancelRename.addEventListener('click', () => resolveRenameModal(null));
renameForm.addEventListener('submit', event => {
  event.preventDefault();
  const files = Array.from(renameList.querySelectorAll('input')).map(input => ({
    selectionId: input.dataset.selectionId,
    name: input.value.trim() || input.dataset.originalName
  }));
  resolveRenameModal({ files, uploadDate: uploadDateInput.value });
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    if (filesModal.getAttribute('aria-hidden') === 'false') closeFilesListModal();
    if (renameModal.getAttribute('aria-hidden') === 'false') resolveRenameModal(null);
    if (limitModal.getAttribute('aria-hidden') === 'false') closeDailyLimitModal();
    if (calendarModal.getAttribute('aria-hidden') === 'false') closeCalendarModalDialog();
    if (osceUnavailableModal.getAttribute('aria-hidden') === 'false') closeOsceUnavailableModalDialog();
    if (deleteModal.getAttribute('aria-hidden') === 'false') resolveDeleteModal(false);
    if (resetModal.getAttribute('aria-hidden') === 'false') resolveResetModal(false);
    if (settingsModal.getAttribute('aria-hidden') === 'false') closeSettings();
  }
});

uploadBtn.addEventListener('click', async () => {
  uploadBtn.disabled = true;
  try {
    const selected = await window.api.chooseFiles();
    if (!selected.length) return;
    const renamed = await openRenameModal(selected);
    if (!renamed) return;
    const uploaded = await window.api.saveUploadedFiles(renamed.files, renamed.uploadDate);
    if (!uploaded.length) return;
    const allUploads = mergeStoredUploads(uploaded);
    selectedDate = new Date(`${renamed.uploadDate}T12:00:00`);
    refreshUploadsFor(renamed.uploadDate);
    renderCalendar();
    openFilesModal(allUploads);
  } finally {
    uploadBtn.disabled = false;
  }
});

uploadBtnClassic.addEventListener('click', () => launchBubble(uploadBtnClassic, () => uploadBtn.click()));
testBtnClassic.addEventListener('click', () => launchBubble(testBtnClassic, () => testBtn.click()));
checkBtnClassic.addEventListener('click', () => launchBubble(checkBtnClassic, () => checkBtn.click()));
osceBtnClassic.addEventListener('click', () => launchBubble(osceBtnClassic, () => osceBtn.click()));
calendarBtnClassic.addEventListener('click', () => launchBubble(calendarBtnClassic, openCalendarModal));
closeCalendarModal.addEventListener('click', closeCalendarModalDialog);
calendarModal.addEventListener('click', event => {
  if (event.target.hasAttribute('data-close-calendar-modal')) closeCalendarModalDialog();
});
diagnoseTab.addEventListener('click', () => showPage('home'));
myHeartTab.addEventListener('click', () => showPage('heart'));

checkBtn.addEventListener('click', () => {
  openFilesModal(loadStoredUploads());
});

testBtn.addEventListener('click', () => {
  renderTestDocuments();
  showPage('test');
});

documentSearch.addEventListener('input', renderDocumentSearch);

allDocumentsBtn.addEventListener('click', () => {
  const uploads = loadStoredUploads();
  if (!uploads.length) {
    renderTestDocuments();
    return;
  }
  selectedUploadId = '__all__';
  renderQuestions('mixed');
});

resetQuestionsBtn.addEventListener('click', async () => {
  if (!selectedUploadId || !selectedQuestionMode) return;
  if (!await openResetModal()) return;
  resetQuestionsBtn.disabled = true;
  try {
    await window.api.resetStudyPack(selectedUploadId, selectedQuestionMode);
    await renderQuestions(selectedQuestionMode, true);
  } finally {
    resetQuestionsBtn.disabled = false;
  }
});

document.querySelectorAll('[data-route]').forEach(button => {
  button.addEventListener('click', () => {
    const route = button.dataset.route;
    if (route === 'test') renderTestDocuments();
    showPage(route);
  });
});

osceBtn.addEventListener('click', () => {
  renderOsceDocumentPicker();
  showPage('osce');
});

async function generateOsceTopicStations(force = false) {
  const topic = osceTopicInput.value.trim();
  if (!topic) {
    osceStatus.textContent = 'Enter a topic for your OSCE scenarios.';
    osceTopicInput.focus();
    return;
  }
  generateOsceBtn.disabled = true;
  refreshOsceBtn.disabled = true;
  osceStatus.textContent = force
    ? 'Clearing saved stations and generating fresh AI scenarios...'
    : 'Researching your topic and generating OSCE stations...';
  osceStations.innerHTML = '';
  try {
    const result = await window.api.generateOsceStations({
      docIds: selectedOsceDocIds,
      topic,
      force
    });
    if (!result?.ok) {
      osceStatus.textContent = result?.error || 'Could not generate stations.';
      if (result?.limitReached) openLimitModal(result.error);
      if (result?.providerUnavailable) openOsceUnavailableModal(result.error);
      return;
    }
    const remaining = typeof result.remaining === 'number' ? ` ${result.remaining}/5 topic generations remaining today.` : '';
    osceStatus.textContent = result.cached
      ? `${result.stations.length} saved station${result.stations.length === 1 ? '' : 's'} loaded.`
      : result.usedFallback
      ? `${result.stations.length} practice station${result.stations.length === 1 ? '' : 's'} ready.`
      : result.source === 'cloudflare'
      ? `${result.stations.length} station${result.stations.length === 1 ? '' : 's'} ready with Cloudflare AI.`
      : `${result.stations.length} station${result.stations.length === 1 ? '' : 's'} ready with Gemini.`;
    osceStatus.textContent += remaining;
    renderOsceStations(result.stations);
  } finally {
    generateOsceBtn.disabled = false;
    refreshOsceBtn.disabled = false;
  }
}

generateOsceBtn.addEventListener('click', () => generateOsceTopicStations());
refreshOsceBtn.addEventListener('click', () => generateOsceTopicStations(true));

document.getElementById('exitOscePlayerBtn').addEventListener('click', exitOscePlayer);
document.getElementById('startOsceBtn').addEventListener('click', beginOsceStation);
document.getElementById('revealPatientBtn').addEventListener('click', () => {
  if (oscePhase !== 'active') return;
  oscePatientPanel.hidden = false;
  document.getElementById('revealPatientBtn').disabled = true;
  document.getElementById('revealPatientBtn').textContent = 'Patient Information Revealed';
});
document.getElementById('finishOsceBtn').addEventListener('click', finishOsceStation);
osceChatForm.addEventListener('submit', async event => {
  event.preventDefault();
  const candidateMessage = osceChatInput.value.trim();
  if (!candidateMessage || !currentOsceStation || oscePhase !== 'active') return;
  const station = currentOsceStation;
  const submit = osceChatForm.querySelector('button');
  submit.disabled = true;
  osceChatInput.disabled = true;
  appendOsceChatTurn('candidate', candidateMessage);
  try {
    const result = await window.api.oscePatientChat({ station, history: osceChatHistory, candidateMessage });
    if (oscePhase !== 'active' || currentOsceStation !== station) return;
    if (!result?.ok) {
      appendOsceChatTurn('patient', result?.error || 'The patient is temporarily unavailable.');
      if (result?.limitReached) openLimitModal(result.error);
      return;
    }
    osceChatHistory.push({ role: 'candidate', text: candidateMessage }, { role: 'patient', text: result.reply });
    appendOsceChatTurn('patient', result.reply);
    osceChatInput.value = '';
  } finally {
    submit.disabled = false;
    if (oscePhase === 'active' && currentOsceStation === station) {
      osceChatInput.disabled = false;
      osceChatInput.focus();
    }
  }
});
document.getElementById('markOsceBtn').addEventListener('click', async () => {
  const candidatePerformance = oscePerformanceText.value.trim();
  const workingDiagnosis = osceVerdictText.value.trim();
  const candidateTranscript = osceChatHistory.filter(turn => turn.role === 'candidate').map(turn => turn.text);
  if ((!candidatePerformance && !workingDiagnosis && !candidateTranscript.length) || !currentOsceStation) return;
  const markButton = document.getElementById('markOsceBtn');
  markButton.disabled = true;
  osceMarkResult.textContent = 'Marking your performance...';
  try {
    const result = await window.api.markOscePerformance({ station: currentOsceStation, candidatePerformance, workingDiagnosis, candidateTranscript });
    if (!result?.ok) {
      osceMarkResult.textContent = result?.error || 'Could not mark this performance.';
      if (result?.limitReached) openLimitModal(result.error);
      return;
    }
    renderOsceMarkResult(result.result);
  } finally {
    markButton.disabled = false;
  }
});

async function initializeUploads() {
  applyTheme(localStorage.getItem(THEME_STORAGE_KEY) || 'dark');
  renderAccountProfile(loadAccountProfile());
  selectedDate = new Date();
  viewDate = new Date();
  const existingUploads = await window.api.getUploads();
  syncStoredUploads(existingUploads || []);
  renderCalendar();
  refreshUploadsFor(startOfDayISO(selectedDate));
}

initializeUploads();
