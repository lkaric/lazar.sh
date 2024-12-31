import { style } from '@vanilla-extract/css';

const homeMainStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.6rem',
  flexGrow: 1,
  justifyContent: 'center',
  alignItems: 'center',
});

export { homeMainStyle };
