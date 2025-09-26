// === Avatar Character Game — Progressive SHOW Hints, Multi-Guess per Day ===

// Utils
const byName = (s) => s.normalize('NFD').replace(/\p{Diacritic}/gu,'').trim().toLowerCase();
const slug = (s) => byName(s).replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');

function seededIndex(dateStr, mod){
  let h = 2166136261 >>> 0;
  for (let i=0; i<dateStr.length; i++){ h ^= dateStr.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h % mod;
}
function todayKey(){
  const d = new Date();
  const y = d.getFullYear(), m = d.getMonth()+1, day = d.getDate();
  return `${y}-${String(m).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
}
const STORAGE_KEY = 'avatarGame:' + todayKey();

// Characters from characters.js
const characters = window.characters || [];
if (!characters.length) {
  alert('Characters failed to load. Make sure characters.js is in the same folder and loaded before app.js.');
}

// Daily answer
const dailyIdx = seededIndex(todayKey(), characters.length || 1);
const answer = characters[dailyIdx];

// DOM
const portrait = document.getElementById('portrait');
const chipType = document.getElementById('chip-type');
const chipAppearance = document.getElementById('chip-appearance');
const bendingEl = document.getElementById('bending');
const originEl = document.getElementById('origin');
const feedback = document.getElementById('feedback');
const input = document.getElementById('guess-input');
const submitBtn = document.getElementById('submit-guess');
const suggestions = document.getElementById('suggestions');
const hintsList = document.getElementById('hints-list');

// Fallback art
const fallbackSvg = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0' stop-color='#7ac4ff'/><stop offset='1' stop-color='#7affc7'/>
    </linearGradient></defs>
    <rect width='256' height='256' fill='url(#g)'/>
    <circle cx='128' cy='96' r='44' fill='rgba(0,0,0,0.2)'/>
    <rect x='48' y='152' width='160' height='56' rx='28' fill='rgba(0,0,0,0.2)'/>
  </svg>
`)}`;

// Try  .jpg then fallback
// replace your loadPortrait() with this one

const byName = (s) => s.normalize('NFD').replace(/\p{Diacritic}/gu,'').trim().toLowerCase();
const slug = (s) => byName(s).replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');

function loadPortrait(c){
  const base = `images/${slug(c.name)}`;
  const candidates = [
    `${base}.svg`, `${base}.SVG`,
    `${base}.png`, `${base}.PNG`,
    `${base}.jpg`, `${base}.JPG`, `${base}.jpeg`, `${base}.JPEG`,
  ];

  (function tryNext(i=0){
    if (i >= candidates.length){
      console.warn('No image found for:', c.name, '— tried:', candidates);
      portrait.src = `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'>
          <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
            <stop offset='0' stop-color='#7ac4ff'/><stop offset='1' stop-color='#7affc7'/>
          </linearGradient></defs>
          <rect width='256' height='256' fill='url(#g)'/>
          <circle cx='128' cy='96' r='44' fill='rgba(0,0,0,0.2)'/>
          <rect x='48' y='152' width='160' height='56' rx='28' fill='rgba(0,0,0,0.2)'/>
        </svg>
      `)}`;
      return;
    }
    const test = new Image();
    test.onload = () => { portrait.src = test.src; };
    test.onerror = () => {
      console.warn('Image not found:', candidates[i]);
      tryNext(i+1);
    };
    test.src = candidates[i];
  })();
}

if (answer) loadPortrait(answer);

// Chips; show series/type; mask inline details until solved
if (answer){
  chipType.textContent = `Type: ${answer.type}`;
  chipAppearance.textContent = `Series: ${answer.appearance}`;
}
bendingEl.textContent = '???';
originEl.textContent = '???';

// ---- Persistent state (multiple guesses per day) ----
function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { attempts: [], solved: false, answerName: answer?.name || '', unlocked: 0 };
    const s = JSON.parse(raw);
    if (!answer || s.answerName !== answer.name) return { attempts: [], solved: false, answerName: answer?.name || '', unlocked: 0 };
    return s;
  }catch{ return { attempts: [], solved: false, answerName: answer?.name || '', unlocked: 0 }; }
}
function saveState(s){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}
let state = loadState();

