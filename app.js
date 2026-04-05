// ===========================
// DARK MODE
// ===========================
function toggleDark() {
  const html = document.documentElement;
  html.classList.toggle('dark');
  localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
  document.getElementById('dark-icon').textContent = html.classList.contains('dark') ? '☀️' : '🌙';
}

// Set correct icon on load
document.getElementById('dark-icon').textContent =
  document.documentElement.classList.contains('dark') ? '☀️' : '🌙';

// ===========================
// SIDEBAR (mobile)
// ===========================
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  sidebar.classList.toggle('-translate-x-full');
  overlay.classList.toggle('hidden');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.add('-translate-x-full');
  document.getElementById('sidebar-overlay').classList.add('hidden');
}

// ===========================
// NAVIGATION
// ===========================
const navLinks = document.querySelectorAll('.nav-link');
const toolSections = document.querySelectorAll('.tool-section');

function showTool(toolId) {
  toolSections.forEach(s => s.classList.remove('active'));
  navLinks.forEach(l => l.classList.remove('active'));

  const section = document.getElementById(toolId);
  if (section) section.classList.add('active');

  const link = document.querySelector(`.nav-link[data-tool="${toolId}"]`);
  if (link) link.classList.add('active');

  localStorage.setItem('lastTool', toolId);
  closeSidebar();
}

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    showTool(link.dataset.tool);
  });
});

showTool(localStorage.getItem('lastTool') || 'json');

// ===========================
// UTILITIES
// ===========================
function copyOutput(outputId, btnId) {
  const el = document.getElementById(outputId);
  const text = el.value !== undefined ? el.value : el.textContent;
  if (!text.trim()) return;
  navigator.clipboard.writeText(text).then(() => flashCopy(document.getElementById(btnId)));
}

function copyText(elementId, btn) {
  const el = document.getElementById(elementId);
  const text = el.textContent || el.value;
  if (!text || text === '—') return;
  navigator.clipboard.writeText(text).then(() => flashCopy(btn));
}

function flashCopy(btn) {
  const orig = btn.textContent;
  btn.textContent = 'Copied!';
  btn.classList.add('copied');
  setTimeout(() => {
    btn.textContent = orig;
    btn.classList.remove('copied');
  }, 1500);
}

function showError(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.classList.remove('hidden');
}

function hideError(id) {
  document.getElementById(id).classList.add('hidden');
}

// ===========================
// 1. JSON FORMATTER
// ===========================
function jsonFormat() {
  const input = document.getElementById('json-input').value.trim();
  const output = document.getElementById('json-output');
  hideError('json-error');
  hideError('json-ok');
  if (!input) return;
  try {
    output.value = JSON.stringify(JSON.parse(input), null, 2);
    document.getElementById('json-ok').classList.remove('hidden');
  } catch (e) {
    showError('json-error', '⛔ ' + e.message);
    output.value = '';
  }
}

function jsonMinify() {
  const input = document.getElementById('json-input').value.trim();
  const output = document.getElementById('json-output');
  hideError('json-error');
  hideError('json-ok');
  if (!input) return;
  try {
    output.value = JSON.stringify(JSON.parse(input));
    document.getElementById('json-ok').classList.remove('hidden');
  } catch (e) {
    showError('json-error', '⛔ ' + e.message);
    output.value = '';
  }
}

function jsonClear() {
  document.getElementById('json-input').value = '';
  document.getElementById('json-output').value = '';
  hideError('json-error');
  hideError('json-ok');
}

function jsonSample() {
  document.getElementById('json-input').value = JSON.stringify({
    name: "DevToolbox",
    version: "1.0.0",
    tools: ["JSON", "Base64", "JWT", "UUID", "Hash", "Regex", "Timestamp", "Color", "Lorem"],
    settings: { darkMode: true, language: "en" },
    meta: { author: "You", stars: 42, public: true }
  }, null, 2);
  document.getElementById('json-output').value = '';
  hideError('json-error');
  hideError('json-ok');
}

// ===========================
// 2. BASE64
// ===========================
let b64Mode = 'encode';

function setB64Mode(mode) {
  b64Mode = mode;
  const active = 'px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg font-medium transition-colors';
  const inactive = 'px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm rounded-lg font-medium transition-colors';
  document.getElementById('b64-encode-tab').className = mode === 'encode' ? active : inactive;
  document.getElementById('b64-decode-tab').className = mode === 'decode' ? active : inactive;
  document.getElementById('b64-input').placeholder = mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...';
  document.getElementById('b64-output').value = '';
  hideError('b64-error');
}

function b64Convert() {
  const input = document.getElementById('b64-input').value;
  const output = document.getElementById('b64-output');
  hideError('b64-error');
  if (!input.trim()) return;
  try {
    if (b64Mode === 'encode') {
      output.value = btoa(unescape(encodeURIComponent(input)));
    } else {
      output.value = decodeURIComponent(escape(atob(input.trim())));
    }
  } catch (e) {
    showError('b64-error', b64Mode === 'decode' ? '⛔ Invalid Base64 string.' : '⛔ ' + e.message);
    output.value = '';
  }
}

// ===========================
// 3. URL ENCODER
// ===========================
let urlMode = 'encode';

function setUrlMode(mode) {
  urlMode = mode;
  const active = 'px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg font-medium';
  const inactive = 'px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm rounded-lg font-medium';
  document.getElementById('url-encode-tab').className = mode === 'encode' ? active : inactive;
  document.getElementById('url-decode-tab').className = mode === 'decode' ? active : inactive;
  document.getElementById('url-input').placeholder = mode === 'encode' ? 'Enter URL or text to encode...' : 'Enter encoded URL to decode...';
  document.getElementById('url-output').value = '';
}

function urlConvert() {
  const input = document.getElementById('url-input').value;
  const output = document.getElementById('url-output');
  if (!input.trim()) return;
  try {
    output.value = urlMode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input);
  } catch (e) {
    output.value = '⛔ Error: ' + e.message;
  }
}

