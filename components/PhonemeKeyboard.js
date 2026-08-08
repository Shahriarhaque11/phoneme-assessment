import { PHONEME_HINTS, PHONEME_ROWS } from '@/lib/phonemes';

export default function PhonemeKeyboard({ onPress, disabled = false, compact = false }) {
  return (
    <div className={`phoneme-keyboard ${compact ? 'compact' : ''}`} aria-label="Phoneme keyboard">
      {PHONEME_ROWS.map((row, rowIndex) => (
        <div className="phoneme-row" key={rowIndex}>
          {row.map(symbol => (
            <button
              type="button"
              className="phoneme-key"
              key={symbol}
              onClick={() => onPress?.(symbol)}
              disabled={disabled}
              title={`/${symbol}/ — ${PHONEME_HINTS[symbol] || 'phoneme'}`}
              aria-label={`Phoneme ${symbol}. ${PHONEME_HINTS[symbol] || ''}`}
            >
              <span>/{symbol}/</span>
              {!compact && <small>{PHONEME_HINTS[symbol]?.split(' (')[0]}</small>}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
