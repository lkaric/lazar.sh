import { style } from '@vanilla-extract/css';

const underlineLinkStyle = style({
  position: 'relative',
  width: '100%',
});

const underlineLinkPathStyle = style({
  position: 'absolute',
  bottom: '-0.5rem',
});

export { underlineLinkStyle, underlineLinkPathStyle };
