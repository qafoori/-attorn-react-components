import { Dispatch, DragEvent, FocusEvent, KeyboardEvent, SetStateAction, useCallback, useEffect, useState } from 'react'
import * as Lib from '.';
// @ts-ignore
import { findNested } from '../../../helpers'


const GHOST_CLASS_NAME = 'attornStudioDraggedItemGhostClassName'


export const useExplorer = (
  explorerRef: React.RefObject<HTMLDivElement>,
  {
    width, id, tabIndent = 15, data: explorerData, onAddNew,
    onRightClick, contextHandlerState, onErrors
  }:
    Pick<
      Lib.T.Explorer,
      'width'
      | 'id'
      | 'tabIndent'
      | 'data'
      | 'onAddNew'
      | 'onRightClick'
      | 'contextHandlerState'
      | 'onErrors'
    >
) => {
  const [addNew, setAddNew] = useState<Lib.T.AddNewTypes>(undefined)
  const [collapsed, setCollapsed] = useState<boolean>(true)
  const [onDragEndInfo, setOnDragEndInfo] = useState<Lib.T.OnDragEndInfo>()
  const [draggedId, setDraggedID] = useState<number | string>()
  const [data, setData] = useState<(Lib.T.FileProps | Lib.T.FolderProps)[]>(explorerData)
  const [stack, setStack] = useState<(Lib.T.FileProps | Lib.T.FolderProps)[][]>([explorerData])
  const [stackPointer, setStackPointer] = useState<number>(0)
  const [folderIdToAppendNew, setFolderIdToAppendNew] = useState<string | number | null>(null)
  const [itemIdToRename, setItemIdToRename] = useState<string | number | null>(null)
  const [active, setActive] = useState<number | string | null>(null);
  const [toCopyOrCut, setToCopyOrCut] = useState<Lib.T.ToCopyOrCut>(null);



  const throwError = (error: Lib.T.ErrorThrowing) => {
    if (onErrors) {
      onErrors(JSON.stringify(error))
    }
  }



  const createGhost = (name: string, evt: DragEvent<HTMLDivElement>) => {
    const ghost = document.createElement('div')
    ghost.innerHTML = name
    ghost.style.position = 'fixed'
    ghost.style.zIndex = '-9999'
    ghost.style.color = 'black'
    ghost.style.padding = '5px 5px 5px 20px'
    ghost.classList.add(GHOST_CLASS_NAME)
    document.body.appendChild(ghost)
    evt.dataTransfer.setDragImage(ghost, 0, 0)
  }



  const removeGhosts = () => {
    const ghosts = <NodeListOf<HTMLDivElement>>document.querySelectorAll(`.${GHOST_CLASS_NAME}`)
    ghosts.forEach(ghost => ghost.remove())
  }



  const onDragStart = (evt: DragEvent<HTMLDivElement>, name: string, id: number | string) => {
    evt.stopPropagation()
    setDraggedID(id)
    createGhost(name, evt)
  }



  const onDragEnd = (evt: DragEvent<HTMLDivElement>) => {
    removeGhosts()
    changeItemPosition()
    setDraggedID(undefined)
    setOnDragEndInfo(undefined)
  }



  const onDragOver = (evt: DragEvent<HTMLSpanElement>) => {
    const { classList } = evt.currentTarget

    if (classList.contains('center')) {
      const item = <HTMLDivElement>evt.currentTarget.parentNode!.parentNode!;
      item.classList.add('active')
    }
    else {
      classList.add('active')
    }
  }



  const onDragLeave = (evt: DragEvent<HTMLSpanElement>) => {
    const { currentTarget } = evt;
    const { classList } = currentTarget

    if (classList.contains('center')) {
      const item = <HTMLDivElement>evt.currentTarget.parentNode!.parentNode!;
      item.classList.remove('active')
    }
    else {
      setTimeout(() => classList.remove('active'), 50);
    }
  }



  const onHelpersDragEnd = (id: number | string, position: Lib.T.Position) => {
    setOnDragEndInfo({ position, id })
  }



  const findExactElement = (fullString: string, stringToFind: string) => {
    if (fullString.includes(',' + stringToFind)) {
      return ',' + stringToFind
    }
    else if (fullString.includes(stringToFind + ',')) {
      return stringToFind + ','
    }
    else if (fullString.includes(stringToFind)) {
      return stringToFind
    }
    else {
      throwError({
        fn: 'findExactElement',
        message: 'not found',
        stringToFind,
        fullString,
      })
      return null
    }
  }



  const removePrevData = (objString: string, dataString: string) => {
    const exactElement = findExactElement(dataString, objString);
    if (!exactElement) {
      return throwError({
        fn: 'removePrevData',
        message: '!exactElement',
      })
    }
    return dataString.replace(exactElement, '');
  }



  const diagnoseJsonString = (jsonString: string) => {
    return jsonString
      .replace(/\[,{/g, '[{')
      .replace(/},]/g, '}]')
  }



  const changeItemPosition = () => {
    if (!draggedId || !onDragEndInfo) {
      return throwError({
        fn: 'changeItemPosition',
        message: '!draggedId || !onDragEndInfo)',
      })
    }

    const elementToMove = findNested(data, 'id', draggedId)
    const elementToAppend = findNested(data, 'id', onDragEndInfo.id)

    if (!elementToMove || !elementToAppend) {
      return throwError({
        message: '!elementToMove || !elementToAppend',
        fn: 'changeItemPosition'
      })
    }

    if (onDragEndInfo.position === 'into') {
      if (elementToAppend.subItems.some((i: Lib.T.ExplorerItem) => i.id === elementToMove.id)) {
        return;
      }
    }
    else {
      if (elementToAppend.id === elementToMove.id) {
        return
      }
    }

    const newData = moveElementById(elementToMove, elementToAppend)
    if (!newData) {
      return throwError({
        fn: 'changeItemPosition',
        message: '!newData'
      })
    }

    addToStack(JSON.parse(newData))
  }



  const moveElementById = (elementToMove: object, elementToAppend: object, enabledRemove = true) => {
    if (!onDragEndInfo) {
      return throwError({
        message: '!onDragEndInfo',
        fn: 'moveElementById'
      })
    }

    const dataString = JSON.stringify(data)
    const objString = JSON.stringify(elementToMove)

    const removedDataString = removePrevData(objString, dataString);
    if (!removedDataString) {
      return throwError({
        message: '!removedDataString',
        fn: 'moveElementById'
      })
    }

    const appendedDataString = appendNewData(removedDataString, JSON.stringify(elementToAppend), objString)
    if (!appendedDataString) {
      return throwError({
        message: '!appendedDataString',
        fn: 'moveElementById'
      })
    }

    return appendedDataString
  }



  const appendNewData = (
    removedDataString: string,
    elementToAppend: string,
    elementToMove: string,
    customPosition?: Lib.T.Position
  ) => {
    const position = onDragEndInfo?.position || customPosition;

    if (!position) {
      return throwError({
        message: '!position',
        fn: 'appendNewData'
      })
    }

    let newData: string | undefined = undefined;

    switch (position) {
      case 'above':
        newData = removedDataString.replace(elementToAppend, elementToMove + ',' + elementToAppend)
        break;


      case 'into':
        const newElementToAppend = diagnoseJsonString(
          elementToAppend
            .replace(elementToMove, '')
            .replace(elementToMove + ',', '')
            .replace(',' + elementToMove, '')
        )

        const elementToAppendObj = <Lib.T.FolderProps>JSON.parse(newElementToAppend)
        elementToAppendObj.subItems.push(JSON.parse(elementToMove))

        if (!removedDataString.includes(newElementToAppend)) {
          return throwError({
            message: 'not included',
            fn: 'appendNewData'
          })
        }
        newData = removedDataString.replace(newElementToAppend, JSON.stringify(elementToAppendObj));
        break;


      case 'below':
        newData = removedDataString.replace(elementToAppend, elementToAppend + ',' + elementToMove)
        break;


      default:
        throwError({
          message: 'default',
          fn: 'appendNewData'
        })
    }

    return newData
  }



  const addNewItem = (name: string) => {
    const id = onAddNew(name, addNew);

    if (folderIdToAppendNew) {
      const elementToAppend = findNested(data, 'id', folderIdToAppendNew);
      const elementToMove = addNew === 'file'
        ? <Lib.T.FileProps>{ id, name, method: 'post' }
        : <Lib.T.FolderProps>{ id, name, subItems: [] }

      const newData = appendNewData(
        JSON.stringify(data),
        JSON.stringify(elementToAppend),
        JSON.stringify(elementToMove),
        'into'
      )

      if (!newData) {
        return throwError({
          message: '!newData',
          fn: 'addNewItem'
        })
      }

      addToStack(JSON.parse(newData))
    }
    else {
      if (addNew === 'file') {
        addToStack([...data, { id, name, method: 'post' }])
      }
      else if (addNew === 'folder') {
        addToStack([...data, { id, name, subItems: [] }])
      }
    }

    setAddNew(undefined)
  }



  const addToStack = (newData: (Lib.T.FileProps | Lib.T.FolderProps)[]) => {
    const newStack = [...stack.slice(0, stackPointer + 1), newData]
    setStack(newStack)
    setStackPointer(stackPointer + 1)
  }



  class Actions {
    static undo() {
      const prevPointer = stackPointer - 1
      if (stackPointer > 0) {
        setStackPointer(prevPointer)
      }
    }

    static redo() {
      const nextPointer = stackPointer + 1
      if (nextPointer < stack.length) {
        setStackPointer(nextPointer)
      }
    }

    static rename(rightClickedId?: string | number) {
      setItemIdToRename(rightClickedId || active || null)
    }

    static delete(rightClickedId?: string | number) {
      const id = rightClickedId || active;
      if (!id) { return }

      const item = findNested(data, 'id', id);
      if (!item) {
        return throwError({
          message: '!item',
          fn: 'Actions.delete'
        })
      }

      const dataString = JSON.stringify(data);

      const exactItem = findExactElement(dataString, JSON.stringify(item));
      if (!exactItem) { return }

      const newData = dataString.replace(exactItem, '');
      addToStack(JSON.parse(newData));
    }

    static copy(rightClickedId?: string | number) {
      setItemToCopyOrCut('copy', rightClickedId);
    }

    static cut(rightClickedId?: string | number) {
      setItemToCopyOrCut('cut', rightClickedId);
    }

    static paste(rightClickedId?: string | number) {
      if (!toCopyOrCut) { return }
      const { action } = toCopyOrCut;
      let item = toCopyOrCut.item;

      const idToAppend = rightClickedId || active;
      if (!idToAppend) { return }


      const itemObj = JSON.parse(item);
      const fileOrItem = itemObj.method ? 'file' : 'folder';

      let newData = JSON.stringify(data);
      let newId: string | number | null = null;

      if (action === 'cut') {
        const exactElement = findExactElement(newData, item);
        if (exactElement) {
          newData = newData.replace(exactElement, '');
        }
      }
      else {
        newId = onAddNew(itemObj.name, fileOrItem);
        itemObj.id = newId;
        item = JSON.stringify(itemObj)
      }


      const elementToAppend = findNested(data, 'id', idToAppend);

      if (elementToAppend && !elementToAppend.method) {
        const appendedData = appendNewData(newData, JSON.stringify(elementToAppend), item, 'into')
        if (!appendedData) {
          return throwError({
            message: '!appendedData',
            fn: 'Actions.paste'
          })
        }
        newData = diagnoseJsonString(appendedData)
        addToStack(JSON.parse(newData))

      }
      else {
        const { current: explorer } = explorerRef;
        if (!explorer) {
          return throwError({
            message: 'explorer not found',
            fn: 'Actions.paste'
          })
        }

        const activeItemContainer = <HTMLDivElement | null>explorer
          .querySelector('.details.true')?.parentNode?.parentNode?.parentNode;

        if (activeItemContainer) {
          const id = activeItemContainer.getAttribute('data-id');
          if (id) {
            const elementToAppend = findNested(data, 'id', parseFloat(id.toString()));
            if (elementToAppend && !elementToAppend.method) {
              const appendedData = appendNewData(newData, JSON.stringify(elementToAppend), item, 'into')
              if (!appendedData) {
                return throwError({
                  message: '!appendedData',
                  fn: 'Actions.paste'
                })
              }
              newData = diagnoseJsonString(appendedData)
              addToStack(JSON.parse(newData))
            }
            else {
              addToStack([...data, itemObj])
            }
          }
          else {
            addToStack([...data, itemObj])
          }
        }
        else {
          addToStack([...data, itemObj])
        }
      }
    }

    static newFile() {
      onHeader.addNew('file')
    }

    static newFolder() {
      onHeader.addNew('folder')
    }
  }



  const setItemToCopyOrCut = (action: Lib.T.ToCopyOrCutTypes, rightClickedId?: string | number) => {
    const id = rightClickedId || active
    if (!id) { return }

    const item = findNested(data, 'id', id);
    if (!item) {
      return throwError({
        message: '!item',
        fn: 'setItemToCopyOrCut'
      })
    }

    setToCopyOrCut({ item: JSON.stringify(item), action });
  }



  const onRename = (newName: string, prevName: string) => {
    const targetId = itemIdToRename;
    setItemIdToRename(null)
    const item = findNested(data, 'id', targetId);
    if (!item) {
      return throwError({
        message: '!item',
        fn: 'onRename'
      })
    }
    const newItem = JSON.stringify(item).replace(prevName, newName);
    const newData = JSON.stringify(data).replace(JSON.stringify(item), newItem);
    addToStack(JSON.parse(newData))
  }



  const onRenameBlur = (
    evt: React.FocusEvent<HTMLInputElement, Element>,
    prevName: string,
    setDefault: Dispatch<React.SetStateAction<string>>
  ) => {
    const newName = evt.currentTarget.value.trim()
    if (!newName) {
      setDefault(prevName)
      return setItemIdToRename(null)
    }

    if (newName !== prevName) {
      onRename(newName, prevName)
    }
    else {
      setDefault(prevName)
      setItemIdToRename(null)
    }
  }



  const onRenameKeyUp = (
    evt: React.KeyboardEvent<HTMLInputElement>,
    prevName: string,
    setDefault: Dispatch<React.SetStateAction<string>>
  ) => {
    const newName = evt.currentTarget.value.trim()

    if (evt.which === 27) {
      setDefault(prevName)
      return setItemIdToRename(null)
    }

    if (!newName && evt.which === 13) {
      setDefault(prevName)
      return setItemIdToRename(null)
    }

    if (evt.which === 13) {
      if (newName !== prevName) {
        onRename(newName, prevName)
      }
      else {
        setDefault(prevName)
        setItemIdToRename(null)
      }
    }
  }



  const shortcutHandler = (e: KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.which === 90 && e.ctrlKey && e.shiftKey) Actions.redo()
    else if (e.which === 90 && e.ctrlKey) Actions.undo()
    else if (e.which === 113) Actions.rename()
    else if (e.which === 46) Actions.delete()
    else if (e.which === 67 && e.ctrlKey) Actions.copy()
    else if (e.which === 88 && e.ctrlKey) Actions.cut()
    else if (e.which === 86 && e.ctrlKey) Actions.paste()
    else if (e.which === 78 && e.ctrlKey) Actions.newFile()
    else if (e.which === 78 && e.shiftKey) Actions.newFolder()
    else { }
  }



  const contextHandler = () => {
    if (!contextHandlerState) { return }
    switch (contextHandlerState.type) {
      case 'redo': return Actions.redo();
      case 'undo': return Actions.undo();
      case 'rename': return Actions.rename(contextHandlerState.id);
      case 'delete': return Actions.delete(contextHandlerState.id);
      case 'copy': return Actions.copy(contextHandlerState.id);
      case 'cut': return Actions.cut(contextHandlerState.id);
      case 'paste': return Actions.paste(contextHandlerState.id);
      case 'new-file': return Actions.newFile();
      case 'new-folder': return Actions.newFolder();
    }
  }



  const onBodyClick = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { classList } = <HTMLDivElement>evt.target
    if (classList.contains('body')) {
      setFolderIdToAppendNew(null)
    }
  }



  const onRightClickHandler = (
    evt: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: number | string,
    type: Lib.T.OnContextMenuPayloadTypes
  ) => {
    evt.preventDefault();
    evt.stopPropagation();

    if (onRightClick) {
      onRightClick(id, type, evt)
    }
  }



  const { on: onResize } = useResize(explorerRef, { width }, throwError)
  const { } = useIndents({ data, id, tabIndent })
  const { I: headerI, on: onHeader } = useHeader(collapsed, setCollapsed, setAddNew, addNewItem)
  useEffect(() => setData(stack[stackPointer]), [stackPointer])
  useEffect(contextHandler, [contextHandlerState])
  return {
    on: {
      ...onResize,
      ...onHeader,
      dragStart: onDragStart,
      dragEnd: onDragEnd,
      dragOver: onDragOver,
      dragLeave: onDragLeave,
      helpersDragEnd: onHelpersDragEnd,
      shortcutHandler: shortcutHandler,
      bodyClick: onBodyClick,
      rightClickHandler: onRightClickHandler,
      rename: { blur: onRenameBlur, keyUp: onRenameKeyUp }
    },
    I: {
      ...headerI,
      collapsed,
      data,
    },
    states: {
      addNew: { val: addNew, set: setAddNew },
      folderIdToAppendNew: { val: folderIdToAppendNew, set: setFolderIdToAppendNew },
      itemIdToRename: { val: itemIdToRename, set: setItemIdToRename },
      active: { val: active, set: setActive }
    }
  }
}











