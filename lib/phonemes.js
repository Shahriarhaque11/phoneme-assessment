export const PHONEME_ROWS = [
  ['p', 't', 'k'],
  ['b', 'd', 'ɡ'],
  ['n', 'm', 'ŋ'],
  ['f', 's', 'θ', 'ʃ'],
  ['v', 'z', 'ð', 'ʒ'],
  ['l', 'ɹ', 'w', 'j'],
  ['h', 'tʃ', 'dʒ'],
  ['iː', 'ɪ', 'e', 'eː'],
  ['æ', 'ɐ', 'ɐː', 'ɜː'],
  ['ʉː', 'ɔ', 'oː', 'ʊ'],
  ['æɪ', 'ɑe', 'oɪ', 'əʉ'],
  ['æɔ', 'ɪə', 'ə']
];

export const PHONEMES = PHONEME_ROWS.flat();

export const PHONEME_HINTS = {
  p: 'P (as in pin)', t: 'T (as in tin)', k: 'K/C (as in cat)',
  b: 'B (as in bat)', d: 'D (as in dog)', 'ɡ': 'G (as in gum)',
  n: 'N (as in net)', m: 'M (as in map)', 'ŋ': 'NG (as in ring)',
  f: 'F (as in fan)', s: 'S (as in sun)', θ: 'TH (as in thin)', 'ʃ': 'SH (as in ship)',
  v: 'V (as in van)', z: 'Z (as in zip)', ð: 'TH (as in then)', 'ʒ': 'ZH sound (as in vision)',
  l: 'L (as in log)', 'ɹ': 'R (as in ring)', w: 'W (as in win)', j: 'Y (as in yes)',
  h: 'H (as in hat)', 'tʃ': 'CH (as in chin)', 'dʒ': 'J (as in jam)',
  'iː': 'EE (as in street)', 'ɪ': 'I (as in bid)', e: 'E (as in bed)', 'eː': 'long E vowel',
  æ: 'A (as in bad)', 'ɐ': 'U (as in bud)', 'ɐː': 'AR (as in bark)', 'ɜː': 'IR (as in bird)',
  'ʉː': 'OO (as in boot)', ɔ: 'O (as in log)', 'oː': 'OR (as in fork)', ʊ: 'OO (as in book)',
  'æɪ': 'AY (as in bait)', 'ɑe': 'I (as in bike)', 'oɪ': 'OY (as in boil)', 'əʉ': 'OA (as in boat)',
  'æɔ': 'OU (as in cloud)', 'ɪə': 'EAR (as in beard)', ə: 'schwa / unstressed vowel'
};
