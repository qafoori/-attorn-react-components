import React, { FC, useEffect, useState } from 'react';
import * as Lib from '.';
import { Icon } from '../../icon';



export const Item: FC<Lib.T.ItemProps> = ({ item, active, setActive }) => {
  let nestedItem: JSX.Element[] = [];


  if ("subItems" in item) {
    nestedItem = item.subItems.map((item: Lib.T.FolderProps | Lib.T.FileProps, i: number) => {
      return <Item
        key={i}
        item={item}
        active={active}
        setActive={setActive}
      />
    })
  }

  if ("method" in item && item.method) {
    return (
      <File
        name={item.name}
        method={item.method}
        id={item.id}
        active={item.id == active}
        onClick={() => setActive(item.id)}
      />
    )
  }
  else {
    return (
      <Folder
        id={item.id}
        name={item.name}
        subItems={[]}
        active={item.id == active}
        onClick={() => setActive(item.id)}
      >
        {nestedItem}
      </Folder>
    )
  }
}




export const Folder: FC<Lib.T.FolderProps> = ({
  name, children, active, onClick
}): JSX.Element => {
  const [childrenVisibility, setChildrenVisibility] = useState<boolean>(false);

  const onClickHandler = () => {
    setChildrenVisibility(!childrenVisibility)
    if (onClick) {
      onClick();
    }
  }

  return (
    <>
      <Lib.S.ExplorerItem>
        <div className={`details ${active}`} onClick={onClickHandler}>
          <span className='chevron'>
            <Icon name={childrenVisibility ? 'chevron-down' : 'chevron-right'} color='var(--foreground_color)' size={10} />
          </span>

          <span className='folder'>
            <Icon name={childrenVisibility ? 'folder-open' : 'folder-close'} size={16} color='var(--foreground_color)' />
          </span>

          <p>{name}</p>
        </div>

        <div className={`children ${childrenVisibility}`}>
          <span className={`guide ${active}`} />
          {children &&
            children
          }
        </div>
      </Lib.S.ExplorerItem>
    </>
  )
}



export const File: FC<Lib.T.FileProps> = ({
  name, method, active, onClick
}): JSX.Element => {
  const onClickHandler = () => {
    if (onClick) {
      onClick();
    }
  }

  return (
    <>
      <Lib.S.ExplorerItem>
        <div className={`details ${active}`} onClick={onClickHandler}>
          <span className='method'>
            <Icon name={`method-abbr-${method}`} size={12} />
          </span>

          <p>{name}</p>
        </div>
      </Lib.S.ExplorerItem>
    </>
  )
}
