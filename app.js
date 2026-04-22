// ============================================================
// Letter Party — real-time multiplayer, PeerJS-based
// Host is authoritative: holds game state, scores, and broadcasts.
// ============================================================

const DEFAULT_CATEGORIES_BY_LANG = {
  en: [
    { id: 'name', label: 'Name' },
    { id: 'animal', label: 'Animal' },
    { id: 'thing', label: 'Thing' },
    { id: 'country', label: 'Country' },
    { id: 'food', label: 'Food' },
    { id: 'fiction', label: 'Fiction' },
  ],
  ar: [
    { id: 'name', label: 'اسم' },
    { id: 'animal', label: 'حيوان' },
    { id: 'thing', label: 'شيء' },
    { id: 'country', label: 'بلد' },
    { id: 'food', label: 'طعام' },
    { id: 'fiction', label: 'خيال' },
  ],
};

const ALPHABETS = {
  en: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  ar: ['ا','ب','ت','ث','ج','ح','خ','د','ذ','ر','ز','س','ش','ص','ض','ط','ظ','ع','غ','ف','ق','ك','ل','م','ن','ه','و','ي'],
};

const TRANSLATIONS = {
  en: {
    title_html: 'Letter <span class="accent">Party</span>',
    tagline: 'Name · Animal · Thing · Country · Food · Fiction',
    your_name: 'Your Name',
    create_party: 'Create Party',
    or_join: 'or join one',
    room_code_label: 'Room Code',
    join_party: 'Join Party',
    lobby: 'Lobby',
    players: 'Players',
    categories: 'Categories',
    add_custom_placeholder: 'Add custom category',
    add: 'Add',
    host_change_cats: 'Only the host can change categories.',
    start_game: 'Start Game',
    leave: 'Leave',
    copy: 'Copy',
    copied: 'Copied!',
    host: 'Host',
    you: 'You',
    round: 'Round',
    rolling: 'Rolling the wheel…',
    write_prompt: 'Write words starting with this letter!',
    done: 'Done!',
    submitted: 'Submitted',
    finished_first: '{name} finished first!',
    you_done: 'You clicked Done! Waiting for results…',
    submitted_wait: 'Submitted — waiting for results…',
    finished_first_lock: '{name} finished first! Locking in your answers…',
    letter_col: 'Letter',
    pts_col: 'Pts',
    pts_header: '+Pts',
    player_col: 'Player',
    round_results_prefix: 'Round Results — Letter',
    scoreboard: 'Scoreboard',
    next_letter: 'Next Letter',
    end_game: 'End Game',
    waiting_host_end: 'Waiting for the host to continue or end the game…',
    only_host_next: 'Only the host can start the next round.',
    only_host_end: 'Only the host can end the game.',
    game_over: 'Game Over',
    back_home: 'Back to Home',
    enter_name: 'Enter your name first.',
    enter_code: 'Enter a 6-character room code.',
    creating: 'Creating party…',
    joining: 'Joining…',
    room_clash: 'Room code clash — tap Create Party again.',
    cannot_reach: 'Cannot reach the matchmaking server. Check your internet.',
    conn_error: 'Connection error: {type}',
    room_not_found: 'Room not found. Check the code.',
    host_disconn: 'Host disconnected.',
    could_not_connect: 'Could not connect: {type}',
    share_hint: 'Share the room code with friends. You can start when at least one more player joins — or solo.',
    waiting_start: 'Waiting for the host to start the game.',
    wins_with: '{name} wins with {score} pts!',
    tie_at: 'Tie between {names} at {score} pts!',
  },
  ar: {
    title_html: 'لعبة <span class="accent">الحروف</span>',
    tagline: 'اسم · حيوان · شيء · بلد · طعام · خيال',
    your_name: 'اسمك',
    create_party: 'إنشاء لعبة',
    or_join: 'أو انضم إلى لعبة',
    room_code_label: 'رمز الغرفة',
    join_party: 'انضم',
    lobby: 'الصالة',
    players: 'اللاعبون',
    categories: 'الفئات',
    add_custom_placeholder: 'أضف فئة مخصصة',
    add: 'أضف',
    host_change_cats: 'يمكن للمضيف فقط تغيير الفئات.',
    start_game: 'ابدأ اللعبة',
    leave: 'غادر',
    copy: 'نسخ',
    copied: 'تم النسخ!',
    host: 'المضيف',
    you: 'أنت',
    round: 'جولة',
    rolling: 'تدور العجلة…',
    write_prompt: 'اكتب كلمات تبدأ بهذا الحرف!',
    done: 'انتهيت!',
    submitted: 'تم الإرسال',
    finished_first: '{name} انتهى أولاً!',
    you_done: 'ضغطت على انتهيت! في انتظار النتائج…',
    submitted_wait: 'تم الإرسال — في انتظار النتائج…',
    finished_first_lock: '{name} انتهى أولاً! جاري تثبيت إجاباتك…',
    letter_col: 'الحرف',
    pts_col: 'نقاط',
    pts_header: '+نقاط',
    player_col: 'اللاعب',
    round_results_prefix: 'نتائج الجولة — حرف',
    scoreboard: 'لوحة النتائج',
    next_letter: 'الحرف التالي',
    end_game: 'إنهاء اللعبة',
    waiting_host_end: 'في انتظار المضيف للمتابعة أو الإنهاء…',
    only_host_next: 'فقط المضيف يمكنه بدء الجولة التالية.',
    only_host_end: 'فقط المضيف يمكنه إنهاء اللعبة.',
    game_over: 'انتهت اللعبة',
    back_home: 'العودة للبداية',
    enter_name: 'أدخل اسمك أولاً.',
    enter_code: 'أدخل رمز غرفة مكون من ٦ أحرف.',
    creating: 'جاري إنشاء اللعبة…',
    joining: 'جاري الانضمام…',
    room_clash: 'تعارض في الرمز — اضغط إنشاء لعبة مجدداً.',
    cannot_reach: 'تعذر الوصول إلى خادم المطابقة. تحقق من اتصالك.',
    conn_error: 'خطأ في الاتصال: {type}',
    room_not_found: 'لم يتم العثور على الغرفة. تحقق من الرمز.',
    host_disconn: 'انقطع المضيف.',
    could_not_connect: 'تعذر الاتصال: {type}',
    share_hint: 'شارك رمز الغرفة مع الأصدقاء. يمكنك البدء عند انضمام لاعب آخر — أو بمفردك.',
    waiting_start: 'في انتظار المضيف لبدء اللعبة.',
    wins_with: 'فاز {name} بـ {score} نقطة!',
    tie_at: 'تعادل بين {names} عند {score} نقطة!',
  },
};

