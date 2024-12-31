import { vars } from '@/style';
import { style } from '@vanilla-extract/css';

const headerStyle = style({
  display: 'flex',
  flexDirection: 'column',
  padding: '2rem',
  fontSize: '1.6rem',
  alignSelf: 'center',
  borderRadius: '4px',
  gap: '1rem',

  '@media': {
    '(min-width: 480px)': {
      flexDirection: 'row',
      width: '36rem',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  },
});

const headerLogoContainerStyle = style({
  position: 'relative',
});

const headerLogoStyle = style({
  cursor: 'pointer',
  fontFamily: 'var(--font-sometype_mono)',
  fontSize: '2rem',
  fontWeight: 600,
  color: vars.palette.accent[12],
});

const headerLogoOutlineStyle = style({
  position: 'absolute',
  top: '-0.8rem',
});

export {
  headerStyle,
  headerLogoContainerStyle,
  headerLogoStyle,
  headerLogoOutlineStyle,
};