// ===========================
// 4. JWT DECODER
// ===========================
function b64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  try {
    return decodeURIComponent(
      Array.from(atob(str)).map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
    );
  } catch {
    return atob(str);
  }
}

function jwtDecode() {
  const token = document.getElementById('jwt-input').value.trim();
  const result = document.getElementById('jwt-result');
  hideError('jwt-error');
  result.classList.add('hidden');
  if (!token) return;

  const parts = token.split('.');
  if (parts.length !== 3) {
    showError('jwt-error', '⛔ Invalid JWT: must have exactly 3 parts separated by dots (header.payload.signature)');
    return;
  }

  try {
    const header = JSON.parse(b64UrlDecode(parts[0]));
    const payload = JSON.parse(b64UrlDecode(parts[1]));

    document.getElementById('jwt-header').textContent = JSON.stringify(header, null, 2);
    document.getElementById('jwt-payload').textContent = JSON.stringify(payload, null, 2);
    document.getElementById('jwt-signature').textContent = parts[2];

    const statusEl = document.getElementById('jwt-status');
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp) {
      const expDate = new Date(payload.exp * 1000).toLocaleString();
      if (payload.exp < now) {
        statusEl.className = 'p-3 rounded-xl text-sm font-medium bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800';
        statusEl.textContent = `⛔ Expired — was valid until ${expDate}`;
      } else {
        statusEl.className = 'p-3 rounded-xl text-sm font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800';
        statusEl.textContent = `✅ Valid — expires ${expDate}`;
      }
    } else {
      statusEl.className = 'p-3 rounded-xl text-sm font-medium bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700';
      statusEl.textContent = 'ℹ️ No expiration claim (exp) found in payload';
    }

    result.classList.remove('hidden');
  } catch (e) {
    showError('jwt-error', '⛔ Failed to decode: ' + e.message);
  }
}

function jwtSample() {
  // header: {"alg":"HS256","typ":"JWT"} | payload: {"sub":"1234567890","name":"John Doe","iat":1516239022,"exp":1999999999}
  document.getElementById('jwt-input').value =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5OTk5OTk5OTl9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  jwtDecode();
}

// ===========================
// 5. UUID GENERATOR
// ===========================
let lastUUIDs = [];

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = crypto.getRandomValues(new Uint8Array(1))[0] & 15;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function generateUUIDs() {
  const count = Math.min(Math.max(parseInt(document.getElementById('uuid-count').value) || 5, 1), 100);
  lastUUIDs = Array.from({ length: count }, generateUUID);
  const list = document.getElementById('uuid-list');
  list.innerHTML = lastUUIDs.map(uuid => `
    <div class="group flex items-center gap-2 p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors">
      <code class="flex-1 text-sm font-mono text-slate-700 dark:text-slate-300 select-all">${uuid}</code>
      <button class="copy-btn text-xs text-indigo-500 hover:text-indigo-700 font-semibold opacity-0 group-hover:opacity-100 transition-opacity" onclick="copyToClipboard('${uuid}', this)">Copy</button>
    </div>
  `).join('');
}

function uuidCopyAll() {
  if (!lastUUIDs.length) return;
  navigator.clipboard.writeText(lastUUIDs.join('\n')).then(() => {
    flashCopy(document.getElementById('uuid-copy-all-btn'));
  });
}

function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).then(() => flashCopy(btn));
}

// Generate on load
generateUUIDs();

// ===========================
// 6. HASH GENERATOR
// ===========================
async function autoHash() {
  const input = document.getElementById('hash-input').value;
  const dash = '—';
  if (!input) {
    ['hash-sha1', 'hash-sha256', 'hash-sha512'].forEach(id => {
      document.getElementById(id).textContent = dash;
    });
    return;
  }
  async function digest(algo) {
    const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(input));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  const [sha1, sha256, sha512] = await Promise.all([
    digest('SHA-1'), digest('SHA-256'), digest('SHA-512')
  ]);
  document.getElementById('hash-sha1').textContent = sha1;
  document.getElementById('hash-sha256').textContent = sha256;
  document.getElementById('hash-sha512').textContent = sha512;
}

