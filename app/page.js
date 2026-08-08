import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div>
          <span className="eyebrow">Assessment 1 · Frontend builder</span>
          <h1>Build phoneme-based classroom activities with less friction.</h1>
          <p>
            PhonemeLab helps Speech Pathology teachers create, preview and export Wordle-style and Word Search activities using broad HCE phoneme symbols.
          </p>
          <div className="button-row">
            <Link className="button primary" href="/wordle">Build a Wordle</Link>
            <Link className="button secondary" href="/word-search">Build a Word Search</Link>
          </div>
        </div>
        <div className="hero-demo" aria-label="Example phoneme activity preview">
          <div className="mini-grid">
            {['θ','ɪ','n','b','æ','d','tʃ','ɪ','n'].map((item, i) => <span key={i}>{item}</span>)}
          </div>
          <div className="hero-note">
            <strong>Teacher-friendly workflow</strong>
            <p>Configure → Preview → Generate standalone HTML</p>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <span className="eyebrow">Two activity builders</span>
          <h2>Designed around phonemes, not ordinary spelling</h2>
        </div>
        <div className="card-grid two">
          <article className="feature-card">
            <span className="icon-chip">W</span>
            <h3>Phoneme Wordle</h3>
            <p>Create a playable Wordle-style activity where each cell represents one phoneme. Students answer using a dedicated phoneme keyboard with English-letter hints.</p>
            <Link href="/wordle">Open Wordle builder →</Link>
          </article>
          <article className="feature-card">
            <span className="icon-chip">⌕</span>
            <h3>Phoneme Word Search</h3>
            <p>Select five phoneme-based words, choose a grid size and generate a classroom puzzle with horizontal, vertical and diagonal placements.</p>
            <Link href="/word-search">Open Word Search builder →</Link>
          </article>
        </div>
      </section>

      <section className="section-block soft-panel">
        <div className="section-heading">
          <span className="eyebrow">Usability first</span>
          <h2>Built for a clear classroom preparation workflow</h2>
        </div>
        <div className="card-grid three">
          <div className="mini-feature"><strong>1. Configure</strong><span>Choose a word, difficulty, hints and activity options.</span></div>
          <div className="mini-feature"><strong>2. Preview</strong><span>Test the activity immediately before exporting it.</span></div>
          <div className="mini-feature"><strong>3. Generate</strong><span>Download one self-contained HTML file that runs in a normal browser.</span></div>
        </div>
      </section>
    </>
  );
}
