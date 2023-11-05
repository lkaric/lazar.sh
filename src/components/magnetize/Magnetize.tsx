'use client';

import React, { useCallback, useEffect, useRef } from 'react';

import gsap from 'gsap';

interface MagnetizeProps {
  children: React.ReactElement;
}

const Magnetize: React.FC<MagnetizeProps> = ({ children }) => {
  const magnetic = useRef<HTMLElement | any>(null);

  const toAxis = useCallback(
    (ref: React.MutableRefObject<HTMLElement | any>, axis: 'x' | 'y') =>
      gsap.quickTo(ref.current, axis, {
        duration: 1,
        ease: 'elastic.out(1, 0.3)'
      }),
    []
  );

  const mouseMove = useCallback(
    (ref: React.MutableRefObject<HTMLElement | any>, e: any) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = ref.current.getBoundingClientRect();

      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);

      toAxis(ref, 'x')(x);
      toAxis(ref, 'y')(y);
    },
    [toAxis]
  );

  const mouseLeave = useCallback(
    (ref: React.MutableRefObject<HTMLElement | any>, e: any) => {
      gsap.to(ref.current, { x: 0, duration: 1 });
      gsap.to(ref.current, { y: 0, duration: 1 });

      toAxis(ref, 'x')(0);
      toAxis(ref, 'y')(0);
    },
    [toAxis]
  );

  useEffect(() => {
    const element = magnetic;

    const mouseMoveHandler = (e: any) => mouseMove(element, e);
    const mouseLeaveHandler = (e: any) => mouseLeave(element, e);

    element.current.addEventListener('mousemove', mouseMoveHandler);
    element.current.addEventListener('mouseleave', mouseLeaveHandler);

    return () => {
      console.log('ELEMENT', element);

      element.current?.removeEventListener('mousemove', mouseMoveHandler);
      element.current?.removeEventListener('mouseleave', mouseLeaveHandler);
    };
  }, [mouseLeave, mouseMove, toAxis]);

  return React.cloneElement(children, { ref: magnetic });
};

export { Magnetize };
