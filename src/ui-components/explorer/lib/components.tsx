import React, { FC, useEffect, useState } from 'react';
import * as Lib from '.';
import { Icon } from '../../icon';



export const Item: FC<Lib.T.ItemProps> = ({
  item, active, setActive, collapsed, children, ...otherProps
}): JSX.Element => {
  let nestedItem: JSX.Element[] = [];

  if ("subItems" in item) {
    nestedItem = item.subItems.map((item: Lib.T.FolderProps | Lib.T.FileProps, i: number) => {
      return (
        <Item
          key={i}
          item={item}
          active={active}
          setActive={setActive}
          collapsed={collapsed}
          {...otherProps}
        />
      )
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
        {...otherProps}
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
        collapsed={collapsed}
        {...otherProps}
      >
        {nestedItem}
      </Folder>
    )
  }
}



export const Folder: FC<Lib.T.FolderProps> = ({
  name, children, active, onClick, collapsed, id, subItems, onDragStart, onDragEnd, onDragOver
}): JSX.Element => {
  const [childrenVisibility, setChildrenVisibility] = useState<boolean>(false);

  const onClickHandler = () => {
    setChildrenVisibility(!childrenVisibility)
    if (onClick) {
      onClick();
    }
  }

  useEffect(() => setChildrenVisibility(false), [collapsed])

  return (
    <>
      <Lib.S.ExplorerItem
        draggable={true}
        onDragStart={evt => onDragStart!(evt, name)}
        onDragEnd={onDragEnd}
      >
        <div className={`details ${active}`} onClick={onClickHandler}>
          <span onDragOver={onDragOver} className='border top' />
          <span onDragOver={onDragOver} className='border center' />
          <span onDragOver={onDragOver} className='border bottom' />

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
  name, method, active, onClick, children, id, onDragStart, onDragEnd, onDragOver
}): JSX.Element => {
  const onClickHandler = () => {
    if (onClick) {
      onClick();
    }
  }

  return (
    <>
      <Lib.S.ExplorerItem
        className='file'
        draggable={true}
        onDragStart={evt => onDragStart!(evt, name)}
        onDragEnd={onDragEnd}
      >
        <div className={`details ${active}`} onClick={onClickHandler}>
          <span onDragOver={onDragOver} className='border top' />
          <span onDragOver={onDragOver} className='border center' />
          <span onDragOver={onDragOver} className='border bottom' />

          <span className='method'>
            <Icon name={`method-abbr-${method}`} size={12} />
          </span>

          <p className='fileName'>{name}</p>
        </div>
      </Lib.S.ExplorerItem>
    </>
  )
}
