import { Dispatch, DragEvent, FocusEvent, KeyboardEvent, SetStateAction, useCallback, useEffect, useState } from 'react'
import * as Lib from '.';
// @ts-ignore
import { findNested } from '../../../helpers'


const GHOST_CLASS_NAME = 'attornStudioDraggedItemGhostClassName'


export const useExplorer = (
  explorerRef: React.RefObject<HTMLDivElement>,
  { width, id, tabIndent = 15, data: explorerData, onAddNew }: Pick<
    Lib.T.Explorer,
    'width'
    | 'id'
    | 'tabIndent'
    | 'data'
    | 'onAddNew'
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
      console.log('not found', stringToFind, fullString)
      return null
    }
  }



  const removePrevData = (objString: string, dataString: string) => {
    const exactElement = findExactElement(dataString, objString);
    if (!exactElement) { return console.log('!exactElement') }
    return dataString.replace(exactElement, '');
  }







  const diagnoseJsonString = (jsonString: string) => {
    return jsonString
      .replace(/\[,{/g, '[{')
      .replace(/},]/g, '}]')
  }



  const changeItemPosition = () => {
    if (!draggedId || !onDragEndInfo) { return console.log('!draggedId || !onDragEndInfo)') }

    const elementToMove = findNested(data, 'id', draggedId)
    const elementToAppend = findNested(data, 'id', onDragEndInfo.id)

    if (!elementToMove || !elementToAppend) { return console.log('!elementToMove || !elementToAppend') }

    if (onDragEndInfo.position === 'into') {
      if (elementToAppend.subItems.some((i: Lib.T.ExplorerItem) => i.id === elementToMove.id)) {
        return console.log('included')
      }
    }
    else {
      if (elementToAppend.id === elementToMove.id) {
        return console.log('self')
      }
    }

    const newData = moveElementById(elementToMove, elementToAppend)
    if (!newData) { return console.log('!newData') }

    addToStack(JSON.parse(newData))
  }



  const moveElementById = (elementToMove: object, elementToAppend: object, enabledRemove = true) => {
    if (!onDragEndInfo) { return console.log('!onDragEndInfo') }

    const dataString = JSON.stringify(data)
    const objString = JSON.stringify(elementToMove)

    const removedDataString = removePrevData(objString, dataString);
    if (!removedDataString) { return console.log('!removedDataString') }

    const appendedDataString = appendNewData(removedDataString, JSON.stringify(elementToAppend), objString)
    if (!appendedDataString) { return console.log('!appendedDataString') }

    return appendedDataString
  }






  const appendNewData = (
    removedDataString: string,
    elementToAppend: string,
    elementToMove: string,
    customPosition?: Lib.T.Position
  ) => {
    const position = onDragEndInfo?.position || customPosition;

    if (!position) { return console.log('!position') }

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
        if (!removedDataString.includes(newElementToAppend)) { return console.log('not included') }
        newData = removedDataString.replace(newElementToAppend, JSON.stringify(elementToAppendObj));
        break;
      case 'below':
        newData = removedDataString.replace(elementToAppend, elementToAppend + ',' + elementToMove)
        break;
      default:
        console.log('default')
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

      if (!newData) { return console.log('!newDate') }

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


  const undo = () => {
    const prevPointer = stackPointer - 1
    if (stackPointer > 0) {
      setStackPointer(prevPointer)
    }
  }


  const redo = () => {
    const nextPointer = stackPointer + 1
    if (nextPointer < stack.length) {
      setStackPointer(nextPointer)
    }
  }


  const onUndoOrRedo = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.which === 90 && e.ctrlKey && e.shiftKey) redo()
    else if (e.which === 90 && e.ctrlKey) undo()
  }


  const onBodyClick = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { classList } = <HTMLDivElement>evt.target

    if (classList.contains('body')) {
      setFolderIdToAppendNew(null)
    }
  }


  const { on: onResize } = useResize(explorerRef, { width })
  const { } = useIndents({ data, id, tabIndent })
  const { I: headerI, on: onHeader } = useHeader(collapsed, setCollapsed, setAddNew, addNewItem)
  useEffect(() => setData(stack[stackPointer]), [stackPointer])
  return {
    on: {
      ...onResize,
      ...onHeader,
      dragStart: onDragStart,
      dragEnd: onDragEnd,
      dragOver: onDragOver,
      dragLeave: onDragLeave,
      helpersDragEnd: onHelpersDragEnd,
      undoOrRedo: onUndoOrRedo,
      bodyClick: onBodyClick
    },
    I: {
      ...headerI,
      collapsed,
      data,
    },
    states: {
      addNew: { val: addNew, set: setAddNew },
      folderIdToAppendNew: { val: folderIdToAppendNew, set: setFolderIdToAppendNew }
    }
  }
}











const useResize = (
  explorerRef: React.RefObject<HTMLDivElement>,
  { width }: Pick<Lib.T.Explorer, 'width'>
) => {
  const onMouseDown = () => {
    const { current: explorer } = explorerRef;
    if (!explorer) { return console.log('explorer not found') }

    document.body.style.cursor = 'col-resize';
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
  }

  const onMouseMove = useCallback((evt: MouseEvent) => {
    const { current: explorer } = explorerRef;
    if (!explorer) { return console.log('explorer not found') }
    explorer.style.width = (evt.clientX - explorer.offsetLeft) + 'px';
  }, [])

  const onMouseUp = useCallback(() => {
    document.body.style.cursor = 'default';
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  }, [])

  const onDoubleClick = () => {
    const { current: explorer } = explorerRef;
    if (!explorer) { return console.log('explorer not found') }
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