const useResize = (
  explorerRef: React.RefObject<HTMLDivElement>,
  { width }: Pick<Lib.T.Explorer, 'width'>,
  throwError: (error: Lib.T.ErrorThrowing) => void
) => {
  const onMouseDown = () => {
    const { current: explorer } = explorerRef;
    if (!explorer) {
      return throwError({
        message: 'explorer not found',
        fn: 'onMouseDown'
      })
    }

    document.body.style.cursor = 'col-resize';
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
  }



  const onMouseMove = useCallback((evt: MouseEvent) => {
    const { current: explorer } = explorerRef;
    if (!explorer) {
      return throwError({
        message: 'explorer not found',
        fn: 'onMouseMove'
      })
    }
    explorer.style.width = (evt.clientX - explorer.offsetLeft) + 'px';
  }, [])



  const onMouseUp = useCallback(() => {
    document.body.style.cursor = 'default';
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  }, [])



  const onDoubleClick = () => {
    const { current: explorer } = explorerRef;
    if (!explorer) {
      return throwError({
        message: 'explorer not found',
        fn: 'onDoubleClick'
      })
    }
    explorer.style.width = width || '250px'
  }



  return {
    on: {
      mouseDown: onMouseDown,
      doubleClick: onDoubleClick,
    }
  }
}



