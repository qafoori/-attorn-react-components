import React, { FC } from "react"
import * as Lib from './lib';


export const Explorer: FC<Lib.T.Explorer> = ({
  height, maxHeight, maxWidth, minHeight, minWidth, width, ..._
}): JSX.Element => {

  return (
    <Lib.S.Explorer
      height={height}
      width={width}
      maxHeight={maxHeight}
      maxWidth={maxWidth}
      minHeight={minHeight}
      minWidth={minWidth}
      {..._ as any}
    >
      <div></div>
    </Lib.S.Explorer>
  )
}