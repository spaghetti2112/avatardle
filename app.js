// === Avatardle — Robust, Incognito-safe, GH Pages-safe ===
document.addEventListener('DOMContentLoaded', () => {
  // ---------- tiny UI error/warn banner ----------
  function banner(msg, tone='warn'){
    const box = document.createElement('div');
    box.style.cssText = `
      position:fixed; left:12px; bottom:12px; z-index:9999;
      max-width:70ch; background:${tone==='error'?'#7f1d1df0':'#111827f0'};
      color:#e5e7eb; border:1px solid #374151; border-radius:10px;
      padding:10px; font:12px/1.4 system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial`;
    box.textContent = msg;
    document.body.appendChild(box);
    setTimeout(()=>box.remove(), 8000);
  }

  // ---------- safe localStorage wrapper (private mode/extensions) ----------
  const storage = (() => {
    try {
      const k = '__test__';
      localStorage.setItem(k, '1'); localStorage.removeItem(k);
      return localStorage;
    } catch { return { getItem(){return null;}, setItem(){}, removeItem(){} }; }
  })();

  // ---------- DOM ----------
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

  // ---------- utils ----------
  const byName = s => s.normalize('NFD').replace(/\p{Diacritic}/gu,'').trim().toLowerCase();
  const slug   = s => byName(s).replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  const todayKey = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  };
  function seededIndex(seed, mod){
    let h = 2166136261 >>> 0;
    for (let i=0;i<seed.length;i++){ h ^= seed.charCodeAt(i); h = Math.imul(h,16777619); }
    return h % Math.max(1, mod);
  }

  // ---------- data: prefer characters.js, else built-in fallback so site still works ----------
  const FALLBACK_CHARACTERS = [
    { name:"Aang",   bending:"Airbender/Avatar", origin:"Southern Air Temple", appearance:"ATLA", type:"Avatar" },
    { name:"Katara", bending:"Waterbender",      origin:"Southern Water Tribe", appearance:"ATLA", type:"Human" },
    { name:"Zuko",   bending:"Firebender",       origin:"Fire Nation",          appearance:"ATLA", type:"Human" },
    { name:"Korra",  bending:"Waterbender/Avatar", origin:"Southern Water Tribe", appearance:"LoK", type:"Avatar" },
  ];
  const fromFile = (window.characters && Array.isArray(window.characters)) ? window.characters : null;
  const characters = fromFile || FALLBACK_CHARACTERS;
  if (!fromFile) {
    banner('characters.js did not load; using a small fallback list. Ensure the file is named exactly characters.js and loaded before app.js.', 'warn');
  }

  // ---------- pick daily ----------
  const STORAGE_KEY = 'avatarGame:' + todayKey();
  const dailyIdx = seededIndex(todayKey(), characters.length);
  const answer = characters[dailyIdx];

  // ---------- fallback art ----------
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

  // ---------- robust image loader (handles GH Pages /repo-name/ and case variants) ----------
  function loadPortrait(c){
    if (!portrait) return;
    const base = `images/${slug(c.name)}`;
    const candidates = [
      `${base}.svg`, `${base}.SVG`,
      `${base}.png`, `${base}.PNG`,
      `${base}.jpg`, `${base}.JPG`, `${base}.jpeg`, `${base}.JPEG`,
    ].map(p => new URL(p, window.location.href).href);

    (function tryNext(i=0){
      if (i >= candidates.length){ portrait.src = fallbackSvg; return; }
      const test = new Image();
      test.onload  = () => { portrait.src = test.src; };
      test.onerror = () => tryNext(i+1);
      test.src = candidates[i];
    })();
  }

  // ---------- initial UI ----------
  if (answer){
    chipType.textContent = `Type: ${answer.type}`;
    chipAppearance.textContent = `Series: ${answer.appearance}`;
    bendingEl.textContent = '???';
    originEl.textContent = '???';
    loadPortrait(answer);
  } else {
    banner('No character available.', 'error');
  }

  // ---------- state ----------
  function loadState(){
    try{
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) return { attempts: [], solved:false, answerName:answer?.name||'', unlocked:0 };
      const s = JSON.parse(raw);
      if (!answer || s.answerName !== answer.name) return { attempts: [], solved:false, answerName:answer?.name||'', unlocked:0 };
      return s;
    }catch{
      return { attempts: [], solved:false, answerName:answer?.name||'', unlocked:0 };
    }
  }
  function saveState(s){ try{ storage.setItem(STORAGE_KEY, JSON.stringify(s)); }catch{} }
  let state = loadState();

  // ---------- show-centric hints ----------
  const seriesLabel = a => a === 'LoK' ? 'The Legend of Korra' : 'Avatar: The Last Airbender';
  function inferAffiliation(origin, bending, type){
    const o = (origin||'').toLowerCase();
    if (type==='Spirit' || o.includes('spirit')) return 'Spirit World';
    if (o.includes('air')) return 'Air Nomads';
    if (o.includes('water')) return 'Water Tribe';
    if (o.includes('fire')) return 'Fire Nation';
    if (o.includes('ba sing se') || o.includes('omashu') || o.includes('earth kingdom')) return 'Earth Kingdom';
    if (o.includes('zaofu')) return 'Zaofu (Earth Kingdom)';
    if (o.includes('republic city')) return 'Republic City';
    return origin || 'Unknown';
  }
  function simplifyBending(b){
    const x = (b||'').toLowerCase();
    if (x.includes('blood')) return 'Bloodbender';
    if (x.includes('lava')) return 'Lavabender';
    if (x.includes('metal')) return 'Metalbender';
    if (x.includes('combustion')) return 'Combustionbender';
    if (x.includes('air')) return 'Airbender';
    if (x.includes('water')) return 'Waterbender';
    if (x.includes('earth')) return 'Earthbender';
    if (x.includes('fire')) return 'Firebender';
    if (x.includes('non-bender')) return 'Non-bender';
    return b || 'Unknown';
  }
  const allHints = answer ? [
    { text: `Appears in: ${seriesLabel(answer.appearance)}` },
    { text: `Affiliation/Region: ${inferAffiliation(answer.origin, answer.bending, answer.type)}` },
    { text: `Bending/Skill: ${simplifyBending(answer.bending)}` },
    { text: `Type: ${answer.type === 'Animal' ? 'Animal/Companion' : answer.type}` }
  ] : [];

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
      originEl.textContent  = answer.origin;
      portrait.classList.add('reveal');
    } else {
      bendingEl.textContent = '???';
      originEl.textContent  = '???';
      portrait.classList.remove('reveal');
    }
  }

  // ---------- suggestions ----------
  const names = characters.map(c => c.name);
  function updateSuggestions(q){
    const normQ = byName(q||'');
    const picks = names.filter(n => byName(n).includes(normQ)).slice(0,8);
    suggestions.innerHTML = '';
    picks.forEach(n => {
      const b = document.createElement('button');
      b.textContent = n;
      b.addEventListener('click', ()=>{ input.value = n; input.focus(); });
      suggestions.appendChild(b);
    });
  }
  input.addEventListener('input', e => updateSuggestions(e.target.value));
  updateSuggestions('');

  // ---------- first paint ----------
  renderHints();
  feedback.textContent = state.solved
    ? `Solved in ${state.attempts.length} ${state.attempts.length===1?'guess':'guesses'}!`
    : (state.attempts.length ? `Attempts today: ${state.attempts.length}` : '');

  // ---------- guess flow ----------
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
      submitBtn.disabled = true;
      input.disabled = true;
    } else {
      state.unlocked = Math.min(allHints.length, state.unlocked + 1);
      feedback.textContent = `Not ${guess}. Hint #${state.unlocked} unlocked.`;
    }

    saveState(state);
    renderHints();
    input.value = '';
    updateSuggestions('');
  }

  submitBtn.addEventListener('click', tryGuess);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') tryGuess(); });
});

