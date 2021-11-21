import React, { FC, useRef } from "react"
import * as Lib from './lib';


export const Explorer: FC<Lib.T.Explorer> = ({
  maxWidth, minWidth, width, height, ..._
}): JSX.Element => {
  const explorer = useRef<HTMLDivElement>(null);
  const { on } = Lib.H.useExplorer(explorer, { width });

  return (
    <Lib.S.Explorer
      width={width}
      height={height}
      maxWidth={maxWidth}
      minWidth={minWidth}
      ref={explorer}
      {..._ as any}
    >
      <span
        className='resizeHandler'
        id='some'
        onMouseDown={on.mouseDown}
        onDoubleClick={on.doubleClick}
      />
      <div></div>
    </Lib.S.Explorer>
  )
}