const useIndents = (
  { id, tabIndent = 15, data }: Pick<Lib.T.Explorer, | 'id' | 'tabIndent' | 'data'>
) => {
  const setIndent = (el: HTMLDivElement, flag: number) => {
    const children = <HTMLDivElement | null>el.querySelector('.children');
    if (!children) {
      return
    }
    const childrenDetailsParents = <NodeListOf<HTMLDivElement>>children.childNodes
    const childrenDetails: HTMLDivElement[] = []

    const guide = <HTMLSpanElement>children.querySelector('.guide')!;
    guide.style.left = flag - tabIndent + 4 + 'px'

    childrenDetailsParents.forEach(item => {
      const itemDetails = <HTMLDivElement | null>item.querySelector('.details');
      if (itemDetails) {
        childrenDetails.push(itemDetails)
      }
    })

    childrenDetails.forEach(item => {
      item.style.paddingLeft = flag + 'px';
      const itemParent = <HTMLDivElement>item.parentNode
      setIndent(itemParent, flag + tabIndent)
    })
  }



  const setIndents = () => {
    const explorerBody = <HTMLDivElement>document.getElementById(id)!.querySelector('.body')!;
    const items = <NodeListOf<HTMLDivElement>>explorerBody.childNodes;
    items.forEach(item => setIndent(item, tabIndent))
  }



  useEffect(setIndents, [data])
  return {}
}