// ===========================
// 7. REGEX TESTER
// ===========================
function runRegex() {
  const pattern = document.getElementById('regex-pattern').value;
  const testStr = document.getElementById('regex-test').value;
  const flags = (document.getElementById('flag-g').checked ? 'g' : '')
              + (document.getElementById('flag-i').checked ? 'i' : '')
              + (document.getElementById('flag-m').checked ? 'm' : '');
  const status = document.getElementById('regex-status');
  const output = document.getElementById('regex-output');

  if (!pattern) {
    status.textContent = '';
    output.innerHTML = '<span class="text-slate-400">Enter a pattern above...</span>';
    return;
  }

  let regex;
  try {
    regex = new RegExp(pattern, flags);
  } catch (e) {
    status.innerHTML = `<span class="text-red-500">⛔ Invalid pattern: ${escHtml(e.message)}</span>`;
    output.innerHTML = '';
    return;
  }

  if (!testStr) {
    status.innerHTML = '<span class="text-green-500 font-medium">✅ Valid pattern</span>';
    output.innerHTML = '<span class="text-slate-400">Enter a test string below...</span>';
    return;
  }

  const globalRegex = new RegExp(pattern, 'g' + (flags.replace('g', '')));
  const matches = [...testStr.matchAll(globalRegex)];

  if (!matches.length) {
    status.innerHTML = '<span class="text-slate-500">0 matches</span>';
    output.textContent = testStr;
    return;
  }

  status.innerHTML = `<span class="text-green-600 dark:text-green-400 font-semibold">${matches.length} match${matches.length !== 1 ? 'es' : ''}</span>`;

  // Build highlighted output
  let html = '';
  let last = 0;
  const safeRegex = new RegExp(pattern, 'g' + (flags.replace('g', '')));
  let m;
  while ((m = safeRegex.exec(testStr)) !== null) {
    html += escHtml(testStr.slice(last, m.index));
    html += `<mark class="match-highlight">${escHtml(m[0])}</mark>`;
    last = m.index + m[0].length;
    if (m[0].length === 0) safeRegex.lastIndex++;
  }
  html += escHtml(testStr.slice(last));
  output.innerHTML = html;
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ===========================
// 8. TIMESTAMP CONVERTER
// ===========================
function unixToDate() {
  const val = document.getElementById('ts-unix').value.trim();
  const result = document.getElementById('ts-result');
  if (!val) { result.classList.add('hidden'); return; }

  let ms = parseFloat(val);
  if (ms < 1e12) ms *= 1000; // convert seconds to ms

  const d = new Date(ms);
  if (isNaN(d.getTime())) { result.classList.add('hidden'); return; }

  document.getElementById('ts-utc').textContent = d.toUTCString();
  document.getElementById('ts-local').textContent = d.toLocaleString();
  document.getElementById('ts-iso').textContent = d.toISOString();
  document.getElementById('ts-relative').textContent = timeAgo(d);
  result.classList.remove('hidden');
}

function dateToUnix() {
  const val = document.getElementById('ts-date-input').value;
  const result = document.getElementById('ts-unix-result');
  if (!val) { result.classList.add('hidden'); return; }

  const d = new Date(val);
  if (isNaN(d.getTime())) { result.classList.add('hidden'); return; }

  document.getElementById('ts-unix-s').textContent = Math.floor(d.getTime() / 1000);
  document.getElementById('ts-unix-ms').textContent = d.getTime();
  result.classList.remove('hidden');
}

function tsNow() {
  document.getElementById('ts-unix').value = Math.floor(Date.now() / 1000);
  unixToDate();
}

function timeAgo(date) {
  const diff = (Date.now() - date.getTime()) / 1000;
  const abs = Math.abs(diff);
  const future = diff < 0;
  const fmt = (n, u) => `${future ? 'in ' : ''}${Math.round(n)} ${u}${Math.round(n) !== 1 ? 's' : ''}${future ? '' : ' ago'}`;
  if (abs < 60) return fmt(abs, 'second');
  if (abs < 3600) return fmt(abs / 60, 'minute');
  if (abs < 86400) return fmt(abs / 3600, 'hour');
  if (abs < 86400 * 30) return fmt(abs / 86400, 'day');
  if (abs < 86400 * 365) return fmt(abs / 86400 / 30, 'month');
  return fmt(abs / 86400 / 365, 'year');
}

// ===========================
// 9. COLOR CONVERTER
// ===========================
function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  if (hex.length !== 6) return null;
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return (isNaN(r + g + b)) ? null : { r, g, b };
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h, s, l) {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(Math.min(((n + h / 30) % 12) - 3, 9 - ((n + h / 30) % 12), 1), -1);
  return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255) };
}

function updateColorUI(r, g, b) {
  const hex = rgbToHex(r, g, b);
  const { h, s, l } = rgbToHsl(r, g, b);
  document.getElementById('color-hex').value = hex;
  document.getElementById('color-rgb').value = `${r}, ${g}, ${b}`;
  document.getElementById('color-hsl').value = `${h}, ${s}%, ${l}%`;
  document.getElementById('color-preview').style.background = hex;
  document.getElementById('color-picker').value = hex;
  document.getElementById('color-css-output').textContent =
    `--color: ${hex};\n--color-rgb: ${r}, ${g}, ${b};\n--color-hsl: ${h}deg ${s}% ${l}%;\n--color-r: ${r};\n--color-g: ${g};\n--color-b: ${b};`;
}

function colorFromHex() {
  const rgb = hexToRgb(document.getElementById('color-hex').value.trim());
  if (rgb) updateColorUI(rgb.r, rgb.g, rgb.b);
}

function colorFromRgb() {
  const m = document.getElementById('color-rgb').value.match(/(\d+)\D+(\d+)\D+(\d+)/);
  if (!m) return;
  const [r, g, b] = [+m[1], +m[2], +m[3]];
  if ([r, g, b].every(x => x >= 0 && x <= 255)) updateColorUI(r, g, b);
}

function colorFromHsl() {
  const m = document.getElementById('color-hsl').value.match(/(\d+)\D+(\d+)\D+(\d+)/);
  if (!m) return;
  const { r, g, b } = hslToRgb(+m[1], +m[2], +m[3]);
  updateColorUI(r, g, b);
}

function colorFromPicker() {
  document.getElementById('color-hex').value = document.getElementById('color-picker').value;
  colorFromHex();
}

// Initialize with default color
colorFromHex();

// ===========================
// 10. LOREM IPSUM
// ===========================
const loremWords = [
  'lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit',
  'sed','do','eiusmod','tempor','incididunt','ut','labore','et','dolore',
  'magna','aliqua','enim','ad','minim','veniam','quis','nostrud','exercitation',
  'ullamco','laboris','nisi','aliquip','ex','ea','commodo','consequat',
  'duis','aute','irure','in','reprehenderit','voluptate','velit','esse',
  'cillum','fugiat','nulla','pariatur','excepteur','sint','occaecat',
  'cupidatat','non','proident','sunt','culpa','qui','officia','deserunt',
  'mollit','anim','id','est','laborum','pellentesque','habitant','morbi',
  'tristique','senectus','netus','malesuada','fames','ac','turpis','egestas',
  'integer','eget','aliquet','nibh','praesent','magna','purus','gravida',
  'quis','blandit','cursus','hac','habitasse','platea','dictumst','quisque',
  'sagittis','volutpat','consequat','mauris','nunc','congue','nisi','vitae',
  'suscipit','tellus','maecenas','diam','sem','viverra','adipiscing',
  'feugiat','scelerisque','varius','integer','feugiat','scelerisque',
];

function rw() { return loremWords[Math.floor(Math.random() * loremWords.length)]; }

function makeSentence(len) {
  len = len || 8 + Math.floor(Math.random() * 10);
  const words = Array.from({ length: len }, (_, i) => i === 0 ? rw()[0].toUpperCase() + rw().slice(1) : rw());
  return words.join(' ') + '.';
}

function makeParagraph() {
  return Array.from({ length: 4 + Math.floor(Math.random() * 4) }, () => makeSentence()).join(' ');
}

