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