const cloneCategoriesFor = (lang) =>
  (DEFAULT_CATEGORIES_BY_LANG[lang] || DEFAULT_CATEGORIES_BY_LANG.en).map(c => ({ ...c }));
const cloneCategories = () => cloneCategoriesFor((typeof state !== 'undefined' && state && state.language) || getInitialLanguage());
function currentAlphabet() { return ALPHABETS[state?.language] || ALPHABETS.en; }
function getInitialLanguage() {
  try {
    const v = localStorage.getItem('letterparty-lang');
    if (v === 'en' || v === 'ar') return v;
  } catch {}
  return 'en';
}
const ID_PREFIX = 'letterpartyv1-';

const state = {
  peer: null,
  isHost: false,
  roomCode: '',
  myId: '',
  myName: '',
  hostConn: null,              // guest -> host connection
  guestConns: new Map(),       // host: peerId -> conn
  players: [],                 // [{id, name, score}]
  usedLetters: [],
  currentLetter: '',
  round: 0,
  roundAnswers: {},            // {peerId: {category: answer}}
  firstFinisherId: null,
  submittedIds: new Set(),
  gameActive: false,
  locked: false,
  lastResults: null,
  myHistory: [],               // [{letter, answers, tags, points}]
  categories: cloneCategoriesFor(getInitialLanguage()),
  language: getInitialLanguage(),
  roundAlphabet: ALPHABETS[getInitialLanguage()] || ALPHABETS.en,
};

// ---------- DOM helpers ----------
const $ = id => document.getElementById(id);
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
}
function setStatus(id, msg, isError = true) {
  const el = $(id);
  el.textContent = msg;
  el.style.color = isError ? 'var(--warn)' : 'var(--muted)';
}

// ---------- Utilities ----------
function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}
function pickLetter() {
  const alphabet = currentAlphabet();
  const remaining = alphabet.filter(l => !state.usedLetters.includes(l));
  if (remaining.length === 0) {
    state.usedLetters = [];
    return pickLetter();
  }
  // Cryptographically strong, unbiased selection (rejection sampling)
  const n = remaining.length;
  const max = Math.floor(0x100000000 / n) * n;
  const buf = new Uint32Array(1);
  let r;
  do {
    crypto.getRandomValues(buf);
    r = buf[0];
  } while (r >= max);
  const letter = remaining[r % n];
  state.usedLetters.push(letter);
  return letter;
}

function firstLetterMatches(word, letter) {
  if (!word) return false;
  let first = word[0];
  // Arabic alif variants normalize to plain alif
  if (first === 'أ' || first === 'إ' || first === 'آ') first = 'ا';
  if (first === letter) return true;
  return first.toUpperCase() === letter;
}
function getPlayerName(id) {
  const p = state.players.find(x => x.id === id);
  return p ? p.name : 'Unknown';
}

// ============================================================
// Home screen wiring
// ============================================================
$('create-btn').addEventListener('click', createParty);
$('join-btn').addEventListener('click', joinParty);
$('room-code-input').addEventListener('input', e => {
  e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
});
$('player-name').addEventListener('keydown', e => {
  if (e.key === 'Enter') createParty();
});

