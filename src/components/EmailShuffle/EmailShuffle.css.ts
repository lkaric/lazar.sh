import { style } from '@vanilla-extract/css';

import { vars } from '@/style';

const emailShuffleAnchorStyle = style({
  fontWeight: 500,
  fontSize: '3.6rem',
  letterSpacing: '0.36rem',
});

const emailShuffleSecondaryStyle = style({
  fontSize: '1.6rem',
  fontWeight: 500,
  color: vars.palette.accent[12],
  opacity: 0.7,
  textAlign: 'center',
});

const emailShuffleTargetStyle = style({
  borderBottomWidth: '0.2rem',
  borderBottomStyle: 'dashed',
  borderBottomColor: vars.palette.accent[12],
  color: vars.palette.accent[12],
  opacity: 0.7,
});

export {
  emailShuffleAnchorStyle,
  emailShuffleTargetStyle,
  emailShuffleSecondaryStyle,
};