function generateLorem() {
  const type = document.getElementById('lorem-type').value;
  const count = Math.min(Math.max(parseInt(document.getElementById('lorem-count').value) || 3, 1), 50);
  const start = document.getElementById('lorem-start').checked;
  const loremOpener = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

  let result = '';
  if (type === 'paragraphs') {
    result = Array.from({ length: count }, (_, i) =>
      (i === 0 && start) ? loremOpener + ' ' + makeParagraph() : makeParagraph()
    ).join('\n\n');
  } else if (type === 'sentences') {
    result = Array.from({ length: count }, (_, i) =>
      (i === 0 && start) ? loremOpener : makeSentence()
    ).join(' ');
  } else {
    result = Array.from({ length: count }, (_, i) =>
      (i === 0 && start) ? 'Lorem' : rw()
    ).join(' ');
  }
  document.getElementById('lorem-output').value = result;
}

// Generate on load
generateLorem();

// ===========================
// 11. EMOJI PICKER
// ===========================
const EMOJI_DATA = {
  'Smileys': [
    ['😀','grinning face'],['😃','big smile'],['😄','grinning squinting'],['😁','beaming'],
    ['😆','laughing'],['😅','sweat smile'],['🤣','rolling laughing'],['😂','tears of joy'],
    ['🙂','slightly smiling'],['🙃','upside down'],['😉','winking'],['😊','smiling'],
    ['😇','innocent halo'],['🥰','smiling hearts'],['😍','heart eyes'],['🤩','star struck'],
    ['😘','kissing heart'],['😋','yum tongue'],['😛','stuck out tongue'],['😜','winking tongue'],
    ['🤪','zany face'],['🤔','thinking'],['🤨','raised eyebrow'],['😐','neutral face'],
    ['😶','no mouth'],['😏','smirking'],['😒','unamused'],['🙄','eye roll'],['😬','grimacing'],
    ['😌','relieved'],['😔','pensive'],['😪','sleepy'],['😴','sleeping'],
    ['😷','mask sick'],['🤒','thermometer sick'],['🤕','bandage hurt'],['🤢','nauseated'],
    ['🤮','vomiting'],['🤧','sneezing'],['🥵','hot face'],['🥶','cold face'],
    ['😵','dizzy face'],['🤯','exploding head'],['🥳','partying'],['😎','sunglasses cool'],
    ['🤓','nerd glasses'],['🧐','monocle'],['😕','confused'],['😟','worried'],
    ['🙁','frowning'],['😮','open mouth'],['😲','astonished'],['😳','flushed'],
    ['🥺','pleading eyes'],['😦','frowning'],['😨','fearful'],['😰','anxious sweat'],
    ['😢','crying'],['😭','loudly crying'],['😱','screaming fear'],['😡','angry red'],
    ['😠','angry'],['🤬','cursing'],['😈','smiling devil'],['👿','angry devil'],
    ['💀','skull death'],['💩','pile of poo'],['🤡','clown'],['👻','ghost'],
    ['👽','alien'],['🤖','robot'],['💋','kiss mark'],['💌','love letter'],
  ],
  'People': [
    ['👋','wave hello'],['🤚','raised back hand'],['🖐','hand splayed'],['✋','raised hand'],
    ['🖖','vulcan salute'],['👌','ok hand'],['🤌','pinched fingers'],['✌️','peace victory'],
    ['🤞','crossed fingers luck'],['🤟','love you gesture'],['🤘','sign of horns rock'],
    ['🤙','call me hand'],['👈','point left'],['👉','point right'],['👆','point up'],
    ['👇','point down'],['☝️','index finger up'],['👍','thumbs up'],['👎','thumbs down'],
    ['✊','raised fist'],['👊','oncoming fist punch'],['🤛','left fist'],['🤜','right fist'],
    ['👏','clapping hands'],['🙌','raising hands celebrate'],['🤝','handshake'],
    ['🙏','folded hands pray thanks'],['💪','biceps muscle flex'],['🧠','brain'],
    ['👀','eyes look'],['👁','eye'],['👅','tongue'],['👄','lips mouth'],
    ['👶','baby'],['🧒','child'],['👦','boy'],['👧','girl'],['🧑','person'],
    ['👨','man'],['👩','woman'],['🧔','beard'],['🧓','older person'],['👴','old man'],
    ['👵','old woman'],['🤦','facepalm'],['🤷','shrug'],['💁','information person'],
    ['🙋','raising hand question'],['🧏','deaf person'],['🙇','bowing'],
    ['👩‍💻','woman technologist developer'],['👨‍💻','man technologist developer'],
  ],
  'Animals': [
    ['🐶','dog face'],['🐱','cat face'],['🐭','mouse face'],['🐹','hamster'],
    ['🐰','rabbit face'],['🦊','fox'],['🐻','bear'],['🐼','panda'],['🐨','koala'],
    ['🐯','tiger face'],['🦁','lion'],['🐮','cow face'],['🐷','pig face'],['🐸','frog'],
    ['🐵','monkey face'],['🙈','see no evil monkey'],['🙉','hear no evil monkey'],
    ['🙊','speak no evil monkey'],['🐔','chicken'],['🐧','penguin'],['🦆','duck'],
    ['🦅','eagle'],['🦉','owl'],['🦇','bat'],['🐺','wolf'],['🐴','horse face'],
    ['🦄','unicorn'],['🐝','honeybee'],['🦋','butterfly'],['🐛','caterpillar bug'],
    ['🐌','snail'],['🐞','ladybug'],['🐢','turtle'],['🐍','snake'],['🦎','lizard'],
    ['🐙','octopus'],['🦈','shark'],['🐬','dolphin'],['🐳','whale'],['🐋','spout whale'],
    ['🐘','elephant'],['🦒','giraffe'],['🦓','zebra'],['🐅','tiger'],['🐆','leopard'],
    ['🦍','gorilla'],['🐇','rabbit'],['🦝','raccoon'],['🦦','otter'],['🦥','sloth'],
    ['🌿','herb plant'],['🌲','tree evergreen'],['🌳','tree deciduous'],['🌴','palm tree'],
    ['🌵','cactus'],['🍄','mushroom'],['🌺','hibiscus flower'],['🌻','sunflower'],
    ['🌹','rose'],['🌷','tulip'],['🌸','cherry blossom'],['🍀','four leaf clover'],
  ],
  'Food': [
    ['🍎','red apple'],['🍊','orange'],['🍋','lemon'],['🍌','banana'],['🍉','watermelon'],
    ['🍇','grapes'],['🍓','strawberry'],['🫐','blueberries'],['🍒','cherries'],
    ['🍑','peach'],['🥭','mango'],['🍍','pineapple'],['🥥','coconut'],['🥝','kiwi'],
    ['🍅','tomato'],['🍆','eggplant'],['🥑','avocado'],['🥦','broccoli'],['🥕','carrot'],
    ['🌽','corn'],['🌶','hot pepper'],['🧄','garlic'],['🧅','onion'],['🥔','potato'],
    ['🍔','hamburger burger'],['🍟','french fries'],['🍕','pizza'],['🌮','taco'],
    ['🌯','burrito wrap'],['🍣','sushi'],['🍜','noodles ramen'],['🍝','spaghetti pasta'],
    ['🍛','curry rice'],['🍱','bento box'],['🥗','salad'],['🍤','fried shrimp'],
    ['🍩','doughnut donut'],['🍪','cookie'],['🎂','birthday cake'],['🍰','slice of cake'],
    ['🧁','cupcake'],['🍫','chocolate bar'],['🍬','candy'],['🍭','lollipop'],
    ['☕','coffee hot beverage'],['🍵','tea teacup'],['🧃','juice box'],['🥤','cup straw'],
    ['🧋','bubble tea boba'],['🍺','beer mug'],['🍻','clinking beer'],['🍷','wine glass'],
    ['🥂','champagne toast'],['🍸','cocktail'],['🍹','tropical drink'],['🥃','whiskey'],
    ['🍾','bottle celebration'],['🧊','ice cube'],
  ],
  'Travel': [
    ['🚗','car automobile'],['🚕','taxi'],['🚙','suv'],['🚌','bus'],['🏎','racing car'],
    ['🚓','police car'],['🚑','ambulance'],['🚒','fire truck'],['🚚','delivery truck'],
    ['🛻','pickup truck'],['🏍','motorcycle'],['🛵','motor scooter'],['🚲','bicycle bike'],
    ['🛴','kick scooter'],['✈️','airplane flight'],['🚀','rocket space'],
    ['🛸','ufo flying saucer'],['🚁','helicopter'],['⛵','sailboat'],['🚤','speedboat'],
    ['🛳','cruise ship'],['🚢','ship'],['⚓','anchor'],['🧭','compass navigation'],
    ['🏔','snow mountain'],['⛰','mountain'],['🌋','volcano'],['🗻','mount fuji'],
    ['🏕','camping tent'],['🏖','beach'],['🏝','island'],['🏠','house home'],
    ['🏢','office building'],['🏥','hospital'],['🏦','bank'],['🏨','hotel'],
    ['🏫','school'],['🏪','convenience store'],['🏛','classical building'],
    ['🏰','castle'],['🗼','tokyo tower'],['🗽','statue of liberty'],['⛩','shinto shrine'],
    ['🌁','foggy city'],['🌃','night city stars'],['🏙','cityscape'],
    ['🌆','city sunset'],['🌅','sunrise'],['🌄','sunrise mountains'],['🌌','milky way'],
  ],
  'Objects': [
    ['💻','laptop computer'],['🖥','desktop computer monitor'],['🖨','printer'],
    ['⌨️','keyboard'],['🖱','computer mouse'],['💾','floppy disk save'],
    ['💿','cd disc'],['📀','dvd disc'],['📱','mobile phone smartphone'],
    ['☎️','telephone'],['📞','telephone receiver'],['📡','satellite antenna'],
    ['🔋','battery'],['🔌','electric plug'],['💡','light bulb idea'],['🔦','flashlight'],
    ['🔧','wrench tool'],['🔨','hammer'],['⚙️','gear settings'],['🔩','nut bolt'],
    ['🛠','tools hammer wrench'],['🔑','key'],['🗝','old key'],['🔐','locked with key'],
    ['🔒','locked padlock'],['🔓','unlocked padlock'],['📷','camera photo'],
    ['📸','camera flash'],['📹','video camera'],['🎥','movie camera film'],
    ['📺','television tv'],['📻','radio'],['⌚','watch clock'],['⏰','alarm clock'],
    ['⏱','stopwatch'],['📖','open book'],['📚','books stack'],['📝','memo note'],
    ['📋','clipboard'],['📌','pushpin'],['📍','map pin location'],['📎','paperclip'],
    ['✂️','scissors cut'],['🔍','magnifying glass search'],['🧪','test tube lab'],
    ['🔬','microscope'],['🔭','telescope'],['📊','bar chart'],['📈','chart up growth'],
    ['📉','chart down decline'],['💰','money bag'],['💳','credit card'],['💎','gem diamond'],
    ['🏆','trophy award'],['🎖','medal'],['🎮','video game controller'],
    ['🕹','joystick'],['🎲','dice'],['🃏','joker playing card'],
  ],
  'Symbols': [
    ['❤️','red heart love'],['🧡','orange heart'],['💛','yellow heart'],['💚','green heart'],
    ['💙','blue heart'],['💜','purple heart'],['🖤','black heart'],['🤍','white heart'],
    ['🤎','brown heart'],['💔','broken heart'],['💕','two hearts'],['💯','hundred percent'],
    ['✅','check mark green ok'],['❌','cross mark error no'],['⭕','hollow red circle'],
    ['❎','cross button'],['⚠️','warning caution'],['🚫','prohibited no'],
    ['🔴','red circle'],['🟠','orange circle'],['🟡','yellow circle'],['🟢','green circle'],
    ['🔵','blue circle'],['🟣','purple circle'],['⚫','black circle'],['⚪','white circle'],
    ['🔶','orange diamond'],['🔷','blue diamond'],['▶️','play button'],['⏩','fast forward'],
    ['⏸','pause button'],['⏹','stop button'],['⏺','record button'],
    ['🔔','bell notification'],['🔕','muted bell'],['🎵','musical note'],['🎶','music notes'],
    ['🎉','party popper celebrate'],['🎊','confetti ball'],['🎈','balloon party'],
    ['🎁','gift present'],['🏳️','white flag'],['🏴','black flag'],['🚩','red flag warning'],
    ['🌈','rainbow'],['⭐','star'],['🌟','glowing star'],['💫','dizzy star'],
    ['✨','sparkles'],['💥','explosion collision'],['🔥','fire hot'],['💧','droplet water'],
    ['🌊','wave water'],['❄️','snowflake cold'],['⚡','lightning bolt electric'],
    ['🌍','earth globe world'],['🌐','globe internet'],['♻️','recycle'],
    ['🔗','link chain'],['📧','email envelope'],['📬','mailbox'],
  ],
};

