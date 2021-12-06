// MIT License
//
// Copyright (c) 2021 Attorn Studio by qafoori
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import {
  Dispatch,
  DragEvent,
  FocusEvent,
  KeyboardEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from 'react'
import * as Lib from '.';
// @ts-ignore
import { findNested } from '../../../helpers'


const GHOST_CLASS_NAME = 'attornStudioDraggedItemGhostClassName'


export const useExplorer = (
  explorerRef: React.RefObject<HTMLDivElement>,
  {
    width, tabIndent = 15, data: explorerData, onAddNew, beforeDelete,
    onRightClick, contextHandlerState, onErrors, onChangeItems, onReload
  }:
    Pick<
      Lib.T.Explorer,
      | 'width'
      | 'tabIndent'
      | 'data'
      | 'onAddNew'
      | 'onRightClick'
      | 'contextHandlerState'
      | 'onErrors'
      | 'onChangeItems'
      | 'beforeDelete'
      | 'onReload'
    >
) => {
  const [addNew, setAddNew] = useState<Lib.T.AddNewTypes>(undefined)
  const [collapsed, setCollapsed] = useState<boolean>(true)
  const [onDragEndInfo, setOnDragEndInfo] = useState<Lib.T.OnDragEndInfo>()
  const [draggedId, setDraggedID] = useState<number | string>()
  const [data, setData] = useState<(Lib.T.FileProps | Lib.T.FolderProps)[]>(explorerData)
  const [stack, setStack] = useState<(Lib.T.FileProps | Lib.T.FolderProps)[][]>([explorerData])
  const [timingStack, setTimingStack] = useState<Lib.T.OnChangeMethods[]>([])
  const [stackPointer, setStackPointer] = useState<number>(0)
  const [folderIdToAppendNew, setFolderIdToAppendNew] = useState<string | number | null>(null)
  const [itemIdToRename, setItemIdToRename] = useState<string | number | null>(null)
  const [active, setActive] = useState<number | string | null>(null);
  const [toCopyOrCut, setToCopyOrCut] = useState<Lib.T.ToCopyOrCut>(null);
  const [parentIdOnCopyOrCut, setParentIdOnCopyOrCut] = useState<number | string | null | 'root'>(null)
  const [pasteEnabled, setPasteEnabled] = useState<boolean>(false);
  const [timingEnabled, setTimingEnabled] = useState<Lib.T.TimingEnabled>({ undo: false, redo: false })
  const [rightClickPosition, setRightClickPosition] = useState<Lib.T.OnContextMenuPayloadTypes | null>(null)

  const throwError = (error: Lib.T.ErrorThrowing) => {
    if (onErrors) {
      onErrors(error)
    }
  }


  const throwChange = (
    method: Lib.T.OnChangeMethods,
    newList: (Lib.T.FileProps | Lib.T.FolderProps)[],
    setTiming: boolean = true
  ) => {
    if (onChangeItems) {
      onChangeItems(method, newList)
      if (setTiming) {
        setTimingStack([...timingStack, method])
      }
    }
  }



  const timingDetector = (method: Lib.T.OnChangeMethods, timing: 'undo' | 'redo') => {
    if (!method) {
      return
    }
    const newList = stack[stackPointer - 1] || stack[stackPointer + 1];

    if ('copy' in method) {
      if (timing === 'undo') {
        throwChange({ delete: method.newId }, newList, false);
      }
      else {
        throwChange({ restore: method.newId }, newList, false);
      }
    }
    else if ('cut' in method) {
      const { cut, into, from } = method;
      if (timing === 'undo') {
        throwChange({ cut, from: into, into: from }, newList, false);
      }
      else {
        throwChange({ cut, from, into }, newList, false);
      }
    }
    else if ('newFile' in method) {
      if (timing === 'undo') {
        throwChange({ delete: method.newFile.id }, newList, false);
      }
      else {
        throwChange({ restore: method.newFile.id }, newList, false);
      }
    }
    else if ('newFolder' in method) {
      if (timing === 'undo') {
        throwChange({ delete: method.newFolder.id }, newList, false);
      }
      else {
        throwChange({ restore: method.newFolder.id }, newList, false);
      }
    }
    else if ('delete' in method) {
      if (timing === 'undo') {
        throwChange({ restore: method.delete }, newList, false);
      }
      else {
        throwChange({ delete: method.delete }, newList, false)
      }
    }
    else if ('rename' in method) {
      const { from, rename, to } = method;
      if (timing === 'undo') {
        throwChange({ rename, to: from, from: to }, newList, false);
      }
      else {
        throwChange({ rename, to, from }, newList, false);
      }
    }
    else if ('move' in method) {
      throwChange({ move: true }, newList, false);
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



  const onDragEnd = (_evt: DragEvent<HTMLDivElement>) => {
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
      ?.replace(/\[,{/g, '[{')
      ?.replace(/},]/g, '}]')
      ?.replace(/,,/g, ',')
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

    const newList = JSON.parse(diagnoseJsonString(newData));

    addToStack(newList)
    throwChange({ move: true }, newList);
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
            ?.replace(elementToMove ?? '', '')
            ?.replace(elementToMove ?? '' + ',', '')
            ?.replace((',' + elementToMove) ?? '', '')
        )

        const elementToAppendObj = <Lib.T.FolderProps>JSON.parse(diagnoseJsonString(newElementToAppend))
        elementToAppendObj.subItems.push(JSON.parse(diagnoseJsonString(elementToMove)))

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



  const addNewItem = async (name: string) => {
    const id = await onAddNew(name, addNew);

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

      const parsedNewData = JSON.parse(diagnoseJsonString(newData))
      addToStack(parsedNewData)

      if (addNew === 'file') {
        throwChange({ newFile: <Lib.T.FileProps>elementToMove, into: folderIdToAppendNew }, parsedNewData)
      }
      else {
        throwChange({ newFolder: <Lib.T.FolderProps>elementToMove, into: folderIdToAppendNew }, parsedNewData)
      }
    }
    else {
      if (addNew === 'file') {
        const newFile: Lib.T.FileProps = { id, name, method: 'post' }
        const newList = [...data, newFile]
        addToStack(newList)
        throwChange({ newFile, into: 'root' }, newList)

      }
      else if (addNew === 'folder') {
        const newFolder: Lib.T.FolderProps = { id, name, subItems: [] };
        const newList = [...data, newFolder];
        addToStack(newList)
        throwChange({ newFolder, into: 'root' }, newList)

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
        timingDetector(timingStack[prevPointer], 'undo')
      }
    }

    static redo() {
      const nextPointer = stackPointer + 1
      if (nextPointer < stack.length) {
        setStackPointer(nextPointer)
        timingDetector(timingStack[stackPointer], 'redo')
      }
    }

    static rename(rightClickedId?: string | number) {
      setItemIdToRename(rightClickedId || active || null)
    }

    static delete(rightClickedId?: string | number) {
      let flag = true;
      const id = rightClickedId || active;
      if (!id) { return }

      const item = findNested(data, 'id', id);
      if (!item) { return }

      if (beforeDelete) {
        flag = beforeDelete(id, item.name, item.method ? 'file' : 'folder');
      }

      if (flag) {
        const dataString = JSON.stringify(data);

        const exactItem = findExactElement(dataString, JSON.stringify(item));
        if (!exactItem) {
          return throwError({
            message: '!exactItem',
            fn: 'Actions.delete'
          })
        }

        const newData = dataString.replace(exactItem, '');
        const parsedNewData = JSON.parse(diagnoseJsonString(newData));

        addToStack(parsedNewData);
        throwChange({ delete: id }, parsedNewData)
      }
    }

    static copy(rightClickedId?: string | number) {
      setItemToCopyOrCut('copy', rightClickedId);
    }

    static cut(rightClickedId?: string | number) {
      setItemToCopyOrCut('cut', rightClickedId);
    }

    static async paste(rightClickedId?: string | number) {
      if (!toCopyOrCut) { return }

      const { action } = toCopyOrCut;
      let item = toCopyOrCut.item;

      const itemObj = JSON.parse(diagnoseJsonString(item));
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
        newId = await onAddNew(itemObj.name, fileOrItem);
        itemObj.id = newId;
        item = JSON.stringify(itemObj)
      }

      const pasteCatch = () => {
        const { current: explorer } = explorerRef;
        if (!explorer) {
          return throwError({
            message: 'explorer not found',
            fn: 'Actions.paste'
          })
        }

        const activeItemContainer = <HTMLDivElement | null>explorer
          .querySelector('.details.true')?.parentNode?.parentNode?.parentNode;

        const dealWithRoot = () => {
          const newList = [...JSON.parse(diagnoseJsonString(newData)), itemObj]
          addToStack(newList)

          if (action === 'copy') {
            throwChange({ copy: JSON.parse(diagnoseJsonString(toCopyOrCut.item)).id, newId: itemObj.id, into: 'root' }, newList)
          }
          else {
            throwChange({ cut: itemObj.id, into: 'root', from: parentIdOnCopyOrCut! }, newList)
            setToCopyOrCut(null)
          }
        }


        if (activeItemContainer) {
          const id = activeItemContainer.getAttribute('data-id');

          if (id) {
            const elementToAppend = findNested(data, 'id', id.toString());

            if (elementToAppend && !elementToAppend.method) {
              const appendedData = appendNewData(newData, JSON.stringify(elementToAppend), item, 'into')
              if (!appendedData) {
                return throwError({
                  message: '!appendedData',
                  fn: 'Actions.paste'
                })
              }
              newData = diagnoseJsonString(appendedData)
              const parsedNewData = JSON.parse(diagnoseJsonString(newData));
              addToStack(parsedNewData)

              if (action === 'copy') {
                throwChange({ copy: JSON.parse(diagnoseJsonString(toCopyOrCut.item)).id, newId: itemObj.id, into: id }, parsedNewData)
              }
              else {
                throwChange({ cut: itemObj.id, into: id, from: parentIdOnCopyOrCut! }, parsedNewData)
                setToCopyOrCut(null)
              }
            }


            else {
              dealWithRoot()
            }
          }
          else {
            dealWithRoot()
          }
        }
        else {
          dealWithRoot()
        }
      }

      if (rightClickPosition !== 'whiteArea') {
        const idToAppend = rightClickedId || active;
        if (!idToAppend) { return }
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
          const parsedNewData = JSON.parse(diagnoseJsonString(newData))

          addToStack(parsedNewData)
          if (action === 'copy') {
            throwChange({ copy: JSON.parse(diagnoseJsonString(toCopyOrCut.item)).id, newId: itemObj.id, into: idToAppend }, parsedNewData)
          }
          else {
            throwChange({ cut: itemObj.id, into: idToAppend, from: parentIdOnCopyOrCut! }, parsedNewData)
            setToCopyOrCut(null)
          }
        }
        else {
          if (!elementToAppend.method) {
            throwError({
              message: '!elementToAppend.method',
              fn: 'Actions.paste'
            })
          }
          else {
            pasteCatch()
          }
        }
      }
      else {
        pasteCatch()
      }
      removeCut();
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

    const { current: explorer } = explorerRef;
    if (!explorer) {
      return throwError({
        message: 'explorer not found',
        fn: 'setItemToCopyOrCut'
      })
    }

    const item = findNested(data, 'id', id);
    if (!item) {
      return throwError({
        message: '!item',
        fn: 'setItemToCopyOrCut'
      })
    }

    setToCopyOrCut({ item: JSON.stringify(item), action });

    if (onChangeItems) {
      const thisElement = <HTMLDivElement | null>explorer.querySelector(`div[data-id="${id}"]`);

      if (!thisElement) {
        return throwError({
          message: '!thisElement',
          fn: 'setItemToCopyOrCut'
        })
      }

      const parent = <HTMLDivElement | null>thisElement.parentNode?.parentNode;
      const parentId = parent?.getAttribute('data-id');

      if (parentId) {
        setParentIdOnCopyOrCut(parentId)
      }
      else if (parent?.classList.contains('bodyChild')) {
        setParentIdOnCopyOrCut('root');
      }
      else {
        setParentIdOnCopyOrCut(null)
      }
    }
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
    const parsedNewData = JSON.parse(diagnoseJsonString(newData));

    addToStack(parsedNewData)
    throwChange({ rename: targetId!, to: newName, from: prevName }, parsedNewData)
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


  const removeCut = () => {
    const { current: explorer } = explorerRef;
    if (!explorer) {
      return throwError({
        message: 'explorer not found',
        fn: 'Actions.paste'
      })
    }
    explorer.querySelectorAll('.cut').forEach(item => item.classList.remove('cut'));
  }



  const onEscExplorer = () => {
    setToCopyOrCut(null);
    removeCut();
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
    else if (e.which === 27) onEscExplorer()
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



  const onCopyOrCut = () => {
    if (toCopyOrCut) {
      setPasteEnabled(true)

      if (toCopyOrCut.action === 'cut') {
        const { current: explorer } = explorerRef;
        if (!explorer) {
          return throwError({
            message: 'explorer not found',
            fn: 'onCopyOrCut'
          })
        }

        const item = <Lib.T.FileProps | Lib.T.FolderProps>JSON.parse(diagnoseJsonString(toCopyOrCut.item));
        const cutItem = <HTMLDivElement | null>explorer.querySelector(`div[data-id="${item.id}"]`)

        if (!cutItem) {
          return throwError({
            message: '!cutItem',
            fn: 'onCopyOrCut'
          });
        }

        cutItem.classList.add('cut');
      }
    }
    else {
      setPasteEnabled(false)
    }
  }


  const onRightClickHandler = (
    evt: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: number | string,
    type: Lib.T.OnContextMenuPayloadTypes
  ) => {
    evt.preventDefault();
    evt.stopPropagation();

    setRightClickPosition(type);

    if (onRightClick) {
      const tempTimingEnabled: Lib.T.TimingEnabled = {
        undo: stackPointer > 0,
        redo: stackPointer + 1 < stack.length
      }

      setTimingEnabled(tempTimingEnabled);
      onRightClick(id, type, evt, pasteEnabled, tempTimingEnabled);
    }

    if (onChangeItems) {
      const parent = <HTMLDivElement | null>evt.currentTarget.parentNode?.parentNode;
      const parentID = parent?.getAttribute('data-id');

      if (parentID) {
        setParentIdOnCopyOrCut(parentID)
      }
      else if (parent?.classList.contains('bodyChild')) {
        setParentIdOnCopyOrCut('root');
      }
      else {
        setParentIdOnCopyOrCut(null)
      }
    }
  }



  const onStackPointerChange = () => {
    setData(stack[stackPointer]);
  }



  const { on: onResize } = useResize(explorerRef, { width }, throwError)
  const { } = useIndents(explorerRef, { data, tabIndent }, throwError)
  const { I: headerI, on: onHeader } = useHeader(collapsed, setCollapsed, setAddNew, addNewItem, throwError, explorerRef, onReload)
  useEffect(onStackPointerChange, [stackPointer])
  useEffect(onCopyOrCut, [toCopyOrCut])
  useEffect(() => { (async () => contextHandler())() }, [contextHandlerState])
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
      active: { val: active, set: setActive },
      pasteEnabled: { val: pasteEnabled, set: setPasteEnabled },
      timingEnabled: { val: timingEnabled, set: setTimingEnabled }
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
  explorerRef: React.RefObject<HTMLDivElement>,
  { tabIndent = 15, data }: Pick<Lib.T.Explorer, 'tabIndent' | 'data'>,
  throwError: (error: Lib.T.ErrorThrowing) => void
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
    const { current: explorer } = explorerRef
    if (!explorer) {
      throwError({
        message: 'explorer not found',
        fn: 'setIndents'
      })
    }
    const explorerBody = <HTMLDivElement>explorer?.querySelector('.bodyChild > div')
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
  addNewItem: (name: string) => void,
  throwError: (error: Lib.T.ErrorThrowing) => void,
  explorerRef: React.RefObject<HTMLDivElement>,
  onReload?: () => void
) => {
  const collapseAll = () => setCollapsed(!collapsed)



  const headerOptions: Lib.T.HeaderOption[] = [
    { name: 'reload', onClick: () => { if (onReload) onReload() }, size: 13 },
    { name: 'add-folder', onClick: () => onAddNew('folder'), size: 15 },
    { name: 'add-file', onClick: () => onAddNew('file'), size: 14 },
    { name: 'collapse', onClick: collapseAll, size: 13 },
  ]



  const onAddNew = (type: Lib.T.AddNewTypes) => {
    const { current: explorer } = explorerRef;
    if (!explorer) {
      throwError({
        message: 'explorer not found',
        fn: 'addNewItem'
      })
    }

    const scrollSection = <HTMLDivElement | null>explorer?.querySelector('.bodyChild > div:nth-child(1)')
    if (scrollSection) {
      setTimeout(() => scrollSection.scrollLeft = 0, 35);
    }

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
