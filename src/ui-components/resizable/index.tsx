import React, { FC } from 'react'
import * as Lib from './lib'

export const Resizable: FC<Lib.T.Resizable> = ({
  h, w, children, ...otherProps
}): JSX.Element => {
  const { on, resizableRef, sizes } = Lib.H.useResize({ h, w });
  const { t, r, b, l, tr, tl, br, bl } = otherProps;

  return (
    <Lib.S.Resizable
      {...otherProps}
      ref={resizableRef}
      className={`attorn-studio-resizable-component ${otherProps.className ?? ''}`}
      {...sizes}
    >

      {r && <span
        className='resizeHandler r'
        onMouseDown={on.mouseDown}
        onDoubleClick={on.doubleClick}
      />}

      {l && <span
        className='resizeHandler l'
        onMouseDown={on.mouseDown}
        onDoubleClick={on.doubleClick}
      />}

      {t && <span
        className='resizeHandler t'
        onMouseDown={on.mouseDown}
        onDoubleClick={on.doubleClick}
      />}

      {b && <span
        className='resizeHandler b'
        onMouseDown={on.mouseDown}
        onDoubleClick={on.doubleClick}
      />}

      {tr && <span
        className='resizeHandler tr'
        onMouseDown={on.mouseDown}
        onDoubleClick={on.doubleClick}
      />}

      {tl && <span
        className='resizeHandler tl'
        onMouseDown={on.mouseDown}
        onDoubleClick={on.doubleClick}
      />}

      {bl && <span
        className='resizeHandler bl'
        onMouseDown={on.mouseDown}
        onDoubleClick={on.doubleClick}
      />}

      {br && <span
        className='resizeHandler br'
        onMouseDown={on.mouseDown}
        onDoubleClick={on.doubleClick}
      />}

      {children && children}
    </Lib.S.Resizable>
  )
}