function createParty() {
  const name = $('player-name').value.trim();
  if (!name) return setStatus('home-status', t('enter_name'));

  state.myName = name;
  state.isHost = true;
  state.roomCode = generateRoomCode();

  setStatus('home-status', t('creating'), false);

  const peerId = ID_PREFIX + state.roomCode;
  state.peer = new Peer(peerId, { debug: 1 });

  state.peer.on('open', id => {
    state.myId = id;
    state.players = [{ id, name: state.myName, score: 0 }];
    $('room-code-display').textContent = state.roomCode;
    renderLobby();
    renderCategories();
    showScreen('lobby-screen');
    setStatus('lobby-status', '', false);
    $('lobby-hint').textContent = t('share_hint');
    $('start-game-btn').disabled = false;
    updateLangToggleLocked();
  });

  state.peer.on('connection', conn => {
    conn.on('open', () => {
      state.guestConns.set(conn.peer, conn);
    });
    conn.on('data', data => handleHostMessage(conn, data));
    conn.on('close', () => handleGuestDisconnect(conn.peer));
    conn.on('error', err => console.error('guest conn error', err));
  });

  state.peer.on('error', err => {
    console.error('peer error', err);
    if (err.type === 'unavailable-id') {
      setStatus('home-status', t('room_clash'));
      state.peer.destroy();
      state.peer = null;
    } else if (err.type === 'network' || err.type === 'server-error' || err.type === 'socket-error') {
      setStatus('home-status', t('cannot_reach'));
    } else {
      setStatus('home-status', t('conn_error', { type: err.type }));
    }
  });
}

function joinParty() {
  const name = $('player-name').value.trim();
  if (!name) return setStatus('home-status', t('enter_name'));
  const code = $('room-code-input').value.trim().toUpperCase();
  if (code.length !== 6) return setStatus('home-status', t('enter_code'));

  state.myName = name;
  state.isHost = false;
  state.roomCode = code;

  setStatus('home-status', t('joining'), false);

  state.peer = new Peer({ debug: 1 });

  state.peer.on('open', id => {
    state.myId = id;
    const hostId = ID_PREFIX + code;
    const conn = state.peer.connect(hostId, { reliable: true });
    state.hostConn = conn;

    conn.on('open', () => {
      conn.send({ type: 'join', name: state.myName });
      $('room-code-display').textContent = state.roomCode;
      renderLobby();
      renderCategories();
      showScreen('lobby-screen');
      $('lobby-hint').textContent = t('waiting_start');
      $('start-game-btn').style.display = 'none';
      setStatus('lobby-status', '', false);
      updateLangToggleLocked();
    });
    conn.on('data', data => handleGuestMessage(data));
    conn.on('close', () => {
      setStatus('lobby-status', t('host_disconn'), true);
    });
    conn.on('error', err => {
      console.error('host conn error', err);
      setStatus('home-status', t('could_not_connect', { type: err.type }));
    });
  });

  state.peer.on('error', err => {
    console.error('peer error', err);
    if (err.type === 'peer-unavailable') {
      setStatus('home-status', t('room_not_found'));
    } else {
      setStatus('home-status', t('conn_error', { type: err.type }));
    }
  });
}

$('copy-code').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(state.roomCode);
    $('copy-code').textContent = t('copied');
    setTimeout(() => $('copy-code').textContent = t('copy'), 1200);
  } catch {
    $('copy-code').textContent = state.roomCode;
  }
});

$('leave-lobby-btn').addEventListener('click', () => {
  fullReset();
});

// ============================================================
// Lobby rendering
// ============================================================
function renderLobby() {
  const list = $('player-list');
  list.innerHTML = '';
  state.players.forEach((p, idx) => {
    const li = document.createElement('li');
    const dot = document.createElement('span'); dot.className = 'dot';
    const name = document.createElement('span'); name.textContent = p.name;
    li.appendChild(dot); li.appendChild(name);
    if (idx === 0) {
      const tag = document.createElement('span');
      tag.className = 'host-tag'; tag.textContent = t('host');
      li.appendChild(tag);
    }
    if (p.id === state.myId) {
      const tag = document.createElement('span');
      tag.className = 'me-tag'; tag.textContent = t('you');
      li.appendChild(tag);
    }
    list.appendChild(li);
  });
}

// ============================================================
// Host-side
// ============================================================
function broadcast(msg) {
  for (const conn of state.guestConns.values()) {
    if (conn && conn.open) conn.send(msg);
  }
}
function broadcastPlayers() {
  const players = state.players.map(p => ({ id: p.id, name: p.name, score: p.score }));
  broadcast({ type: 'players', players });
}

function handleHostMessage(conn, data) {
  if (!data || !data.type) return;

  if (data.type === 'join') {
    if (!state.players.find(p => p.id === conn.peer)) {
      state.players.push({ id: conn.peer, name: String(data.name || 'Player').slice(0, 20), score: 0 });
    }
    broadcastPlayers();
    renderLobby();
    // Send current categories and language to the new joiner
    if (conn && conn.open) {
      conn.send({
        type: 'categories_update',
        categories: state.categories.map(c => ({ id: c.id, label: c.label })),
      });
      conn.send({ type: 'language_update', language: state.language });
    }
    return;
  }

  if (data.type === 'submit') {
    if (!state.gameActive) return;
    if (state.submittedIds.has(conn.peer)) return;
    recordSubmission(conn.peer, data.answers);
    return;
  }
}

function handleGuestDisconnect(peerId) {
  state.guestConns.delete(peerId);
  state.players = state.players.filter(p => p.id !== peerId);
  if (state.gameActive) {
    state.submittedIds.delete(peerId);
    checkAllSubmitted();
  }
  broadcastPlayers();
  renderLobby();
}

// ---------- Host: starting the game ----------
$('start-game-btn').addEventListener('click', () => {
  if (!state.isHost) return;
  startNewRound();
});

