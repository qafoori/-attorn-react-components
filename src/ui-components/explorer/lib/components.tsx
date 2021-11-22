import React, { FC } from 'react';
import * as Lib from '.';
import { Icon } from '../../icon';


export const Folder: FC<Lib.T.FolderProps> = ({
  name
}): JSX.Element => {
  return (
    <>
      <Lib.S.ExplorerItem>
        <div className='details'>
          <span>
            <Icon name='chevron-right' color='var(--foreground_color)' size={10} />
          </span>
          <span className='folder'>
            <Icon name='folder-close' size={14} color='var(--foreground_color)' />
          </span>
          <p>
            {name}
          </p>
        </div>

        <div className='children'>
          <File name='some another name' />
        </div>
      </Lib.S.ExplorerItem>
    </>
  )
}



export const File: FC<Lib.T.FileProps> = ({
  name
}): JSX.Element => {
  return (
    <>
      <Lib.S.ExplorerItem>
        <div className='details'>
          <span>
            <Icon name='method-head' size={14} />
          </span>
          <p>
            {name}
          </p>
        </div>
      </Lib.S.ExplorerItem>
    </>
  )
}