const useHeader = (
  collapsed: boolean,
  setCollapsed: Dispatch<SetStateAction<boolean>>,
  setAddNew: Dispatch<SetStateAction<Lib.T.AddNewTypes>>,
  addNewItem: (name: string) => void
) => {
  const collapseAll = () => setCollapsed(!collapsed)



  const headerOptions: Lib.T.HeaderOption[] = [
    { name: 'reload', onClick: () => { }, size: 13 },
    { name: 'add-folder', onClick: () => onAddNew('folder'), size: 15 },
    { name: 'add-file', onClick: () => onAddNew('file'), size: 14 },
    { name: 'collapse', onClick: collapseAll, size: 13 },
  ]



  const onAddNew = (type: Lib.T.AddNewTypes) => {
    setAddNew(type)

    setTimeout(() => {
      const input = <HTMLInputElement>document.querySelectorAll('.enabled-item-adder input')[0]
      if (!input) { return }
      input.focus()
    }, 10);
  }



  const onInputBlur = (_evt: FocusEvent<HTMLInputElement, Element>) => {
    return setAddNew(undefined)
  }



  const onInputKeyUp = (evt: KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === 'Enter') {
      return addNewItem(evt.currentTarget.value)
    }
    if (evt.key === 'Escape') {
      return setAddNew(undefined)
    }
  }



  return {
    I: {
      headerOptions,
    },
    on: {
      addNew: onAddNew,
      adderInputBlur: onInputBlur,
      adderInputKeyUp: onInputKeyUp,
    }
  }
}
