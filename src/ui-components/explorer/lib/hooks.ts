import { Dispatch, DragEvent, SetStateAction, useCallback, useEffect, useState } from 'react'
import * as Lib from '.';


const GHOST_CLASS_NAME = 'attornStudioDraggedItemGhostClassName'


export const useExplorer = (
  explorerRef: React.RefObject<HTMLDivElement>,
  { width, id, tabIndent = 15 }: Pick<Lib.T.Explorer, 'width' | 'id' | 'tabIndent'>
) => {
  const [collapsed, setCollapsed] = useState<boolean>(true);

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



  const collapseAll = () => {
    setCollapsed(!collapsed)
  }



  const headerOptions: Lib.T.HeaderOption[] = [
    { name: 'reload', onClick: () => { }, size: 13 },
    { name: 'add-folder', onClick: () => { }, size: 15 },
    { name: 'add-file', onClick: () => { }, size: 14 },
    { name: 'collapse', onClick: collapseAll, size: 13 },
  ]


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





  const onDragStart = (evt: DragEvent<HTMLDivElement>, name: string) => {
    createGhost(name, evt)
  }

  const onDragEnd = (evt: DragEvent<HTMLDivElement>) => {
    removeGhosts()
  }

  const onDragOver = (evt: DragEvent<HTMLSpanElement>) => {
    const { classList } = evt.currentTarget

    if (classList.contains('top')) {
      evt.currentTarget.style.borderTop = '1px solid red'
    }
    else if (classList.contains('center')) {

    }
    else {
      evt.currentTarget.style.borderBottom = '1px solid red'
    }
  }

  useEffect(setIndents, [])
  return {
    on: {
      mouseDown: onMouseDown,
      doubleClick: onDoubleClick,
      dragStart: onDragStart,
      dragEnd: onDragEnd,
      dragOver: onDragOver
    },
    I: {
      headerOptions,
      collapsed
    }
  }
}
