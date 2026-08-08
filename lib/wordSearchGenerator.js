export const DIRECTIONS = [
  [0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]
];

export function buildWordSearch(words, size = 10) {
  const grid = Array.from({ length: size }, () => Array(size).fill(null));
  const pool = [...new Set(words.flatMap(w => w.phonemes))];
  const solutions = [];

  for (const word of words) {
    let placed = false;
    for (let attempt = 0; attempt < 500 && !placed; attempt++) {
      const [dr, dc] = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      const r = Math.floor(Math.random() * size);
      const c = Math.floor(Math.random() * size);
      const endR = r + dr * (word.phonemes.length - 1);
      const endC = c + dc * (word.phonemes.length - 1);
      if (endR < 0 || endR >= size || endC < 0 || endC >= size) continue;

      let ok = true;
      for (let i = 0; i < word.phonemes.length; i++) {
        const rr = r + dr * i;
        const cc = c + dc * i;
        if (grid[rr][cc] && grid[rr][cc] !== word.phonemes[i]) { ok = false; break; }
      }
      if (!ok) continue;

      const coords = [];
      for (let i = 0; i < word.phonemes.length; i++) {
        const rr = r + dr * i;
        const cc = c + dc * i;
        grid[rr][cc] = word.phonemes[i];
        coords.push([rr, cc]);
      }
      solutions.push({ word: word.word, phonemes: word.phonemes, coords });
      placed = true;
    }
  }

  const fallback = pool.length ? pool : ['p','t','k','b','d','ɡ','æ','ɪ'];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!grid[r][c]) grid[r][c] = fallback[Math.floor(Math.random() * fallback.length)];
    }
  }
  return { grid, solutions };
}

export function pathBetween(start, end) {
  if (!start || !end) return null;
  const dr = end[0] - start[0];
  const dc = end[1] - start[1];
  if (!(dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc))) return null;
  const steps = Math.max(Math.abs(dr), Math.abs(dc));
  const sr = steps === 0 ? 0 : dr / steps;
  const sc = steps === 0 ? 0 : dc / steps;
  return Array.from({ length: steps + 1 }, (_, i) => [start[0] + sr * i, start[1] + sc * i]);
}