function startNewRound() {
  state.gameActive = true;
  state.locked = false;
  state.firstFinisherId = null;
  state.submittedIds = new Set();
  state.roundAnswers = {};
  state.roundAlphabet = currentAlphabet();
  state.currentLetter = pickLetter();
  state.round += 1;

  broadcast({
    type: 'round_start',
    letter: state.currentLetter,
    round: state.round,
    alphabet: state.roundAlphabet,
  });
  enterRound(state.currentLetter, state.round);
}

function recordSubmission(peerId, answers) {
  const sanitized = {};
  for (const cat of state.categories.map(c => c.id)) {
    const v = answers && typeof answers[cat] === 'string' ? answers[cat].trim().slice(0, 40) : '';
    sanitized[cat] = v;
  }
  state.roundAnswers[peerId] = sanitized;
  state.submittedIds.add(peerId);

  if (!state.firstFinisherId) {
    state.firstFinisherId = peerId;
    state.locked = true;
    broadcast({ type: 'lock', finisherName: getPlayerName(peerId) });
    // host itself locks too
    lockHostInputs(getPlayerName(peerId));
    // host auto-submits its current answers if not already
    if (!state.submittedIds.has(state.myId)) {
      const hostAnswers = readFormAnswers();
      recordSubmission(state.myId, hostAnswers);
    }
  }
  checkAllSubmitted();
}

function checkAllSubmitted() {
  const allIds = state.players.map(p => p.id);
  const done = allIds.every(id => state.submittedIds.has(id));
  if (done) finishRoundAsHost();
}

function finishRoundAsHost() {
  const { scores, byCategory } = scoreRound();
  for (const p of state.players) p.score += scores[p.id] || 0;

  const results = {
    type: 'round_results',
    letter: state.currentLetter,
    round: state.round,
    answers: state.roundAnswers,
    scores,
    byCategory,
    players: state.players.map(p => ({ id: p.id, name: p.name, score: p.score })),
    firstFinisherId: state.firstFinisherId,
    usedLetters: [...state.usedLetters],
  };
  state.lastResults = results;
  recordMyHistoryFromResults(results);
  broadcast(results);
  showResults(results);
  state.gameActive = false;
}

function scoreRound() {
  const scores = {};
  const byCategory = {}; // { cat: { peerId: 'unique'|'dup'|'bad'|'blank' } }
  for (const p of state.players) scores[p.id] = 0;

  for (const cat of state.categories.map(c => c.id)) {
    byCategory[cat] = {};
    const buckets = {}; // normalized -> [peerId]
    for (const p of state.players) {
      const raw = (state.roundAnswers[p.id]?.[cat] || '').trim();
      if (!raw) { byCategory[cat][p.id] = 'blank'; continue; }
      if (!firstLetterMatches(raw, state.currentLetter)) {
        byCategory[cat][p.id] = 'bad';
        continue;
      }
      const norm = raw.toLowerCase().replace(/\s+/g, ' ');
      (buckets[norm] = buckets[norm] || []).push(p.id);
    }
    for (const norm in buckets) {
      const ids = buckets[norm];
      const pts = ids.length === 1 ? 10 : 5;
      const tag = ids.length === 1 ? 'unique' : 'dup';
      for (const id of ids) {
        scores[id] += pts;
        byCategory[cat][id] = tag;
      }
    }
  }
  return { scores, byCategory };
}

// ---------- Host: next round / end buttons ----------
$('next-round-btn').addEventListener('click', () => {
  if (state.isHost) {
    startNewRound();
  } else {
    setStatus('results-status', t('only_host_next'));
  }
});
$('end-game-btn').addEventListener('click', () => {
  if (state.isHost) {
    endGame();
  } else {
    setStatus('results-status', t('only_host_end'));
  }
});

function endGame() {
  const finalPlayers = state.players.map(p => ({ id: p.id, name: p.name, score: p.score }));
  broadcast({ type: 'game_end', players: finalPlayers });
  showFinal(finalPlayers);
}

$('play-again-btn').addEventListener('click', () => {
  fullReset();
});

// ============================================================
// Guest-side
// ============================================================
function handleGuestMessage(data) {
  if (!data || !data.type) return;

  if (data.type === 'players') {
    // Merge: keep my id if present
    state.players = data.players.map(p => ({ id: p.id, name: p.name, score: p.score }));
    renderLobby();
    return;
  }

  if (data.type === 'categories_update') {
    state.categories = (data.categories || []).map(c => ({ id: c.id, label: c.label }));
    renderCategories();
    return;
  }

  if (data.type === 'language_update') {
    const nextLang = (data.language === 'ar') ? 'ar' : 'en';
    if (nextLang !== state.language) {
      const oldLang = state.language;
      state.language = nextLang;
      maybeSwapDefaultCategories(oldLang);
      applyLanguage();
    }
    updateLangToggleLocked();
    return;
  }

  if (data.type === 'round_start') {
    state.currentLetter = data.letter;
    state.round = data.round;
    state.roundAlphabet = Array.isArray(data.alphabet) && data.alphabet.length ? data.alphabet : currentAlphabet();
    enterRound(data.letter, data.round);
    return;
  }

  if (data.type === 'lock') {
    lockInputsAndSubmit(data.finisherName);
    return;
  }

  if (data.type === 'round_results') {
    state.players = data.players;
    state.lastResults = data;
    state.usedLetters = data.usedLetters || state.usedLetters;
    recordMyHistoryFromResults(data);
    showResults(data);
    return;
  }

  if (data.type === 'score_update') {
    state.players = data.players;
    if (state.lastResults) {
      state.lastResults.scores = data.scores;
      state.lastResults.players = data.players;
    }
    // Keep my own history row in sync if the update is for the latest round
    const last = state.myHistory[state.myHistory.length - 1];
    if (last && last.letter === data.letter) {
      last.points = data.scores[state.myId] || 0;
    }
    if (state.lastResults) showResults(state.lastResults);
    return;
  }

  if (data.type === 'game_end') {
    state.players = data.players;
    showFinal(data.players);
    return;
  }
}

