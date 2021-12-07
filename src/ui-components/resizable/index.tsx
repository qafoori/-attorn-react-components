import React, { FC } from 'react'
import * as Lib from './lib'

export const Resizable: FC<Lib.T.Resizable> = ({
  h, w, children, handlers, ...otherProps
}): JSX.Element => {
  const { on, resizableRef, sizes } = Lib.H.useResize({ h, w });

  return (
    <Lib.S.Resizable
      {...otherProps}
      ref={resizableRef}
      className={`attorn-studio-resizable-component ${otherProps.className ?? ''}`}
      {...sizes}
    >
      <span
        className='resizeHandler'
        onMouseDown={on.mouseDown}
        onDoubleClick={on.doubleClick}
      />

      {children && children}
    </Lib.S.Resizable>
  )
}
