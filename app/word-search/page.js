'use client';

import { useMemo, useState } from 'react';
import PageIntro from '@/components/PageIntro';
import { DEFAULT_SEARCH_WORDS, WORD_CORPUS } from '@/lib/wordCorpus';
import { buildWordSearch, pathBetween } from '@/lib/wordSearchGenerator';
import { downloadHtml } from '@/lib/download';

function makeWordSearchHtml(selectedWords, size, puzzle) {
  const wordsData = JSON.stringify(selectedWords);
  const gridData = JSON.stringify(puzzle.grid);
  const solutionsData = JSON.stringify(puzzle.solutions);
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Phoneme Word Search</title>
<style>
:root{--bg:#f7f8fc;--card:#fff;--text:#172033;--muted:#64748b;--border:#dbe2ea;--brand:#5b47d6;--highlight:#f7d85b;--found:#37a36b}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font-family:system-ui,-apple-system,Segoe UI,sans-serif}.wrap{max-width:1000px;margin:auto;padding:24px}.card{background:var(--card);border:1px solid var(--border);border-radius:20px;padding:24px;box-shadow:0 10px 35px rgba(15,23,42,.08)}h1{margin:0 0 8px}.sub{margin:0 0 20px;color:var(--muted)}.grid{display:grid;gap:4px;max-width:650px;margin:20px auto;touch-action:none;user-select:none}.cell{aspect-ratio:1;border:1px solid var(--border);border-radius:7px;background:#f8fafc;display:flex;align-items:center;justify-content:center;font-weight:800;cursor:pointer}.cell.highlight{background:var(--highlight)}.cell.found{background:var(--found);color:#fff}.words{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:18px}.word{padding:7px 11px;border-radius:999px;background:#eef2f7;font-weight:700}.word.found{text-decoration:line-through;opacity:.55}.message{text-align:center;min-height:28px;font-weight:700}.controls{display:flex;justify-content:center;margin-top:14px}.btn{border:0;border-radius:10px;background:var(--brand);color:white;padding:11px 16px;font:inherit;font-weight:750;cursor:pointer}@media(max-width:600px){.wrap{padding:12px}.card{padding:14px}.cell{font-size:.8rem}}
</style></head><body><main class="wrap"><section class="card"><h1>Phoneme Word Search</h1><p class="sub">Drag from the first phoneme to the last phoneme of a listed word. Words may run horizontally, vertically or diagonally.</p><div id="message" class="message" role="status" aria-live="polite">Find all ${selectedWords.length} phoneme words.</div><div id="grid" class="grid" aria-label="Phoneme word search grid"></div><div id="words" class="words"></div><div class="controls"><button class="btn" id="answers">Show answers</button></div></section></main>
<script>
const wordData=${wordsData};const matrix=${gridData};const solutions=${solutionsData};const size=${size};let dragging=false,start=null,currentPath=[],showAnswers=false;const found=new Set();const grid=document.getElementById('grid'),words=document.getElementById('words'),msg=document.getElementById('message');grid.style.gridTemplateColumns='repeat('+size+',1fr)';
function id(r,c){return 'c-'+r+'-'+c}function path(a,b){if(!a||!b)return null;const dr=b[0]-a[0],dc=b[1]-a[1];if(!(dr===0||dc===0||Math.abs(dr)===Math.abs(dc)))return null;const steps=Math.max(Math.abs(dr),Math.abs(dc)),sr=steps?dr/steps:0,sc=steps?dc/steps:0;return Array.from({length:steps+1},(_,i)=>[a[0]+sr*i,a[1]+sc*i])}
function clearHighlight(){document.querySelectorAll('.cell.highlight').forEach(el=>el.classList.remove('highlight'))}function highlight(p){clearHighlight();(p||[]).forEach(([r,c])=>document.getElementById(id(r,c))?.classList.add('highlight'));currentPath=p||[]}
function selectedString(p){return (p||[]).map(([r,c])=>matrix[r][c]).join('')}function reversedSelectedString(p){return (p||[]).slice().reverse().map(([r,c])=>matrix[r][c]).join('')}
function finish(){if(!dragging)return;dragging=false;const chosen=selectedString(currentPath);const rev=reversedSelectedString(currentPath);const match=wordData.find(w=>!found.has(w.word)&&(w.phonemes.join('')===chosen||w.phonemes.join('')===rev));if(match){found.add(match.word);currentPath.forEach(([r,c])=>document.getElementById(id(r,c))?.classList.add('found'));document.querySelector('[data-word="'+match.word+'"]').classList.add('found');msg.textContent='Found “'+match.word+'” — /'+match.phonemes.join(' ')+'/.';if(found.size===wordData.length)msg.textContent='Excellent — all words found!'}else if(currentPath.length>1){msg.textContent='That path is not one of the listed words.'}clearHighlight();currentPath=[]}
for(let r=0;r<size;r++){for(let c=0;c<size;c++){const cell=document.createElement('div');cell.className='cell';cell.id=id(r,c);cell.dataset.r=r;cell.dataset.c=c;cell.textContent=matrix[r][c];cell.onpointerdown=e=>{e.preventDefault();dragging=true;start=[r,c];highlight([start]);cell.setPointerCapture?.(e.pointerId)};cell.onpointerenter=()=>{if(dragging)highlight(path(start,[r,c]))};cell.onpointerup=finish;grid.appendChild(cell)}}
wordData.forEach(w=>{const chip=document.createElement('span');chip.className='word';chip.dataset.word=w.word;chip.textContent='/'+w.phonemes.join(' ')+'/';chip.title='English word: '+w.word;words.appendChild(chip)});window.addEventListener('pointerup',finish);document.getElementById('answers').onclick=()=>{showAnswers=!showAnswers;solutions.forEach(s=>s.coords.forEach(([r,c])=>document.getElementById(id(r,c))?.classList.toggle('found',showAnswers||found.has(s.word))));document.getElementById('answers').textContent=showAnswers?'Hide answers':'Show answers';msg.textContent=showAnswers?'Answer paths are highlighted.':'Continue finding the phoneme words.'};
</script></body></html>`;
}

export default function WordSearchPage() {
  const [selectedNames, setSelectedNames] = useState(DEFAULT_SEARCH_WORDS);
  const [size, setSize] = useState(10);
  const selectedWords = useMemo(() => selectedNames.map(name => WORD_CORPUS.find(w => w.word === name)).filter(Boolean), [selectedNames]);
  const [puzzle, setPuzzle] = useState(() => buildWordSearch(DEFAULT_SEARCH_WORDS.map(name => WORD_CORPUS.find(w => w.word === name)), 10));
  const [start, setStart] = useState(null);
  const [hover, setHover] = useState(null);
  const [found, setFound] = useState([]);
  const [message, setMessage] = useState('Drag across a phoneme word to select it.');
  const [showAnswers, setShowAnswers] = useState(false);

  const activePath = pathBetween(start, hover);
  const activeKeys = new Set((activePath || []).map(([r,c]) => `${r}-${c}`));
  const answerKeys = new Set(showAnswers ? puzzle.solutions.flatMap(s => s.coords.map(([r,c]) => `${r}-${c}`)) : []);
  const foundKeys = new Set(puzzle.solutions.filter(s => found.includes(s.word)).flatMap(s => s.coords.map(([r,c]) => `${r}-${c}`)));

  function refresh(nextNames = selectedNames, nextSize = size) {
    const words = nextNames.map(name => WORD_CORPUS.find(w => w.word === name)).filter(Boolean);
    setPuzzle(buildWordSearch(words, nextSize));
    setStart(null); setHover(null); setFound([]); setMessage('New puzzle generated. Drag across a word to select it.'); setShowAnswers(false);
  }

  function toggleWord(name) {
    let next;
    if (selectedNames.includes(name)) next = selectedNames.filter(n => n !== name);
    else if (selectedNames.length < 5) next = [...selectedNames, name];
    else { setMessage('Assessment 1 uses a small word list of five words. Remove one before adding another.'); return; }
    if (next.length < 3) { setMessage('Keep at least three words in the puzzle.'); return; }
    setSelectedNames(next);
    refresh(next, size);
  }

  function finishSelection(end) {
    if (!start) return;
    const path = pathBetween(start, end);
    if (!path) { setMessage('Select in a straight horizontal, vertical or diagonal line.'); setStart(null); setHover(null); return; }
    const seq = path.map(([r,c]) => puzzle.grid[r][c]).join('');
    const rev = [...path].reverse().map(([r,c]) => puzzle.grid[r][c]).join('');
    const match = selectedWords.find(w => !found.includes(w.word) && (w.phonemes.join('') === seq || w.phonemes.join('') === rev));
    if (match) {
      const next = [...found, match.word];
      setFound(next);
      setMessage(next.length === selectedWords.length ? 'Excellent — all phoneme words found!' : `Found “${match.word}” — /${match.phonemes.join(' ')}/.`);
    } else setMessage('That path is not one of the listed phoneme words.');
    setStart(null); setHover(null);
  }

  function generate() {
    downloadHtml('phoneme-word-search.html', makeWordSearchHtml(selectedWords, size, puzzle));
  }

  return (
    <>
      <PageIntro
        eyebrow="Activity builder · Word Search"
        title="Create a phoneme Word Search"
        description="Choose a small list of five HCE-transcribed words, generate the grid, preview the interaction and download a standalone HTML puzzle."
      />

      <div className="builder-layout">
        <aside className="builder-panel">
          <div className="panel-heading"><span>1</span><div><h2>Configure</h2><p>Choose five words and a grid size.</p></div></div>
          <p className="field-label">Word list <span className="counter">{selectedNames.length}/5</span></p>
          <div className="word-picker" role="group" aria-label="Choose phoneme words">
            {WORD_CORPUS.filter(w => w.phonemes.length <= 4).map(item => {
              const checked = selectedNames.includes(item.word);
              return <label key={item.word} className={`word-pick ${checked ? 'checked' : ''}`}>
                <input type="checkbox" checked={checked} onChange={() => toggleWord(item.word)} />
                <span><strong>{item.word}</strong><small>/{item.phonemes.join(' ')}/</small></span>
              </label>;
            })}
          </div>

          <label className="field-label" htmlFor="grid-size">Grid size</label>
          <select id="grid-size" value={size} onChange={e => { const n = Number(e.target.value); setSize(n); refresh(selectedNames, n); }}>
            <option value="8">8 × 8 — easier</option>
            <option value="10">10 × 10 — standard</option>
            <option value="12">12 × 12 — harder</option>
          </select>

          <button type="button" className="button secondary full" onClick={() => refresh()}>Regenerate puzzle</button>
          <button type="button" className="button primary full" onClick={generate}>Generate & download HTML</button>
        </aside>

        <section className="preview-panel">
          <div className="panel-heading"><span>2</span><div><h2>Preview</h2><p>Drag from the first phoneme to the last.</p></div></div>
          <p className="game-message" role="status" aria-live="polite">{message}</p>
          <div className="search-grid" style={{ '--grid-size': size }} onPointerLeave={() => { if (start) setHover(start); }}>
            {puzzle.grid.map((row, r) => row.map((symbol, c) => {
              const key = `${r}-${c}`;
              const cls = ['search-cell', activeKeys.has(key) ? 'highlight' : '', (foundKeys.has(key) || answerKeys.has(key)) ? 'found' : ''].filter(Boolean).join(' ');
              return <button
                type="button"
                key={key}
                className={cls}
                onPointerDown={e => { e.preventDefault(); setStart([r,c]); setHover([r,c]); }}
                onPointerEnter={() => { if (start) setHover([r,c]); }}
                onPointerUp={() => finishSelection([r,c])}
                aria-label={`Row ${r+1}, column ${c+1}, phoneme ${symbol}`}
              >{symbol}</button>;
            }))}
          </div>
          <div className="word-chip-list" aria-label="Words to find">
            {selectedWords.map(w => <span key={w.word} className={`word-chip ${found.includes(w.word) ? 'found' : ''}`} title={`English: ${w.word}`}>/{w.phonemes.join(' ')}/</span>)}
          </div>
          <div className="button-row center">
            <button type="button" className="button secondary" onClick={() => setShowAnswers(v => !v)}>{showAnswers ? 'Hide answers' : 'Show answers'}</button>
          </div>
        </section>
      </div>
    </>
  );
}