// ============================================================
// Game screen (shared by host & guest)
// ============================================================
async function enterRound(letter, round) {
  showScreen('game-screen');
  window.scrollTo({ top: 0, behavior: 'auto' });
  $('round-number').textContent = round;
  updateLangToggleLocked();
  renderSheet();
  $('current-letter-cell').textContent = '?';
  $('current-pts-cell').textContent = '—';
  $('current-row').classList.remove('sealed');
  $('finish-status').textContent = t('rolling');
  $('finish-status').classList.remove('urgent');

  renderHistory();

  const form = $('answers-form');
  form.reset();
  // Lock inputs during spin so no one can type before the letter is revealed
  for (const input of form.querySelectorAll('input')) {
    input.disabled = true;
  }
  $('done-btn').disabled = true;
  $('done-btn').textContent = t('done');
  state.locked = true;

  await spinToLetter(letter);

  $('finish-status').textContent = t('write_prompt');
  for (const input of form.querySelectorAll('input')) {
    input.disabled = false;
  }
  $('done-btn').disabled = false;
  state.locked = false;

  setTimeout(() => form.querySelector('input[name="name"]').focus(), 60);
}

function spinToLetter(finalLetter, totalMs = 1800) {
  return new Promise(resolve => {
    const bigEl = $('letter-display');
    const cellEl = $('current-letter-cell');
    const alphabet = (state.roundAlphabet && state.roundAlphabet.length) ? state.roundAlphabet : currentAlphabet();
    bigEl.classList.remove('settled');
    bigEl.classList.add('spinning');

    const start = performance.now();
    let lastTick = 0;
    let lastShown = finalLetter;

    function loop(now) {
      const elapsed = now - start;
      if (elapsed >= totalMs) {
        bigEl.classList.remove('spinning');
        bigEl.textContent = finalLetter;
        cellEl.textContent = finalLetter;
        bigEl.classList.remove('settled');
        void bigEl.offsetWidth;
        bigEl.classList.add('settled');
        setTimeout(() => bigEl.classList.remove('settled'), 700);
        resolve();
        return;
      }
      const t = elapsed / totalMs;
      const interval = 40 + Math.pow(t, 2.6) * 340;
      if (now - lastTick >= interval) {
        lastTick = now;
        let next;
        do { next = alphabet[Math.floor(Math.random() * alphabet.length)]; }
        while (next === lastShown && alphabet.length > 1);
        lastShown = next;
        bigEl.textContent = next;
        cellEl.textContent = next;
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  });
}

function renderHistory() {
  const container = $('history-rows');
  container.innerHTML = '';
  for (const entry of state.myHistory) {
    const row = document.createElement('div');
    row.className = 'sheet-row history-row';

    const letterCell = document.createElement('div');
    letterCell.className = 'col-letter letter-cell';
    letterCell.textContent = entry.letter;
    row.appendChild(letterCell);

    for (const catObj of state.categories) {
      const cat = catObj.id;
      const cell = document.createElement('div');
      const tag = entry.tags[cat] || 'blank';
      cell.className = 'col-cat cell-static ans-' + tag;
      const raw = (entry.answers[cat] || '').trim();
      const labelSpan = document.createElement('span');
      labelSpan.className = 'cell-label';
      labelSpan.textContent = catObj.label;
      cell.appendChild(labelSpan);
      const valSpan = document.createElement('span');
      valSpan.className = 'cell-value';
      valSpan.textContent = raw || '—';
      cell.appendChild(valSpan);
      row.appendChild(cell);
    }

    const ptsCell = document.createElement('div');
    ptsCell.className = 'col-pts pts-cell';
    ptsCell.textContent = '+' + entry.points;
    row.appendChild(ptsCell);

    container.appendChild(row);
  }
}

function recordMyHistoryFromResults(results) {
  const myAnswers = results.answers?.[state.myId] || {};
  const myTags = {};
  for (const cat of state.categories.map(c => c.id)) {
    myTags[cat] = (results.byCategory?.[cat]?.[state.myId]) || 'blank';
  }
  const myPoints = (results.scores?.[state.myId]) || 0;
  state.myHistory.push({
    letter: results.letter,
    answers: { ...myAnswers },
    tags: myTags,
    points: myPoints,
  });
}

// Enter advances focus to next input instead of submitting the form
(function wireFormKeyboard() {
  const form = document.getElementById('answers-form');
  if (!form) return;
  form.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const target = e.target;
    if (!target || target.tagName !== 'INPUT') return;
    if (state.locked) { e.preventDefault(); return; }
    e.preventDefault();
    const inputs = Array.from(form.querySelectorAll('input:not([disabled])'));
    const i = inputs.indexOf(target);
    if (i === -1) return;
    if (i < inputs.length - 1) {
      inputs[i + 1].focus();
      inputs[i + 1].select();
    } else {
      document.getElementById('done-btn').focus();
    }
  });
})();

