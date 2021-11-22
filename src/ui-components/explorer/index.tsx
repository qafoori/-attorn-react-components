import React, { FC, useRef } from "react"
import { Icon } from "../icon";
import * as Lib from './lib';


export const Explorer: FC<Lib.T.Explorer> = ({
  maxWidth, minWidth, width, height, styling
  , ..._
}): JSX.Element => {
  const explorer = useRef<HTMLDivElement>(null);
  const { on, I } = Lib.H.useExplorer(explorer, { width });

  return (
    <Lib.S.Explorer
      width={width}
      height={height}
      maxWidth={maxWidth}
      minWidth={minWidth}
      styling={styling}
      ref={explorer}
      {..._ as any}
    >
      <span
        className='resizeHandler'
        id='some'
        onMouseDown={on.mouseDown}
        onDoubleClick={on.doubleClick}
      />
      <div>
        <div className='header'>
          <p>something that goes here</p>
          {I.headerOptions.map((item, index) =>
            <span onClick={item.onClick} key={index} title={item.name}>
              <Icon
                name={item.name}
                color={styling.optionsColor || 'white'}
                size={item.size}
              />
            </span>
          )}
        </div>

        <div className='body'>
          <Lib.C.File 
            name='some file name goes here'
          />
          <Lib.C.Folder 
            name='some file name goes here'
          />
          <Lib.C.File 
            name='some file name goes here'
          />
          <Lib.C.Folder 
            name='some file name goes here'
          />
        </div>

      </div>
    </Lib.S.Explorer>
  )
}