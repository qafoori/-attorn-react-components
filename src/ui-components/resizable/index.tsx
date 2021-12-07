import React, { FC } from 'react'
import * as Lib from './lib'

export const Resizable: FC<Lib.T.Resizable> = ({
  h, w, children, handlers, ...otherProps
}): JSX.Element => {
  const { on, resizableRef, sizes } = Lib.H.useResize({ h, w });
  const { t, r, b, l } = handlers;

  return (
    <Lib.S.Resizable
      {...otherProps}
      ref={resizableRef}
      className={`attorn-studio-resizable-component ${otherProps.className ?? ''}`}
      {...sizes}
    >

      {r && <span
        className='resizeHandler right'
        onMouseDown={on.mouseDown}
        onDoubleClick={on.doubleClick}
      />}

      {l && <span
        className='resizeHandler left'
        onMouseDown={on.mouseDown}
        onDoubleClick={on.doubleClick}
      />}



      {children && children}
    </Lib.S.Resizable>
  )
}
