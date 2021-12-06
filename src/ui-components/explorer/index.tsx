import React, { FC, useRef } from "react"
import { Icon } from "../icon";
import * as Lib from './lib';
import { Scrollbars } from 'react-custom-scrollbars';

export const Explorer: FC<Lib.T.Explorer> = ({
  maxWidth, minWidth, width, height, styling, data, onAddNew,
  onRightClick, ContextMenu, contextHandlerState, onErrors, onChangeItems, beforeDelete
  , ..._
}): JSX.Element => {
  const explorer = useRef<HTMLDivElement>(null);
  const { on, I, states } = Lib.H.useExplorer(explorer, {
    width, data, onAddNew, onRightClick, contextHandlerState, onErrors, onChangeItems, beforeDelete
  });

  return (
    <Lib.S.Explorer
      onKeyUp={on.shortcutHandler}
      tabIndex={1}
      width={width}
      height={height}
      maxWidth={maxWidth}
      minWidth={minWidth}
      styling={styling}
      ref={explorer}
      onContextMenu={evt => on.rightClickHandler(evt, '', 'whiteArea')}
      {..._ as any}
    >
      <span
        className='resizeHandler'
        onMouseDown={on.mouseDown}
        onDoubleClick={on.doubleClick}
      />
      <div className='explorerContainer'>
        <div className='header'>
          <p>something that goes here</p>
          {I.headerOptions.map((item, index) =>
            <span onClick={item.onClick} key={index} title={item.name}>
              <Icon
                name={item.name}
                color={styling?.header?.iconsColor || '#bcbcbc'}
                size={item.size}
              />
            </span>
          )}
        </div>

        <div className='body' onClick={on.bodyClick}>
          <Scrollbars className='bodyChild'>
            {I.data.map((item, index) =>
              <Lib.C.Item
                key={index}
                item={item}
                active={states.active.val}
                setActive={states.active.set}
                collapsed={I.collapsed}
                onDragStart={on.dragStart}
                onDragEnd={on.dragEnd}
                onDragOver={on.dragOver}
                onDragLeave={on.dragLeave}
                onHelpersDragEnd={on.helpersDragEnd}
                disabledItems={states.addNew.val !== undefined}
                itemIdToAppendNew={states.folderIdToAppendNew}
                addNewType={states.addNew.val}
                onBlur={on.adderInputBlur}
                onKeyUp={on.adderInputKeyUp}
                onRightClick={(id, type, evt) => on.rightClickHandler(evt, id, type)}
                itemIdToRename={states.itemIdToRename}
                onRename={on.rename}
                styling={styling}
                pasteEnabled={states.pasteEnabled.val}
                timingEnabled={states.timingEnabled.val}
              />
            )}

            <Lib.C.ItemAdder
              type={states.addNew.val}
              onBlur={on.adderInputBlur}
              onKeyUp={on.adderInputKeyUp}
              styling={styling}
              visibility={states.addNew.val !== undefined && states.folderIdToAppendNew.val === null}
            />
          </Scrollbars>
        </div>
      </div>
    </Lib.S.Explorer >
  )
}
