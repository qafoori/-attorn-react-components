import React, { FC, useRef } from "react"
import * as Lib from './lib';


export const HorizontalScroll: FC<Lib.T.HorizontalScrollProps> = ({
  children, childrenComponent = 'div', scrollbar, ...otherProps
}) => {
  const HSRef = useRef<HTMLDivElement>(null);
  const { on } = Lib.H.useHorizontalScroll(HSRef);

  return (
    <Lib.S.HorizontalScroll
      onWheel={on.wheel}
      ref={HSRef}
      childrenComponent={childrenComponent}
      scrollbar={scrollbar}
      className={`attorn-studio-horizontal-scroll ${otherProps.className || ''}`}
      {...otherProps}
    >
      {children}
      <div className=""></div>
    </Lib.S.HorizontalScroll>
  )
}