let emojiCurrentCat = 'All';
let emojiSelected = null;

function initEmojiPicker() {
  const cats = document.getElementById('emoji-cats');
  const allCats = ['All', ...Object.keys(EMOJI_DATA)];
  cats.innerHTML = allCats.map(cat =>
    `<button class="emoji-cat-btn px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${cat === 'All' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'}" data-cat="${cat}" onclick="setEmojiCat('${cat}')">${cat}</button>`
  ).join('');
  renderEmojis();
}

function setEmojiCat(cat) {
  emojiCurrentCat = cat;
  document.getElementById('emoji-search').value = '';
  document.querySelectorAll('.emoji-cat-btn').forEach(btn => {
    const active = btn.dataset.cat === cat;
    btn.className = `emoji-cat-btn px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${active ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'}`;
  });
  renderEmojis();
}

function filterEmojis() {
  emojiCurrentCat = 'All';
  document.querySelectorAll('.emoji-cat-btn').forEach(btn => {
    btn.className = `emoji-cat-btn px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${btn.dataset.cat === 'All' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'}`;
  });
  renderEmojis();
}

function renderEmojis() {
  const q = document.getElementById('emoji-search').value.toLowerCase().trim();
  let items = emojiCurrentCat === 'All'
    ? Object.values(EMOJI_DATA).flat()
    : (EMOJI_DATA[emojiCurrentCat] || []);
  if (q) items = items.filter(([, n]) => n.includes(q));

  const grid = document.getElementById('emoji-grid');
  if (!items.length) {
    grid.innerHTML = '<p class="w-full text-center text-slate-400 py-8 text-sm">No emojis found</p>';
    return;
  }
  grid.innerHTML = items.map(([emoji, name]) =>
    `<button class="w-10 h-10 flex items-center justify-center text-2xl rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="${name}" data-emoji="${emoji}" data-name="${name}">${emoji}</button>`
  ).join('');
  grid.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      selectEmoji(btn.dataset.emoji, btn.dataset.name);
      navigator.clipboard.writeText(btn.dataset.emoji).then(() => showEmojiToast());
    });
  });
}

