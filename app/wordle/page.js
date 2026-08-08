'use client';

import { useMemo, useState } from 'react';
import PageIntro from '@/components/PageIntro';
import PhonemeKeyboard from '@/components/PhonemeKeyboard';
import { PHONEME_HINTS, PHONEME_ROWS } from '@/lib/phonemes';
import { DEFAULT_WORDLE, WORD_CORPUS } from '@/lib/wordCorpus';
import { downloadHtml } from '@/lib/download';

function evaluateGuess(guess, target) {
  const result = Array(target.length).fill('absent');
  const remaining = {};
  target.forEach((p, i) => {
    if (guess[i] === p) result[i] = 'correct';
    else remaining[p] = (remaining[p] || 0) + 1;
  });
  guess.forEach((p, i) => {
    if (result[i] === 'correct') return;
    if (remaining[p] > 0) {
      result[i] = 'present';
      remaining[p] -= 1;
    }
  });
  return result;
}

function makeWordleHtml(target, maxGuesses, showHints) {
  const rows = JSON.stringify(PHONEME_ROWS);
  const hints = JSON.stringify(PHONEME_HINTS);
  const targetData = JSON.stringify(target);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Phoneme Wordle — ${target.word}</title>
<style>
:root{--bg:#f7f8fc;--card:#fff;--text:#172033;--muted:#64748b;--border:#dbe2ea;--brand:#5b47d6;--correct:#17864b;--present:#c88a06;--absent:#677184}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font-family:system-ui,-apple-system,Segoe UI,sans-serif}.wrap{max-width:860px;margin:auto;padding:24px}.card{background:var(--card);border:1px solid var(--border);border-radius:20px;padding:24px;box-shadow:0 10px 35px rgba(15,23,42,.08)}h1{margin:0 0 8px}.sub{color:var(--muted);margin:0 0 22px}.grid{display:grid;gap:8px;margin:20px auto;max-width:430px}.row{display:grid;gap:8px}.cell{aspect-ratio:1;display:flex;align-items:center;justify-content:center;border:2px solid var(--border);border-radius:10px;font-size:1.25rem;font-weight:800}.cell.correct{background:var(--correct);border-color:var(--correct);color:white}.cell.present{background:var(--present);border-color:var(--present);color:white}.cell.absent{background:var(--absent);border-color:var(--absent);color:white}.keyboard{margin-top:24px;display:grid;gap:6px}.krow{display:flex;gap:6px;justify-content:center;flex-wrap:wrap}.key{min-width:52px;border:1px solid var(--border);background:#eef2f7;color:var(--text);border-radius:9px;padding:8px 7px;font:inherit;font-weight:750;cursor:pointer}.key small{display:block;font-size:.57rem;color:var(--muted);font-weight:600;margin-top:2px}.controls{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}.action{border:0;border-radius:10px;padding:11px 18px;font:inherit;font-weight:750;cursor:pointer}.primary{background:var(--brand);color:#fff}.secondary{background:#e8eaf2;color:var(--text)}.message{min-height:28px;text-align:center;font-weight:750;margin:12px 0}.hint{padding:10px 13px;border-radius:10px;background:#f0edff;color:#4338a8;text-align:center}.sr{position:absolute;left:-10000px}@media(max-width:600px){.wrap{padding:12px}.card{padding:16px}.key{min-width:44px}.cell{font-size:1rem}}
</style>
</head>
<body>
<main class="wrap"><section class="card">
<h1>Phoneme Wordle</h1>
<p class="sub">Guess the word using phoneme symbols. Each phoneme occupies one cell.</p>
${showHints ? `<p class="hint">Hover over a phoneme button to see its English-letter hint.</p>` : ''}
<div id="message" class="message" role="status" aria-live="polite"></div>
<div id="grid" class="grid" aria-label="Wordle guess grid"></div>
<div class="controls"><button id="enter" class="action primary">Enter guess</button><button id="clear" class="action secondary">Clear row</button></div>
<div id="keyboard" class="keyboard"></div>
</section></main>
<script>
const target=${targetData};const maxGuesses=${maxGuesses};const keyboardRows=${rows};const hints=${hints};
let guesses=[];let current=[];let finished=false;
const grid=document.getElementById('grid'),message=document.getElementById('message'),keyboard=document.getElementById('keyboard');
function evaluate(guess){const result=Array(target.phonemes.length).fill('absent'),remaining={};target.phonemes.forEach((p,i)=>{if(guess[i]===p)result[i]='correct';else remaining[p]=(remaining[p]||0)+1});guess.forEach((p,i)=>{if(result[i]==='correct')return;if((remaining[p]||0)>0){result[i]='present';remaining[p]--}});return result}
function render(){grid.innerHTML='';grid.style.gridTemplateRows='repeat('+maxGuesses+',auto)';for(let r=0;r<maxGuesses;r++){const row=document.createElement('div');row.className='row';row.style.gridTemplateColumns='repeat('+target.phonemes.length+',1fr)';const data=r<guesses.length?guesses[r]:r===guesses.length?current:[];const evals=r<guesses.length?evaluate(guesses[r]):[];for(let c=0;c<target.phonemes.length;c++){const cell=document.createElement('div');cell.className='cell'+(evals[c]?' '+evals[c]:'');cell.textContent=data[c]||'';row.appendChild(cell)}grid.appendChild(row)}}
keyboardRows.forEach(rowData=>{const row=document.createElement('div');row.className='krow';rowData.forEach(p=>{const b=document.createElement('button');b.className='key';b.type='button';b.title='/'+p+'/ — '+(hints[p]||'phoneme');b.setAttribute('aria-label','Phoneme '+p+'. '+(hints[p]||''));b.innerHTML='<span>/'+p+'/</span>${showHints ? `<small>'+((hints[p]||'').split(' (')[0])+'</small>` : ''}';b.onclick=()=>{if(!finished&&current.length<target.phonemes.length){current.push(p);render()}};row.appendChild(b)});keyboard.appendChild(row)});
document.getElementById('clear').onclick=()=>{if(!finished){current=[];render()}};
document.getElementById('enter').onclick=()=>{if(finished)return;if(current.length!==target.phonemes.length){message.textContent='Enter exactly '+target.phonemes.length+' phonemes.';return}const isCorrect=current.every((p,i)=>p===target.phonemes[i]);guesses.push([...current]);current=[];render();if(isCorrect){finished=true;message.textContent='Correct! The English word is “'+target.word+'”.';}else if(guesses.length>=maxGuesses){finished=true;message.textContent='Finished. The answer was “'+target.word+'” — /'+target.phonemes.join(' ')+'/.';}else{message.textContent='Not quite — try again.'}};
render();
</script>
</body></html>`;
}

export default function WordlePage() {
  const [wordName, setWordName] = useState(DEFAULT_WORDLE.word);
  const [maxGuesses, setMaxGuesses] = useState(6);
  const [showHints, setShowHints] = useState(true);
  const [guesses, setGuesses] = useState([]);
  const [current, setCurrent] = useState([]);
  const [message, setMessage] = useState('');
  const [finished, setFinished] = useState(false);

  const target = useMemo(() => WORD_CORPUS.find(w => w.word === wordName) || DEFAULT_WORDLE, [wordName]);

  const reset = (nextName = wordName) => {
    setWordName(nextName);
    setGuesses([]);
    setCurrent([]);
    setMessage('');
    setFinished(false);
  };

  const press = symbol => {
    if (!finished && current.length < target.phonemes.length) {
      setCurrent(prev => [...prev, symbol]);
      setMessage('');
    }
  };

  const submitGuess = () => {
    if (finished) return;
    if (current.length !== target.phonemes.length) {
      setMessage(`Enter exactly ${target.phonemes.length} phonemes.`);
      return;
    }
    const isCorrect = current.every((p, i) => p === target.phonemes[i]);
    const nextGuesses = [...guesses, current];
    setGuesses(nextGuesses);
    setCurrent([]);
    if (isCorrect) {
      setFinished(true);
      setMessage(`Correct! English word: “${target.word}”.`);
    } else if (nextGuesses.length >= maxGuesses) {
      setFinished(true);
      setMessage(`Finished. The answer was “${target.word}” — /${target.phonemes.join(' ')}/.`);
    } else {
      setMessage('Not quite — try another phoneme sequence.');
    }
  };

  const generate = () => {
    downloadHtml(`phoneme-wordle-${target.word}.html`, makeWordleHtml(target, maxGuesses, showHints));
  };

  return (
    <>
      <PageIntro
        eyebrow="Activity builder · Wordle"
        title="Create a phoneme Wordle"
        description="Choose one HCE-transcribed word, configure the activity, test it in the teacher preview and download a standalone playable HTML file."
      />

      <div className="builder-layout">
        <aside className="builder-panel" aria-label="Wordle builder settings">
          <div className="panel-heading"><span>1</span><div><h2>Configure</h2><p>Select the classroom activity settings.</p></div></div>
          <label className="field-label" htmlFor="target-word">Target word</label>
          <select id="target-word" value={wordName} onChange={e => reset(e.target.value)}>
            {WORD_CORPUS.map(item => <option value={item.word} key={item.word}>{item.word} — /{item.phonemes.join(' ')}/</option>)}
          </select>

          <div className="info-box">
            <span>Teacher target</span>
            <strong>/{target.phonemes.join(' ')}/</strong>
            <small>{target.phonemes.length} phonemes · English: {target.word}</small>
          </div>

          <label className="field-label" htmlFor="guesses">Number of guesses</label>
          <input id="guesses" type="number" min="3" max="8" value={maxGuesses} onChange={e => { setMaxGuesses(Math.max(3, Math.min(8, Number(e.target.value) || 6))); setGuesses([]); setCurrent([]); setFinished(false); setMessage(''); }} />

          <label className="toggle-row">
            <input type="checkbox" checked={showHints} onChange={e => setShowHints(e.target.checked)} />
            <span><strong>Show phoneme hints</strong><small>Displays English-letter equivalents on keyboard buttons and hover.</small></span>
          </label>

          <button type="button" className="button secondary full" onClick={() => reset()}>Reset preview</button>
          <button type="button" className="button primary full" onClick={generate}>Generate & download HTML</button>
        </aside>

        <section className="preview-panel" aria-label="Interactive Wordle preview">
          <div className="panel-heading"><span>2</span><div><h2>Preview</h2><p>Play the activity exactly as a student would.</p></div></div>
          {showHints && <div className="hint-banner">Tip: hover over a phoneme key. For example, <strong>/θ/</strong> shows <strong>TH (as in thin)</strong>.</div>}
          <div className="wordle-grid" style={{ '--word-length': target.phonemes.length }}>
            {Array.from({ length: maxGuesses }, (_, r) => {
              const data = r < guesses.length ? guesses[r] : r === guesses.length ? current : [];
              const evals = r < guesses.length ? evaluateGuess(guesses[r], target.phonemes) : [];
              return (
                <div className="wordle-row" key={r}>
                  {target.phonemes.map((_, c) => <div className={`wordle-cell ${evals[c] || ''}`} key={c}>{data[c] || ''}</div>)}
                </div>
              );
            })}
          </div>
          <p className="game-message" role="status" aria-live="polite">{message || 'Build a guess using the phoneme keyboard.'}</p>
          <div className="button-row center">
            <button type="button" className="button primary" onClick={submitGuess} disabled={finished}>Enter guess</button>
            <button type="button" className="button secondary" onClick={() => setCurrent([])} disabled={finished}>Clear row</button>
          </div>
          <PhonemeKeyboard onPress={press} disabled={finished} compact={!showHints} />
        </section>
      </div>
    </>
  );
}
