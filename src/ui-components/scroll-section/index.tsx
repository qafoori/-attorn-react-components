import React, { FC, useRef } from 'react';
import * as Lib from './lib';


export const ScrollSection: FC<Lib.T.ScrollSectionProps> = ({
  children, h, w
}): JSX.Element => {
  const scrollSection = useRef<HTMLDivElement>(null);
  const { on } = Lib.H.useScrollSection(scrollSection);

  return (
    <Lib.S.ScrollSection
      w={w}
      h={h}
      ref={scrollSection}
      onWheel={on.wheel}
    >
      {children && children}
    </Lib.S.ScrollSection>
  )
}
