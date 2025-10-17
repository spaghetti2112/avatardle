// === Avatar Character Game — Progressive SHOW Hints (no letter clues), Multi-Guess per Day ===

// --- BOOT BEACON:  app.js ---
// (Debug helper so you can see when/if this file actually loads)
(function(){
  const stamp = new Date().toISOString();
  console.log("[Avatardle] app.js loaded at", stamp);
  const beacon = document.createElement("div");
  beacon.style.cssText = "position:fixed;right:12px;bottom:12px;background:#111827;color:#fff;padding:8px 10px;border-radius:8px;z-index:9999;font:12px/1.3 system-ui";
  beacon.textContent = "app.js loaded • " + stamp;
  document.body.appendChild(beacon);
})();

// --- BOOT GUARD ---
// Prevents double-initialization if app.js is included twice accidentally.
if (window.__AVATARDLE_BOOTED__) {
  console.warn("[Avatardle] app already booted — skipping second init");
} else {
  window.__AVATARDLE_BOOTED__ = true;

  (() => {
    // ---------- helpers ----------
    // Shorthand to get elements by id
    const $ = (id) => document.getElementById(id);

    // Normalizes a string for comparison: strips diacritics, trims, lowercases
    // (Avoids unsupported /\p{Diacritic}/ — uses a safe Unicode range.)
    const byName = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();

    // Creates a URL slug from a name (for image filename guesses)
    const slug = (s) => byName(s).replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');

    // Returns YYYY-MM-DD string for “daily” logic
    const todayKey = () => {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    };

    // Deterministic hash→index function so the same date picks the same character
    const seededIndex = (seed, mod) => {
      let h = 2166136261 >>> 0; // FNV-1a seed
      for (let i=0;i<seed.length;i++){ h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
      return h % Math.max(1, mod);
    };

    // Compute a base path that also works on GitHub Pages (/username/avatardle/)
    const repoBase = (() => {
      const parts = location.pathname.split('/').filter(Boolean);
      return (parts.length >= 2) ? `/${parts[0]}/${parts[1]}/` : '/';
    })();

// Attempts multiple image paths/casings/extensions; PRIORITIZES exact original name first.
// This will load "Images/Prince Wu.jpg" even if your character name is "Prince Wu".
function loadPortrait(imgEl, name, characterObj) {
  if (!imgEl || !name) return;

  // ---- Build base variants ----
  const orig    = name;                         // "Prince Wu"
  const encOrig = encodeURIComponent(orig);     // "Prince%20Wu"
  const noSp    = orig.replace(/\s+/g, '');     // "PrinceWu"
  const dash    = orig.replace(/\s+/g, '-');    // "Prince-Wu"
  const lower   = orig.toLowerCase();
  const upper   = orig.toUpperCase();

  // Your existing slug function:
  const s       = slug(orig);                   // "prince-wu"
  const sUpper  = s.toUpperCase();

  // Folders to try
  const folders = [
    'Images','images',              // exact originals FIRST
    './Images','./images'
  ];
  // If you have repoBase for GitHub Pages:
  if (typeof repoBase === 'string') {
    const base = repoBase.replace(/\/+$/,'');
    folders.push(`${base}/Images`, `${base}/images`);
  }

  // Extensions to try (put JPG first to match your sample)
  const exts = ['jpg','jpeg','png','webp','svg','JPG','JPEG','PNG','WEBP','SVG'];

  // 1) Allow explicit mapping (optional per-character)
  const explicit = [];
  if (characterObj?.image) {
    if (Array.isArray(characterObj.image)) explicit.push(...characterObj.image);
    else explicit.push(characterObj.image);
  }
  if (characterObj?.images && Array.isArray(characterObj.images)) {
    explicit.push(...characterObj.images);
  }
  const explicitCandidates = explicit.filter(Boolean);

  // 2) PRIORITIZE exact original name (with spaces & encoding) before any slug guesses
  const exactNames = [orig, encOrig, noSp, dash, lower, upper, s, sUpper];

  // Build candidates in strong priority order:
  const candidates = [];

  // a) Explicit first
  candidates.push(...explicitCandidates);

  // b) Exact original (Images/ + images/), both encoded and raw
  for (const f of folders) {
    for (const base of [orig, encOrig]) {
      for (const e of exts) {
        candidates.push(`${f}/${base}.${e}`);
        // absolute-path variant helps some servers
        candidates.push(`/${f.replace(/^\.\//,'')}/${base}.${e}`);
      }
    }
  }

  // c) Other close variants (no spaces, dashes, lower/upper, slugs)
  for (const f of folders) {
    for (const base of [noSp, dash, lower, upper, s, sUpper]) {
      for (const e of exts) {
        candidates.push(`${f}/${base}.${e}`);
        candidates.push(`/${f.replace(/^\.\//,'')}/${base}.${e}`);
      }
    }
  }

  // Debug: show first 20 candidates
  console.log('[Avatardle] Trying portrait candidates for', name, candidates.slice(0,20), `... (+${Math.max(0,candidates.length-20)} more)`);

  const fallbackSvg = `data:image/svg+xml;utf8,${encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'><rect width='256' height='256' fill='#3b4263'/><text x='50%' y='50%' font-size='20' text-anchor='middle' fill='#fff' dy='.3em'>No Image</text></svg>"
  )}`;

  (function tryNext(i=0){
    if (i >= candidates.length) {
      console.warn('[Avatardle] No portrait found for', name, '→ fallback');
      imgEl.src = fallbackSvg;
      return;
    }
    const url = candidates[i];
    const test = new Image();
    test.onload  = () => { console.log('[Avatardle] Loaded portrait:', url); imgEl.src = url; };
    test.onerror = () => { if (i < 10) console.log('[Avatardle] Missed:', url); tryNext(i+1); };
    test.src = url;
  })();
}





    // Pretty label for series code
    function seriesLabel(a){ return a==='LoK' ? 'The Legend of Korra' : 'Avatar: The Last Airbender'; }

    // Derive a broad affiliation/region hint from origin/bending/type
    function inferAffiliation(origin,bending,type){
      const o=(origin||'').toLowerCase();
      if(type==='Spirit'||o.includes('spirit')) return 'Spirit World';
      if(o.includes('air')) return 'Air Nomads';
      if(o.includes('water')) return 'Water Tribe';
      if(o.includes('fire')) return 'Fire Nation';
      if(o.includes('ba sing se')||o.includes('omashu')||o.includes('earth kingdom')) return 'Earth Kingdom';
      if(o.includes('zaofu')) return 'Zaofu (Earth Kingdom)';
      if(o.includes('republic city')) return 'Republic City';
      return origin||'Unknown';
    }

    // Simplifies bending text into a concise label
    function simplifyBending(b){
      const x=(b||'').toLowerCase();
      if(x.includes('blood')) return 'Bloodbender';
      if(x.includes('lava'))  return 'Lavabender';
      if(x.includes('metal')) return 'Metalbender';
      if(x.includes('combustion')) return 'Combustionbender';
      if(x.includes('air'))   return 'Airbender';
      if(x.includes('water')) return 'Waterbender';
      if(x.includes('earth')) return 'Earthbender';
      if(x.includes('fire'))  return 'Firebender';
      if(x.includes('non-bender')) return 'Non-bender';
      return b||'Unknown';
    }

    // ---------- boot once DOM is ready ----------
    document.addEventListener('DOMContentLoaded', () => {
      // Cache DOM refs
      const portrait = $('portrait');
      const chipType = $('chip-type');
      const chipAppearance = $('chip-appearance');
      const bendingEl = $('bending');
      const originEl = $('origin');
      const feedback = $('feedback');
      const input = $('guess-input');
      const submitBtn = $('submit-guess');
      const suggestions = $('suggestions');
      const hintsList = $('hints-list');

      // daily pick (hardened)
const STORAGE_KEY = 'avatarGame:'+todayKey();

// ensure we really have a list
const total = Array.isArray(characters) ? characters.length : 0;
console.log('[Avatardle] total characters (DOM):', total);

if (total === 0) {
  feedback && (feedback.textContent = 'No character available today (no characters loaded).');
  return;
}

// compute index safely
let idx = seededIndex(todayKey(), total);
if (!Number.isFinite(idx) || idx < 0 || idx >= total) {
  idx = Math.abs(idx) % total; // clamp just in case
}

const answer = characters[idx];
console.log('[Avatardle] picked index:', idx, 'name:', answer && answer.name);

if (!answer) {
  feedback && (feedback.textContent = `No character available today (failed to pick; idx=${idx}, total=${total})`);
  return;
}


      // Seed top UI chips and portrait (hide specific values until solved)
      chipType && (chipType.textContent = `Type: ${answer.type}`);
      chipAppearance && (chipAppearance.textContent = `Series: ${seriesLabel(answer.appearance)}`);
      bendingEl && (bendingEl.textContent = '???');
      originEl && (originEl.textContent = '???');
      loadPortrait(portrait, answer.name, answer);

      // Build show-centric hints (no letter/length hints)
      const allHints = [
        { text:`Appears in: ${seriesLabel(answer.appearance)}` },
        { text:`Affiliation/Region: ${inferAffiliation(answer.origin, answer.bending, answer.type)}` },
        { text:`Bending/Skill: ${simplifyBending(answer.bending)}` },
        { text:`Type: ${answer.type==='Animal'?'Animal/Companion':answer.type}` },
      ];

      // Incognito-safe storage wrapper
      const storage = (()=>{ try{ const k='__t__'; localStorage.setItem(k,'1'); localStorage.removeItem(k); return localStorage; }catch{ return {getItem(){return null}, setItem(){}, removeItem(){}} } })();

      // Load/save per-day state (attempts, solved, unlocked hint count)
      function loadState(){
        try{
          const raw=storage.getItem(STORAGE_KEY);
          if(!raw) return {attempts:[],solved:false,answerName:answer.name,unlocked:0};
          const s=JSON.parse(raw);
          if(s.answerName!==answer.name) return {attempts:[],solved:false,answerName:answer.name,unlocked:0};
          return s;
        }catch{ return {attempts:[],solved:false,answerName:answer.name,unlocked:0}; }
      }
      function saveState(s){ try{ storage.setItem(STORAGE_KEY, JSON.stringify(s)); }catch{} }

      let state = loadState();

      // Renders visible vs locked hints and reveals bending/origin when solved
      function renderHints(){
        if(!hintsList) return;
        hintsList.innerHTML='';
        allHints.forEach((h,idx)=>{
          const li=document.createElement('li');
          if(idx<state.unlocked||state.solved){ li.textContent=h.text; }
          else{ li.classList.add('locked'); li.textContent=`Locked hint #${idx+1} — make another guess to unlock.`; }
          hintsList.appendChild(li);
        });
        if(state.solved){
          bendingEl && (bendingEl.textContent=answer.bending);
          originEl && (originEl.textContent=answer.origin);
        }
      }
      renderHints();

      // Autocomplete suggestions for names
      const names=characters.map(c=>c.name);
      function updateSuggestions(q){
        if(!suggestions) return;
        const norm=byName(q||''); 
        const picks=names.filter(n=>byName(n).includes(norm)).slice(0,8);
        suggestions.innerHTML='';
        picks.forEach(n=>{
          const b=document.createElement('button'); 
          b.textContent=n; 
          b.addEventListener('click',()=>{ input.value=n; input.focus(); }); 
          suggestions.appendChild(b);
        });
      }
      input && input.addEventListener('input', e=>updateSuggestions(e.target.value));
      updateSuggestions('');

      // Initial feedback line
      if (feedback) {
        feedback.textContent = state.solved
          ? `Solved in ${state.attempts.length} ${state.attempts.length===1?'guess':'guesses'}!`
          : (state.attempts.length ? `Attempts today: ${state.attempts.length}` : '');
      }

      // Main guess handler (unlocks 1 hint per wrong guess)
      function tryGuess(){
        if(state.solved){ feedback && (feedback.textContent='Already solved today — come back tomorrow!'); return; }
        const guess=input?.value.trim(); 
        if(!guess){ feedback && (feedback.textContent='Type a name to guess.'); return; }
        if(state.attempts.some(g=>byName(g)===byName(guess))){ 
          feedback && (feedback.textContent='You already tried that name today.'); 
          input.value=''; 
          return; 
        }
        state.attempts.push(guess);
        const ok = byName(guess)===byName(answer.name);
        if(ok){
          state.solved=true;
          feedback && (feedback.textContent=`Correct! It was ${answer.name}.`);
          input && (input.disabled=true);
          const submitBtn = $('submit-guess');
          submitBtn && (submitBtn.disabled=true);
          bendingEl && (bendingEl.textContent=answer.bending);
          originEl && (originEl.textContent=answer.origin);
        } else {
          state.unlocked=Math.min(allHints.length, state.unlocked+1);
          feedback && (feedback.textContent=`Not ${guess}. Hint #${state.unlocked} unlocked.`);
        }
        saveState(state);
        renderHints();
        if(input){ input.value=''; updateSuggestions(''); }
      }

      // Wire up events
      
      submitBtn && submitBtn.addEventListener('click', tryGuess);
      input && input.addEventListener('keydown', e=>{ if(e.key==='Enter') tryGuess(); });
    });
  })();
}


