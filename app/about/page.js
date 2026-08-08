import PageIntro from '@/components/PageIntro';

export default function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow="About the project"
        title="A frontend prototype for Speech Pathology teaching activities"
        description="Assessment 1 focuses on frontend design, usability and a reusable foundation for later assessments. No database or dynamic word-list management is required at this stage."
      />

      <div className="card-grid two about-grid">
        <article className="content-card">
          <h2>What this prototype does</h2>
          <p><strong>Wordle:</strong> creates a phoneme-based Wordle-style activity from one selected HCE-transcribed word. Each phoneme occupies one cell.</p>
          <p><strong>Word Search:</strong> creates a puzzle from a small list of five phoneme-based words and fills unused cells with phoneme symbols.</p>
          <p>Both builders provide an interactive preview and can generate a single standalone <code>.html</code> file for use in a normal browser.</p>
        </article>

        <article className="content-card">
          <h2>Assessment 1 scope</h2>
          <ul className="check-list">
            <li>Frontend-only implementation</li>
            <li>Responsive component-based interface</li>
            <li>Phoneme keyboard and hover hints</li>
            <li>Light/dark theme stored in a cookie</li>
            <li>Playable downloadable HTML output</li>
            <li>Designed for later database expansion</li>
          </ul>
        </article>
      </div>

      <section className="section-block">
        <div className="section-heading">
          <span className="eyebrow">How to use the website</span>
          <h2>Video walkthrough</h2>
          <p>Replace the placeholder file below with your own recorded walkthrough before submission. Your submission video must show your face, student ID and voice.</p>
        </div>
        <div className="video-card">
          <video controls preload="metadata">
            <source src="/walkthrough.mp4" type="video/mp4" />
            Your browser does not support the video element.
          </video>
          <p className="muted">Expected file: <code>public/walkthrough.mp4</code></p>
        </div>
      </section>

      <section className="section-block content-card">
        <h2>Student details</h2>
        <div className="details-table">
          <div><span>Name</span><strong className="placeholder">SM SHAHRIAR HAQUE</strong></div>
          <div><span>Student number</span><strong className="placeholder">22693216</strong></div>
          <div><span>Assessment</span><strong>Assessment 1 — Frontend design and usability</strong></div>
        </div>
      </section>
    </>
  );
}