// ---- Show-centric hints (no letter/gamey info) ----
function inferAffiliation(origin, bending, appearance, type){
  const o = (origin || '').toLowerCase();
  if (type === 'Spirit' || o.includes('spirit')) return 'Spirit World';
  if (o.includes('air')) return 'Air Nomads';
  if (o.includes('water')) return 'Water Tribe';
  if (o.includes('fire')) return 'Fire Nation';
  if (o.includes('ba sing se') || o.includes('omashu') || o.includes('earth kingdom')) return 'Earth Kingdom';
  if (o.includes('zaofu')) return 'Zaofu (Earth Kingdom)';
  if (o.includes('republic city')) return 'Republic City';
  return origin || 'Unknown';
}
function simplifyBending(bending){
  const b = (bending || '').toLowerCase();
  if (b.includes('blood')) return 'Bloodbender';
  if (b.includes('lava')) return 'Lavabender';
  if (b.includes('metal')) return 'Metalbender';
  if (b.includes('combustion')) return 'Combustionbender';
  if (b.includes('air')) return 'Airbender';
  if (b.includes('water')) return 'Waterbender';
  if (b.includes('earth')) return 'Earthbender';
  if (b.includes('fire')) return 'Firebender';
  if (b.includes('non-bender')) return 'Non-bender';
  return bending || 'Unknown';
}
function friendlyType(t){
  if (t === 'Avatar') return 'Avatar';
  if (t === 'Human') return 'Human';
  if (t === 'Spirit') return 'Spirit';
  if (t === 'Animal') return 'Animal/Companion';
  return t || 'Unknown';
}
function seriesLabel(app) { return app === 'LoK' ? 'The Legend of Korra' : 'Avatar: The Last Airbender'; }

function makeHintsFor(c){
  return [
    { text: `Appears in: ${seriesLabel(c.appearance)}`, key: 'series' },
    { text: `Orgin: ${inferAffiliation(c.origin, c.bending, c.appearance, c.type)}`, key: 'affil' },
    { text: `Bending: ${simplifyBending(c.bending)}`, key: 'bend' },
    { text: `Type: ${friendlyType(c.type)}`, key: 'type' }
  ];
}
const allHints = answer ? makeHintsFor(answer) : [];

// Render the hints list based on how many are unlocked
function renderHints(){
  hintsList.innerHTML = '';
  allHints.forEach((h, idx) => {
    const li = document.createElement('li');
    if (idx < state.unlocked || state.solved){
      li.textContent = h.text;
    } else {
      li.classList.add('locked');
      li.textContent = `Locked hint #${idx+1} — make another guess to unlock.`;
    }
    hintsList.appendChild(li);
  });

  if (state.solved){
    bendingEl.textContent = answer.bending;
    originEl.textContent = answer.origin;
    portrait.classList.add('reveal');
  }else{
    bendingEl.textContent = '???';
    originEl.textContent = '???';
    portrait.classList.remove('reveal');
  }
}

// ---- Suggestions ----
const names = characters.map(c => c.name);
function updateSuggestions(q){
  const normQ = byName(q);
  const picks = names.filter(n => byName(n).includes(normQ)).slice(0, 8);
  suggestions.innerHTML = '';
  picks.forEach(n => {
    const b = document.createElement('button');
    b.textContent = n;
    b.addEventListener('click', () => { input.value = n; input.focus(); });
    suggestions.appendChild(b);
  });
}
document.getElementById('guess-input').addEventListener('input', (e)=>updateSuggestions(e.target.value));
updateSuggestions('');

// First paint
renderHints();
feedback.textContent = state.solved
  ? `Solved in ${state.attempts.length} ${state.attempts.length===1?'guess':'guesses'}!`
  : (state.attempts.length ? `Attempts today: ${state.attempts.length}` : '');

// ---- Guess flow (multiple guesses per day until correct) ----
function tryGuess(){
  if (!answer){ feedback.textContent = 'No character today.'; return; }
  if (state.solved){ feedback.textContent = 'Already solved today — come back tomorrow!'; return; }

  const guess = input.value.trim();
  if (!guess){ feedback.textContent = 'Type a name to guess.'; return; }

  const exists = state.attempts.some(g => byName(g) === byName(guess));
  if (exists){ feedback.textContent = 'You already tried that name today.'; input.value=''; return; }

  state.attempts.push(guess);

  const ok = byName(guess) === byName(answer.name);
  if (ok){
    state.solved = true;
    feedback.textContent = `Correct! It was ${answer.name}.`;
  }else{
    state.unlocked = Math.min(allHints.length, state.unlocked + 1);
    feedback.textContent = `Not ${guess}. Hint #${state.unlocked} unlocked.`;
  }

  saveState(state);
  renderHints();

  if (state.solved){
    submitBtn.disabled = true;
    input.disabled = true;
  }else{
    submitBtn.disabled = false;
    input.disabled = false;
  }

  input.value = '';
  updateSuggestions('');
}

submitBtn.addEventListener('click', tryGuess);
input.addEventListener('keydown', (e)=>{ if (e.key === 'Enter') tryGuess(); });