function readFormAnswers() {
  const form = $('answers-form');
  const out = {};
  for (const cat of state.categories.map(c => c.id)) {
    const input = form.querySelector(`input[name="${cat}"]`);
    out[cat] = input ? input.value : '';
  }
  return out;
}

$('answers-form').addEventListener('submit', e => {
  e.preventDefault();
  if (state.locked) return;
  const answers = readFormAnswers();
  submitAnswers(answers, true);
});

function submitAnswers(answers, amIFirstCandidate) {
  if (state.submittedIds.has(state.myId)) return;
  state.locked = true;
  lockHostInputs(null); // grey out inputs immediately

  if (state.isHost) {
    recordSubmission(state.myId, answers);
  } else {
    if (state.hostConn && state.hostConn.open) {
      state.hostConn.send({ type: 'submit', answers });
    }
    $('finish-status').textContent = amIFirstCandidate ? t('you_done') : t('submitted_wait');
  }
  $('done-btn').disabled = true;
  $('done-btn').textContent = t('submitted');
}

function lockInputsAndSubmit(finisherName) {
  if (state.submittedIds.has(state.myId)) return;
  if (finisherName) {
    const el = $('finish-status');
    el.textContent = t('finished_first_lock', { name: finisherName });
    el.classList.add('urgent');
  }
  const answers = readFormAnswers();
  submitAnswers(answers, false);
}

function lockHostInputs(finisherName) {
  const form = $('answers-form');
  for (const input of form.querySelectorAll('input')) input.disabled = true;
  const row = $('current-row');
  if (row) row.classList.add('sealed');
  if (finisherName) {
    const el = $('finish-status');
    el.textContent = t('finished_first', { name: finisherName });
    el.classList.add('urgent');
  }
}

// ============================================================
// Results screen
// ============================================================
function showResults(data) {
  showScreen('results-screen');
  $('results-letter').textContent = data.letter;

  const head = $('results-head');
  const body = $('results-body');
  head.innerHTML = '';
  body.innerHTML = '';

  // header: Player | categories...
  const thPlayer = document.createElement('th');
  thPlayer.textContent = t('player_col');
  head.appendChild(thPlayer);
  for (const cat of state.categories) {
    const th = document.createElement('th');
    th.textContent = cat.label;
    head.appendChild(th);
  }
  const thPts = document.createElement('th');
  thPts.textContent = t('pts_header');
  head.appendChild(thPts);

  // rows
  for (const p of data.players) {
    const tr = document.createElement('tr');
    const tdName = document.createElement('td');
    tdName.textContent = p.name + (p.id === data.firstFinisherId ? ' ⚡' : '');
    tdName.style.fontWeight = '700';
    tr.appendChild(tdName);

    const ans = data.answers[p.id] || {};
    const cats = data.byCategory || {};
    for (const cat of state.categories.map(c => c.id)) {
      const td = document.createElement('td');
      const raw = (ans[cat] || '').trim();
      const tag = cats[cat] ? cats[cat][p.id] : 'blank';
      if (tag === 'blank' || !raw) {
        td.textContent = '—';
        td.className = 'ans-blank';
      } else if (tag === 'bad') {
        td.textContent = raw;
        td.className = 'ans-bad';
        td.title = 'Doesn\'t start with ' + data.letter;
      } else if (tag === 'dup') {
        td.textContent = raw + ' (5)';
        td.className = 'ans-dup';
      } else {
        td.textContent = raw + ' (10)';
        td.className = 'ans-unique';
      }
      tr.appendChild(td);
    }
    const tdPts = document.createElement('td');
    tdPts.appendChild(buildPtsCell(data, p.id));
    tr.appendChild(tdPts);

    body.appendChild(tr);
  }

  // scoreboard
  const sb = $('scoreboard');
  sb.innerHTML = '';
  const sorted = [...data.players].sort((a, b) => b.score - a.score);
  for (const p of sorted) {
    const li = document.createElement('li');
    const name = document.createElement('span'); name.className = 'name'; name.textContent = p.name;
    const pts = document.createElement('span'); pts.className = 'points'; pts.textContent = p.score + ' pts';
    const delta = document.createElement('span'); delta.className = 'delta';
    const gain = data.scores[p.id] || 0;
    if (gain > 0) delta.textContent = '+' + gain;
    li.appendChild(name);
    li.appendChild(pts);
    li.appendChild(delta);
    sb.appendChild(li);
  }

  // button visibility
  if (state.isHost) {
    $('next-round-btn').style.display = '';
    $('end-game-btn').style.display = '';
    setStatus('results-status', '', false);
  } else {
    $('next-round-btn').style.display = 'none';
    $('end-game-btn').style.display = 'none';
    setStatus('results-status', t('waiting_host_end'), false);
  }
}

