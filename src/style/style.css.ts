import { style } from '@vanilla-extract/css';

import { vars } from './theme.css';

const body = style({
  background: vars.palette.accent[1],
  color: vars.palette.gray[12],
  display: 'flex',
  flexDirection: 'column',
});

export { body };
