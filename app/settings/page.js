'use client';

import PageIntro from '@/components/PageIntro';
import { useTheme } from '@/components/ThemeProvider';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <PageIntro
        eyebrow="Settings"
        title="Interface preferences"
        description="Choose the interface theme. Your selection is saved in a browser cookie so it persists when you return."
      />
      <section className="content-card settings-card">
        <fieldset>
          <legend>Colour theme</legend>
          <div className="theme-options">
            <label className={`theme-option ${theme === 'light' ? 'selected' : ''}`}>
              <input type="radio" name="theme" checked={theme === 'light'} onChange={() => setTheme('light')} />
              <span className="theme-swatch light" aria-hidden="true" />
              <span><strong>Light</strong><small>Bright surface with dark text</small></span>
            </label>
            <label className={`theme-option ${theme === 'dark' ? 'selected' : ''}`}>
              <input type="radio" name="theme" checked={theme === 'dark'} onChange={() => setTheme('dark')} />
              <span className="theme-swatch dark" aria-hidden="true" />
              <span><strong>Dark</strong><small>Dark surface with high-contrast text</small></span>
            </label>
          </div>
        </fieldset>
        <p className="status-message" role="status">Current preference: <strong>{theme}</strong> mode.</p>
      </section>
    </>
  );
}
