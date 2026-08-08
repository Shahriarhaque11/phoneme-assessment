import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata = {
  title: 'PhonemeLab — Speech Pathology Activity Builder',
  description: 'A frontend builder for phoneme-based Wordle and Word Search classroom activities.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){try{var m=document.cookie.match(/(?:^|; )phoneme-theme=([^;]+)/);var t=m?decodeURIComponent(m[1]):'light';document.documentElement.dataset.theme=t==='dark'?'dark':'light';}catch(e){}})();
        `}} />
      </head>
      <body>
        <ThemeProvider>
          <a className="skip-link" href="#main-content">Skip to main content</a>
          <Header />
          <main id="main-content" className="shell main-content">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
