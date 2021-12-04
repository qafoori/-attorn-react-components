import React, { DetailedHTMLProps, DragEvent, FC, HTMLAttributes, MouseEvent, useEffect, useState } from 'react';
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
  name, children, active, onClick, collapsed, id, onDragStart, onDragEnd, onDragOver,
  onDragLeave, onHelpersDragEnd, disabledItems, onBlur, onKeyUp, itemIdToAppendNew,
  addNewType, onRightClick, itemIdToRename, onRename, styling
}): JSX.Element => {
  const [childrenVisibility, setChildrenVisibility] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>(name);

  const onClickHandler = (evt: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    setChildrenVisibility(!childrenVisibility)

    const children = evt.currentTarget.nextElementSibling as HTMLDivElement | null;
    if (!children || !children.classList.contains('children')) { return }

    const allChildren = document.querySelectorAll('.true-guide') as NodeListOf<HTMLDivElement>;
    allChildren.forEach(item => item.classList.remove('true-guide'))

    setTimeout(() => children.classList.add('true-guide'), 10);
    itemIdToAppendNew!.set(id)

    if (onClick) {
      onClick();
    }
  }

  const onRightClickHandler = (evt: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    if (!childrenVisibility) {
      onClickHandler(evt)
    }
    itemIdToAppendNew!.set(id)
    if (onRightClick) {
      onRightClick(id, 'folder', evt)
    }
  }

  useEffect(() => setChildrenVisibility(false), [collapsed])

  return (
    <>
      <Lib.S.ExplorerItem
        className={`folder ${disabledItems ? 'disabled' : ''}`}
        draggable={true}
        onDragStart={evt => onDragStart!(evt, name, id)}
        onDragEnd={onDragEnd}
        data-id={id}
        onContextMenu={onRightClickHandler}
        styling={styling}
      >
        <div className={`details ${active}`} onClick={onClickHandler}>
          {itemIdToRename?.val != id &&
            <OnDragHelpers
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              withInto={true}
              id={id}
              onDragEnd={position => onHelpersDragEnd!(id, position)}
            />
          }

          <span className='chevron'>
            <Icon
              name={childrenVisibility ? 'chevron-down' : 'chevron-right'}
              color={styling?.items?.iconsColor?.chevron || '#c4c4c4'}
              size={10}
            />
          </span>

          <span className='folder'>
            <Icon
              name={childrenVisibility ? 'folder-open' : 'folder-close'}
              size={16}
              color={styling?.items?.iconsColor?.folder || '#c4c4c4'}
            />
          </span>


          {itemIdToRename?.val == id
            ? <input
              type="text"
              value={newName}
              onInput={evt => setNewName(evt.currentTarget.value)}
              onBlur={evt => onRename?.blur(evt, name, setNewName)}
              onKeyUp={evt => onRename?.keyUp(evt, name, setNewName)}
              autoFocus={true}
            />
            : <p>{name} ({id})</p>
          }
        </div>

        <div className={`children ${childrenVisibility}`}>
          <span className={`guide ${active}`} />

          {children &&
            children
          }

          <Lib.C.ItemAdder
            type={addNewType}
            onBlur={onBlur}
            onKeyUp={onKeyUp}
            visibility={itemIdToAppendNew!.val == id && addNewType !== undefined}
          />
        </div>
      </Lib.S.ExplorerItem>
    </>
  )
}



export const File: FC<Lib.T.FileProps> = ({
  name, method, active, onClick, id, onDragStart, onDragEnd, onDragOver, itemIdToRename, styling,
  onDragLeave, onHelpersDragEnd, disabledItems, itemIdToAppendNew, onRightClick, onRename
}): JSX.Element => {
  const [newName, setNewName] = useState<string>(name);

  const onClickHandler = (evt: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    const parent = evt.currentTarget.parentNode?.parentNode?.parentNode as HTMLDivElement | null;
    if (parent && parent.classList.contains('folder')) {
      itemIdToAppendNew?.set(parent.getAttribute('data-id')!)
    }
    else {
      itemIdToAppendNew?.set(null)
    }

    if (onClick) {
      onClick();
    }
  }


  const onRightClickHandler = (evt: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    if (onRightClick) {
      onRightClick(id, 'file', evt)
    }
  }

  return (
    <>
      <Lib.S.ExplorerItem
        className={`file ${disabledItems ? 'disabled' : ''}`}
        draggable={true}
        onDragStart={evt => onDragStart!(evt, name, id)}
        onDragEnd={onDragEnd}
        data-id={id}
        onContextMenu={onRightClickHandler}
        styling={styling}
      >
        <div className={`details ${active}`} onClick={evt => onClickHandler(evt)}>
          {itemIdToRename?.val != id &&
            <OnDragHelpers
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              id={id}
              onDragEnd={position => onHelpersDragEnd!(id, position)}
            />
          }

          <span className='empty'>
          </span>

          <span className='method'>
            <Icon
              name={`method-abbr-${method}`}
              size={12}
              secondaryColor={styling?.items?.iconsColor?.methodsBackground || '#3b3e42'}
            />
          </span>

          {itemIdToRename?.val == id
            ? <input
              type="text"
              value={newName}
              onInput={evt => setNewName(evt.currentTarget.value)}
              onBlur={evt => onRename?.blur(evt, name, setNewName)}
              onKeyUp={evt => onRename?.keyUp(evt, name, setNewName)}
              autoFocus={true}
            />
            : <p className='fileName'>{name} ({id})</p>
          }
        </div>
      </Lib.S.ExplorerItem>
    </>
  )
}





export const OnDragHelpers: FC<
  Pick<Lib.T.FileProps,
    'onDragOver'
    | 'onDragLeave'
    | 'id'
  > & {
    onDragEnd: (position: Lib.T.Position) => void,
    withInto?: boolean
  }
> = ({
  onDragLeave, onDragOver, onDragEnd, id, withInto
}) => {
    const props: DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> | { [name: string]: any } = {
      'data-id': id,
      onDragOver,
    }

    const onDragLeaveHandler = (evt: DragEvent<HTMLSpanElement>, position: Lib.T.Position) => {
      onDragLeave!(evt)
      onDragEnd(position)
    }

    return (
      <>
        <span
          onDragLeave={evt => onDragLeaveHandler(evt, 'above')}
          className='border top'
          {...props}
        />
        {withInto &&
          <span
            onDragLeave={evt => onDragLeaveHandler(evt, 'into')}
            className='border center'
            {...props}
          />
        }
        <span
          onDragLeave={evt => onDragLeaveHandler(evt, 'below')}
          className='border bottom'
          {...props}
        />
      </>
    )
  }



export const ItemAdder: FC<Lib.T.ItemAdderProps> = ({
  type, onBlur, onKeyUp, visibility, styling
}) => {

  return <>
    <Lib.S.ExplorerItem
      styling={styling}
      className={`file item-adder ${visibility ? 'enabled-item-adder' : ''}`}
    >
      <div className='details'>
        {type === 'file'
          ?
          <>
            <span className='empty'>
            </span>
            <span className='method'>
              <Icon name='method-abbr-post' size={12} />
            </span>
          </>
          :
          <>
            <span className='chevron'>
              <Icon name='chevron-right' color='var(--foreground_color)' size={10} />
            </span>

            <span className='folder'>
              <Icon name='folder-close' size={16} color='var(--foreground_color)' />
            </span>
          </>
        }
        <input
          placeholder='Type the name here...'
          className='itemAdderInput'
          autoFocus={true}
          onBlur={onBlur}
          onKeyUp={onKeyUp}
        />
      </div>
    </Lib.S.ExplorerItem>
  </>
}
