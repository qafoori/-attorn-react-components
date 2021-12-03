import React, { FC, useRef } from "react"
import { Icon } from "../icon";
import * as Lib from './lib';


export const Explorer: FC<Lib.T.Explorer> = ({
  maxWidth, minWidth, width, height, styling, data, id, onAddNew,
  onRightClick, ContextMenu, contextHandlerState, onErrors
  , ..._
}): JSX.Element => {
  const explorer = useRef<HTMLDivElement>(null);
  const { on, I, states } = Lib.H.useExplorer(explorer, {
    width, id, data, onAddNew, onRightClick, contextHandlerState, onErrors
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
      id={id}
      {..._ as any}
    >
      <span
        className='resizeHandler'
        id='some'
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
                color={styling.optionsColor || 'white'}
                size={item.size}
              />
            </span>
          )}
        </div>

        <div className='body' onClick={on.bodyClick}>
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
            />
          )}

          <Lib.C.ItemAdder
            type={states.addNew.val}
            onBlur={on.adderInputBlur}
            onKeyUp={on.adderInputKeyUp}
            visibility={states.addNew.val !== undefined && states.folderIdToAppendNew.val === null}
          />
        </div>
      </div>
    </Lib.S.Explorer>
  )
}
