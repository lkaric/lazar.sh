import { createTheme } from '@vanilla-extract/css';

// const montserrat = Montserrat({
//   subsets: ['latin'],
//   variable: '--font-montserrat',
// });

// const sometype_mono = Sometype_Mono({
//   subsets: ['latin'],
//   variable: '--font-sometype_mono',
// });

export const [theme, vars] = createTheme({
  font: {
    primary: 'var(--font-montserrat)',
    secondary: 'var(--font-sometype_mono)',
  },
  palette: {
    accent: {
      1: '#0D1119',
      2: '#151922',
      3: '#1D2435',
      4: '#242E44',
      5: '#2C3852',
      6: '#364462',
      7: '#435376',
      8: '#566994',
      9: '#60749F',
      10: '#536791',
      11: '#A4B8E0',
      12: '#E1ECFF',
    },
    gray: {
      1: '#111',
      2: '#191919',
      3: '#222',
      4: '#292929',
      5: '#313131',
      6: '#3a3a3a',
      7: '#484848',
      8: '#606060',
      9: '#6d6d6d',
      10: '#7a7a7a',
      11: '#b3b3b3',
      12: '#eee',
    },
  },
  spacing: {
    small: '0.5rem',
    medium: '1rem',
    large: '2rem',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
  },
});