function selectEmoji(emoji, name) {
  emojiSelected = { emoji, name };
  document.getElementById('emoji-selected').classList.remove('hidden');
  document.getElementById('emoji-preview').textContent = emoji;
  document.getElementById('emoji-name').textContent = name;
  const codepoints = [...emoji].map(c => 'U+' + c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')).join(' ');
  const htmlEntity = [...emoji].map(c => `&#x${c.codePointAt(0).toString(16).toUpperCase()};`).join('');
  document.getElementById('emoji-unicode-val').textContent = codepoints;
  document.getElementById('emoji-html-val').textContent = htmlEntity;
}

function copySelectedEmoji(type) {
  if (!emojiSelected) return;
  let text = emojiSelected.emoji;
  if (type === 'unicode') {
    text = [...emojiSelected.emoji].map(c => '\\u{' + c.codePointAt(0).toString(16).toUpperCase() + '}').join('');
  } else if (type === 'html') {
    text = [...emojiSelected.emoji].map(c => `&#x${c.codePointAt(0).toString(16).toUpperCase()};`).join('');
  }
  navigator.clipboard.writeText(text).then(() => {
    flashCopy(document.getElementById(`emoji-copy-${type}`));
    showEmojiToast(type === 'char' ? 'Emoji copied!' : 'Copied!');
  });
}

function showEmojiToast(msg = 'Copied!') {
  const toast = document.getElementById('emoji-toast');
  toast.textContent = msg;
  toast.classList.remove('hidden');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.add('hidden'), 1500);
}

// Initialize emoji picker when its section is first shown
const _origShowTool = showTool;
showTool = function(toolId) {
  _origShowTool(toolId);
  if (toolId === 'icons' && !document.querySelector('#emoji-cats button')) {
    initEmojiPicker();
  }
};

// ===========================
// 12. CSV → JSON
// ===========================
function csvConvert() {
  const raw = document.getElementById('csv-input').value.trim();
  hideError('csv-error');
  if (!raw) { document.getElementById('csv-output').value = ''; return; }
  try {
    const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) throw new Error('Need at least a header row and one data row.');
    const headers = parseCSVLine(lines[0]);
    const rows = lines.slice(1).map(line => {
      const vals = parseCSVLine(line);
      const obj = {};
      headers.forEach((h, i) => { obj[h] = vals[i] !== undefined ? vals[i] : ''; });
      return obj;
    });
    const pretty = document.getElementById('csv-pretty').checked;
    document.getElementById('csv-output').value = JSON.stringify(rows, null, pretty ? 2 : 0);
  } catch(e) {
    showError('csv-error', '⛔ ' + e.message);
    document.getElementById('csv-output').value = '';
  }
}

function parseCSVLine(line) {
  const result = [];
  let cur = '', inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQ && line[i+1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
    } else if (c === ',' && !inQ) {
      result.push(cur.trim()); cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur.trim());
  return result;
}