// ============================================================
// Final screen
// ============================================================
function buildPtsCell(data, pid) {
  const pts = data.scores[pid] || 0;
  const wrap = document.createElement('div');
  wrap.className = 'pts-editor';

  if (state.isHost) {
    const minus = document.createElement('button');
    minus.type = 'button';
    minus.className = 'pts-btn';
    minus.textContent = '−5';
    minus.addEventListener('click', () => adjustScore(pid, -5));

    const val = document.createElement('span');
    val.className = 'pts-value';
    val.textContent = (pts >= 0 ? '+' : '') + pts;

    const plus = document.createElement('button');
    plus.type = 'button';
    plus.className = 'pts-btn';
    plus.textContent = '+5';
    plus.addEventListener('click', () => adjustScore(pid, 5));

    wrap.appendChild(minus);
    wrap.appendChild(val);
    wrap.appendChild(plus);
  } else {
    const val = document.createElement('span');
    val.className = 'pts-value';
    val.textContent = (pts >= 0 ? '+' : '') + pts;
    wrap.appendChild(val);
  }
  return wrap;
}

function adjustScore(playerId, delta) {
  if (!state.isHost || !state.lastResults) return;

  state.lastResults.scores[playerId] = (state.lastResults.scores[playerId] || 0) + delta;

  const player = state.players.find(p => p.id === playerId);
  if (player) player.score += delta;

  state.lastResults.players = state.players.map(p => ({ id: p.id, name: p.name, score: p.score }));

  // Keep the player's own history row in sync if it's the latest round
  if (playerId === state.myId) {
    const last = state.myHistory[state.myHistory.length - 1];
    if (last && last.letter === state.lastResults.letter) {
      last.points = state.lastResults.scores[state.myId] || 0;
    }
  }

  broadcast({
    type: 'score_update',
    letter: state.lastResults.letter,
    scores: state.lastResults.scores,
    players: state.lastResults.players,
  });

  showResults(state.lastResults);
}

function showFinal(players) {
  showScreen('final-screen');
  const sorted = [...players].sort((a, b) => b.score - a.score);
  const topScore = sorted.length ? sorted[0].score : 0;
  const winners = sorted.filter(p => p.score === topScore);

  const banner = $('winner-banner');
  banner.innerHTML = '';
  const trophy = document.createElement('span'); trophy.className = 'trophy'; trophy.textContent = '🏆';
  banner.appendChild(trophy);
  const text = document.createElement('div');
  if (winners.length === 1) {
    text.textContent = t('wins_with', { name: winners[0].name, score: winners[0].score });
  } else {
    text.textContent = t('tie_at', { names: winners.map(w => w.name).join(' & '), score: topScore });
  }
  banner.appendChild(text);

  const fsb = $('final-scoreboard');
  fsb.innerHTML = '';
  for (const p of sorted) {
    const li = document.createElement('li');
    const name = document.createElement('span'); name.className = 'name'; name.textContent = p.name;
    const pts = document.createElement('span'); pts.className = 'points'; pts.textContent = p.score + ' pts';
    li.appendChild(name);
    li.appendChild(pts);
    fsb.appendChild(li);
  }
}

// ============================================================
// Dynamic sheet + category management
// ============================================================
function renderSheet() {
  const headerRow = $('header-row');
  const currentRow = $('current-row');
  const sheet = $('sheet');
  if (!headerRow || !currentRow || !sheet) return;

  headerRow.querySelectorAll('.col-cat').forEach(e => e.remove());
  currentRow.querySelectorAll('.col-cat').forEach(e => e.remove());

  const headerPts = headerRow.querySelector('.col-pts');
  const currentPts = currentRow.querySelector('.col-pts');

  for (const cat of state.categories) {
    const h = document.createElement('div');
    h.className = 'col-cat';
    h.textContent = cat.label;
    headerRow.insertBefore(h, headerPts);

    const lbl = document.createElement('label');
    lbl.className = 'col-cat cell';
    const labelSpan = document.createElement('span');
    labelSpan.className = 'cell-label';
    labelSpan.textContent = cat.label;
    lbl.appendChild(labelSpan);
    const input = document.createElement('input');
    input.name = cat.id;
    input.autocomplete = 'off';
    input.spellcheck = false;
    lbl.appendChild(input);
    currentRow.insertBefore(lbl, currentPts);
  }

  sheet.style.setProperty('--cat-count', state.categories.length);
}

function renderCategories() {
  const chips = $('category-chips');
  if (!chips) return;
  chips.innerHTML = '';
  for (const cat of state.categories) {
    const chip = document.createElement('div');
    chip.className = 'cat-chip';
    const span = document.createElement('span');
    span.textContent = cat.label;
    chip.appendChild(span);
    if (state.isHost) {
      const rm = document.createElement('button');
      rm.type = 'button';
      rm.className = 'remove';
      rm.textContent = '×';
      rm.title = 'Remove';
      rm.addEventListener('click', () => removeCategory(cat.id));
      chip.appendChild(rm);
    }
    chips.appendChild(chip);
  }
  const addRow = $('category-add-row');
  const hint = $('category-hint');
  if (addRow) addRow.style.display = state.isHost ? 'flex' : 'none';
  if (hint) hint.style.display = state.isHost ? 'none' : 'block';
}

function slugify(s) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'cat';
}
function uniqueCategoryId(label) {
  const base = slugify(label);
  let id = base, i = 2;
  while (state.categories.some(c => c.id === id)) id = base + '-' + (i++);
  return id;
}

