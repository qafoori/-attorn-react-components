import React, { FC, useRef } from "react"
import { Icon } from "../icon";
import * as Lib from './lib';
import { Scrollbars } from 'react-custom-scrollbars';
import { Resizable } from '../resizable'

export const Explorer: FC<Lib.T.Explorer> = ({
  maxWidth, minWidth, width, height, styling, data, onAddNew, onReload,
  onRightClick, ContextMenu, contextHandlerState, onErrors, onChangeItems, beforeDelete
  , ..._
}): JSX.Element => {
  const explorer = useRef<HTMLDivElement>(null);
  const { on, I, states } = Lib.H.useExplorer(explorer, {
    width, data, onAddNew, onRightClick, contextHandlerState,
    onErrors, onChangeItems, beforeDelete, onReload
  });

  return (
    <Resizable
      w={{ default: width || '250px', max: maxWidth || '500px', min: minWidth || '200px' }}
      h={{ default: '100%', min: '100%', max: '100%' }}
      r
    >
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
                  onRightClick={(id, type, evt) => on.rightClickHandler(evt, id, type)}
                  disabledItems={states.addNew.val !== undefined}
                  itemIdToAppendNew={states.folderIdToAppendNew}
                  timingEnabled={states.timingEnabled.val}
                  itemIdToRename={states.itemIdToRename}
                  pasteEnabled={states.pasteEnabled.val}
                  onHelpersDragEnd={on.helpersDragEnd}
                  addNewType={states.addNew.val}
                  setActive={states.active.set}
                  onKeyUp={on.adderInputKeyUp}
                  onDragStart={on.dragStart}
                  active={states.active.val}
                  onDragLeave={on.dragLeave}
                  onBlur={on.adderInputBlur}
                  onDragOver={on.dragOver}
                  collapsed={I.collapsed}
                  onDragEnd={on.dragEnd}
                  onRename={on.rename}
                  styling={styling}
                  key={index}
                  item={item}
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
    </Resizable>
  )
}