function csvSample() {
  document.getElementById('csv-input').value =
`name,age,city,role
Alice,30,"New York",Engineer
Bob,25,London,Designer
"Charlie, Jr.",35,Berlin,Manager`;
  csvConvert();
}

// ===========================
// 13. HTML ENTITY
// ===========================
let heMode = 'encode';

function setHeMode(mode) {
  heMode = mode;
  const active = 'px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg font-medium transition-colors';
  const inactive = 'px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm rounded-lg font-medium transition-colors';
  document.getElementById('he-encode-tab').className = mode === 'encode' ? active : inactive;
  document.getElementById('he-decode-tab').className = mode === 'decode' ? active : inactive;
  document.getElementById('he-input').placeholder = mode === 'encode'
    ? '<h1 class="title">Hello & welcome</h1>'
    : '&lt;h1 class=&quot;title&quot;&gt;Hello &amp; welcome&lt;/h1&gt;';
  heConvert();
}

function heConvert() {
  const input = document.getElementById('he-input').value;
  if (!input) { document.getElementById('he-output').value = ''; return; }
  if (heMode === 'encode') {
    document.getElementById('he-output').value = input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  } else {
    document.getElementById('he-output').value = input
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n))
      .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
  }
}

function heSample() {
  if (heMode === 'encode') {
    document.getElementById('he-input').value = '<h1 class="title">Hello & "World" — it\'s <em>alive</em>!</h1>';
  } else {
    document.getElementById('he-input').value = '&lt;h1 class=&quot;title&quot;&gt;Hello &amp; &quot;World&quot; &mdash; it&#39;s &lt;em&gt;alive&lt;/em&gt;!&lt;/h1&gt;';
  }
  heConvert();
}

// ===========================
// 14. NUMBER BASE CONVERTER
// ===========================
let _nbUpdating = false;

function nbUpdate(dec) {
  if (_nbUpdating) return;
  _nbUpdating = true;
  hideError('nb-error');
  if (isNaN(dec) || dec === null) {
    ['nb-dec','nb-hex','nb-bin','nb-oct'].forEach(id => { if (document.activeElement.id !== id) document.getElementById(id).value = ''; });
    _nbUpdating = false;
    return;
  }
  const n = BigInt(Math.round(dec));
  if (document.activeElement.id !== 'nb-dec') document.getElementById('nb-dec').value = n.toString(10);
  if (document.activeElement.id !== 'nb-hex') document.getElementById('nb-hex').value = n.toString(16).toUpperCase();
  if (document.activeElement.id !== 'nb-bin') document.getElementById('nb-bin').value = n.toString(2);
  if (document.activeElement.id !== 'nb-oct') document.getElementById('nb-oct').value = n.toString(8);
  _nbUpdating = false;
}

function nbFromDec() {
  const v = document.getElementById('nb-dec').value.trim();
  if (!v) { ['nb-hex','nb-bin','nb-oct'].forEach(id => document.getElementById(id).value = ''); return; }
  const n = parseInt(v, 10);
  if (isNaN(n)) { showError('nb-error', '⛔ Invalid decimal number'); return; }
  nbUpdate(n);
}

function nbFromHex() {
  const v = document.getElementById('nb-hex').value.trim();
  if (!v) { ['nb-dec','nb-bin','nb-oct'].forEach(id => document.getElementById(id).value = ''); return; }
  const n = parseInt(v, 16);
  if (isNaN(n)) { showError('nb-error', '⛔ Invalid hexadecimal number'); return; }
  nbUpdate(n);
}

function nbFromBin() {
  const v = document.getElementById('nb-bin').value.trim();
  if (!v) { ['nb-dec','nb-hex','nb-oct'].forEach(id => document.getElementById(id).value = ''); return; }
  const n = parseInt(v, 2);
  if (isNaN(n)) { showError('nb-error', '⛔ Invalid binary number'); return; }
  nbUpdate(n);
}

function nbFromOct() {
  const v = document.getElementById('nb-oct').value.trim();
  if (!v) { ['nb-dec','nb-hex','nb-bin'].forEach(id => document.getElementById(id).value = ''); return; }
  const n = parseInt(v, 8);
  if (isNaN(n)) { showError('nb-error', '⛔ Invalid octal number'); return; }
  nbUpdate(n);
}

// ===========================
// 15. CRON PARSER
// ===========================
function parseCron() {
  const expr = document.getElementById('cron-input').value.trim();
  const result = document.getElementById('cron-result');
  hideError('cron-error');
  result.classList.add('hidden');
  if (!expr) return;

  const parts = expr.split(/\s+/);
  if (parts.length !== 5) {
    showError('cron-error', '⛔ Expected exactly 5 fields: minute hour day month weekday');
    return;
  }

  try {
    const [min, hour, dom, month, dow] = parts;
    const desc = describeCron(min, hour, dom, month, dow);
    document.getElementById('cron-description').textContent = desc;

    const labels = ['Minute', 'Hour', 'Day', 'Month', 'Weekday'];
    const ranges = ['0-59', '0-23', '1-31', '1-12', '0-6'];
    document.getElementById('cron-fields').innerHTML = parts.map((p, i) =>
      `<div class="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-center">
        <p class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">${labels[i]}</p>
        <code class="text-lg font-mono text-indigo-500">${escHtml(p)}</code>
        <p class="text-[10px] text-slate-400 mt-1">${ranges[i]}</p>
      </div>`
    ).join('');

    const next = nextCronRuns(parts, 5);
    document.getElementById('cron-next').innerHTML = next.map(d =>
      `<p class="text-sm font-mono text-slate-600 dark:text-slate-300">${d.toLocaleString()}</p>`
    ).join('');

    result.classList.remove('hidden');
  } catch(e) {
    showError('cron-error', '⛔ ' + e.message);
  }
}