function addCategory(label) {
  if (!state.isHost) return;
  if (state.gameActive || state.myHistory.length > 0) return;
  label = (label || '').trim().slice(0, 20);
  if (!label) return;
  if (state.categories.some(c => c.label.toLowerCase() === label.toLowerCase())) return;
  if (state.categories.length >= 12) return;
  state.categories.push({ id: uniqueCategoryId(label), label });
  renderCategories();
  broadcastCategories();
}

function removeCategory(id) {
  if (!state.isHost) return;
  if (state.gameActive || state.myHistory.length > 0) return;
  if (state.categories.length <= 1) return;
  state.categories = state.categories.filter(c => c.id !== id);
  renderCategories();
  broadcastCategories();
}

function broadcastCategories() {
  if (!state.isHost) return;
  broadcast({
    type: 'categories_update',
    categories: state.categories.map(c => ({ id: c.id, label: c.label })),
  });
}

// Translation helpers
function t(key, params) {
  const dict = TRANSLATIONS[state.language] || TRANSLATIONS.en;
  let s = dict[key];
  if (s === undefined) s = TRANSLATIONS.en[key];
  if (s === undefined) return key;
  if (params) s = s.replace(/\{(\w+)\}/g, (_, k) => (params[k] !== undefined ? params[k] : ''));
  return s;
}

function applyLanguage() {
  document.documentElement.setAttribute('lang', state.language);
  document.documentElement.setAttribute('data-lang', state.language);
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    el.innerHTML = t(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });
  renderLobby();
  renderCategories();
}

// Swap DEFAULT category labels for the new language if the host hasn't customized them
function maybeSwapDefaultCategories(oldLang) {
  if (state.gameActive || state.myHistory.length > 0) return;
  const oldDefaults = DEFAULT_CATEGORIES_BY_LANG[oldLang] || [];
  const matchesOld = state.categories.length === oldDefaults.length &&
    state.categories.every((c, i) => c.id === oldDefaults[i].id && c.label === oldDefaults[i].label);
  if (matchesOld) {
    state.categories = cloneCategoriesFor(state.language);
    if (state.isHost) broadcastCategories();
  }
}

// Language toggle (EN/AR). In a party, only the host can change it, and
// it becomes locked once the first round begins.
(function wireLangToggle() {
  const btn = document.getElementById('lang-toggle');
  if (!btn) return;
  const KEY = 'letterparty-lang';
  applyLanguage();
  updateLangToggleLocked();
  btn.addEventListener('click', () => {
    if (isLangLocked()) return;
    const oldLang = state.language;
    state.language = state.language === 'ar' ? 'en' : 'ar';
    // Persist only as a home-screen preference; in a party the party's choice is authoritative
    if (!state.roomCode) {
      try { localStorage.setItem(KEY, state.language); } catch {}
    }
    maybeSwapDefaultCategories(oldLang);
    applyLanguage();
    if (state.isHost) broadcastLanguage();
  });
})();

function isLangLocked() {
  const gameStarted = state.round > 0 || state.myHistory.length > 0;
  const guestInParty = !!state.roomCode && !state.isHost;
  return gameStarted || guestInParty;
}

function updateLangToggleLocked() {
  const btn = document.getElementById('lang-toggle');
  if (!btn) return;
  const locked = isLangLocked();
  btn.disabled = locked;
  btn.classList.toggle('locked', locked);
  btn.title = locked
    ? (state.round > 0 || state.myHistory.length > 0
        ? 'Locked once the game has started'
        : 'Only the host can change the language')
    : 'English / العربية';
}

function broadcastLanguage() {
  if (!state.isHost) return;
  broadcast({ type: 'language_update', language: state.language });
}

// Theme toggle (light/dark) with localStorage persistence
(function wireThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  const KEY = 'letterparty-theme';
  const saved = (() => { try { return localStorage.getItem(KEY); } catch { return null; } })();
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  const initial = saved || (prefersLight ? 'light' : 'dark');
  applyTheme(initial);
  btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next);
    try { localStorage.setItem(KEY, next); } catch {}
  });
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }
})();

// Wire add-category UI
(function wireCategoryControls() {
  const btn = document.getElementById('add-category-btn');
  const input = document.getElementById('new-category-input');
  if (!btn || !input) return;
  btn.addEventListener('click', () => {
    addCategory(input.value);
    input.value = '';
    input.focus();
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCategory(input.value);
      input.value = '';
      input.focus();
    }
  });
})();

// ============================================================
// Full reset (back to home)
// ============================================================
function fullReset() {
  try { if (state.peer) state.peer.destroy(); } catch {}
  state.peer = null;
  state.isHost = false;
  state.roomCode = '';
  state.myId = '';
  state.myName = '';
  state.hostConn = null;
  state.guestConns = new Map();
  state.players = [];
  state.usedLetters = [];
  state.currentLetter = '';
  state.round = 0;
  state.roundAnswers = {};
  state.firstFinisherId = null;
  state.submittedIds = new Set();
  state.gameActive = false;
  state.locked = false;
  state.lastResults = null;
  state.myHistory = [];
  state.categories = cloneCategories();

  $('player-name').value = '';
  $('room-code-input').value = '';
  $('start-game-btn').style.display = '';
  setStatus('home-status', '', false);
  showScreen('home-screen');
  updateLangToggleLocked();
}