function describeCron(min, hour, dom, month, dow) {
  const months = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  function fmtField(f, type) {
    if (f === '*') return null;
    if (f.startsWith('*/')) return `every ${f.slice(2)} ${type}s`;
    if (f.includes('-')) {
      const [a,b] = f.split('-');
      if (type === 'weekday') return `${days[+a] || a}–${days[+b] || b}`;
      if (type === 'month') return `${months[+a] || a}–${months[+b] || b}`;
      return `${a}–${b}`;
    }
    if (f.includes(',')) {
      const vals = f.split(',');
      if (type === 'weekday') return vals.map(v => days[+v] || v).join(', ');
      if (type === 'month') return vals.map(v => months[+v] || v).join(', ');
      return vals.join(', ');
    }
    if (type === 'weekday') return days[+f] || f;
    if (type === 'month') return months[+f] || f;
    return f;
  }

  const minuteDesc = fmtField(min, 'minute');
  const hourDesc = fmtField(hour, 'hour');
  const domDesc = fmtField(dom, 'day');
  const monthDesc = fmtField(month, 'month');
  const dowDesc = fmtField(dow, 'weekday');

  let when = '';
  if (minuteDesc && hourDesc) when = `at ${hourDesc}:${min.padStart ? min.padStart(2,'0') : min}`;
  else if (hourDesc) when = `at ${hourDesc}:00`;
  else if (minuteDesc) when = `at minute ${minuteDesc} of every hour`;
  else when = 'every minute';

  let freq = '';
  if (domDesc && monthDesc) freq = `on day ${domDesc} of ${monthDesc}`;
  else if (domDesc) freq = `on day ${domDesc} of every month`;
  else if (monthDesc) freq = `every day in ${monthDesc}`;
  else if (dowDesc) freq = `on ${dowDesc}`;
  else freq = 'every day';

  return `Runs ${when}, ${freq}.`;
}

function nextCronRuns(parts, count) {
  const [minF, hourF, domF, monthF, dowF] = parts;
  const results = [];
  const now = new Date();
  const d = new Date(now);
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() + 1);

  function matches(val, field) {
    if (field === '*') return true;
    if (field.startsWith('*/')) return val % parseInt(field.slice(2)) === 0;
    return field.split(',').some(part => {
      if (part.includes('-')) {
        const [a, b] = part.split('-').map(Number);
        return val >= a && val <= b;
      }
      return parseInt(part) === val;
    });
  }

  let tries = 0;
  while (results.length < count && tries < 500000) {
    tries++;
    if (
      matches(d.getMonth() + 1, monthF) &&
      matches(d.getDate(), domF) &&
      matches(d.getDay(), dowF) &&
      matches(d.getHours(), hourF) &&
      matches(d.getMinutes(), minF)
    ) {
      results.push(new Date(d));
    }
    d.setMinutes(d.getMinutes() + 1);
  }
  return results;
}

function cronSample() {
  const samples = ['0 9 * * 1-5','*/15 * * * *','0 0 1 * *','30 18 * * 5','0 */6 * * *'];
  document.getElementById('cron-input').value = samples[Math.floor(Math.random() * samples.length)];
  parseCron();
}

// ===========================
// SHARE BUTTON
// ===========================
const SHARE_INPUTS = {
  json:       () => document.getElementById('json-input').value,
  base64:     () => document.getElementById('b64-input').value,
  url:        () => document.getElementById('url-input').value,
  jwt:        () => document.getElementById('jwt-input').value,
  hash:       () => document.getElementById('hash-input').value,
  regex:      () => JSON.stringify({ p: document.getElementById('regex-pattern').value, t: document.getElementById('regex-test').value }),
  timestamp:  () => document.getElementById('ts-unix').value,
  csv:        () => document.getElementById('csv-input').value,
  htmlentity: () => document.getElementById('he-input').value,
  numbase:    () => document.getElementById('nb-dec').value,
  cron:       () => document.getElementById('cron-input').value,
};

const SHARE_RESTORE = {
  json:       v => { document.getElementById('json-input').value = v; jsonFormat(); },
  base64:     v => { document.getElementById('b64-input').value = v; b64Convert(); },
  url:        v => { document.getElementById('url-input').value = v; urlConvert(); },
  jwt:        v => { document.getElementById('jwt-input').value = v; jwtDecode(); },
  hash:       v => { document.getElementById('hash-input').value = v; autoHash(); },
  regex:      v => { try { const o = JSON.parse(v); document.getElementById('regex-pattern').value = o.p; document.getElementById('regex-test').value = o.t; runRegex(); } catch{} },
  timestamp:  v => { document.getElementById('ts-unix').value = v; unixToDate(); },
  csv:        v => { document.getElementById('csv-input').value = v; csvConvert(); },
  htmlentity: v => { document.getElementById('he-input').value = v; heConvert(); },
  numbase:    v => { document.getElementById('nb-dec').value = v; nbFromDec(); },
  cron:       v => { document.getElementById('cron-input').value = v; parseCron(); },
};

function shareCurrentTool() {
  const active = document.querySelector('.tool-section.active');
  if (!active) return;
  const toolId = active.id;
  const getInput = SHARE_INPUTS[toolId];
  const input = getInput ? getInput() : '';
  const encoded = input ? btoa(new TextEncoder().encode(input).reduce((s, b) => s + String.fromCharCode(b), '')) : '';
  const url = location.origin + location.pathname + '#' + toolId + (encoded ? ':' + encoded : '');
  navigator.clipboard.writeText(url).then(() => {
    const btn = document.getElementById('share-btn-text');
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Share', 2000);
    const toast = document.getElementById('share-toast');
    toast.classList.remove('hidden');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.add('hidden'), 2000);
  });
}

// Restore from URL hash on load
(function restoreFromHash() {
  const hash = location.hash.slice(1);
  if (!hash) return;
  const colonIdx = hash.indexOf(':');
  const toolId = colonIdx === -1 ? hash : hash.slice(0, colonIdx);
  const encoded = colonIdx === -1 ? '' : hash.slice(colonIdx + 1);
  if (!document.getElementById(toolId)) return;
  showTool(toolId);
  if (encoded && SHARE_RESTORE[toolId]) {
    try {
      const bytes = Uint8Array.from(atob(encoded), c => c.charCodeAt(0));
      const val = new TextDecoder().decode(bytes);
      SHARE_RESTORE[toolId](val);
    } catch {}
  }
})();
