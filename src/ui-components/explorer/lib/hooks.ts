import { useCallback, useEffect } from 'react'
import * as Lib from '.';


export const useExplorer = (
  explorerRef: React.RefObject<HTMLDivElement>,
  { width, id }: Pick<Lib.T.Explorer, 'width' | 'id'>
) => {



  const indent = 15;

  const setIndent = (el: HTMLDivElement, flag: number) => {
    const children = <HTMLDivElement | null>el.querySelector('.children');
    if (!children) {
      return
    }
    const childrenDetailsParents = <NodeListOf<HTMLDivElement>>children.childNodes
    const childrenDetails: HTMLDivElement[] = []

    const guide = <HTMLSpanElement>children.querySelector('.guide')!;
    guide.style.left = flag - indent + 4 + 'px'


    childrenDetailsParents.forEach(item => {
      const itemDetails = <HTMLDivElement | null>item.querySelector('.details');
      if (itemDetails) {
        childrenDetails.push(itemDetails)
      }
    })

    childrenDetails.forEach(item => {
      item.style.paddingLeft = flag + 'px';
      const itemParent = <HTMLDivElement>item.parentNode
      setIndent(itemParent, flag + indent)
    })
  }


  const setIndents = () => {
    const explorerBody = <HTMLDivElement>document.getElementById(id)!.querySelector('.body')!;
    const items = <NodeListOf<HTMLDivElement>>explorerBody.childNodes;
    items.forEach(item => setIndent(item, indent))
  }




  useEffect(setIndents, [])










  
  let calculatedOffset: number;

  const onMouseDown = (evt: Lib.T.ExplorerEvent) => {
    const { current: explorer } = explorerRef;
    if (!explorer) { return console.log('explorer not found') }
    calculatedOffset = evt.clientX - (
      explorer.offsetLeft + parseInt(
        window.getComputedStyle(explorer).getPropertyValue('width')
      )
    );

    document.body.style.cursor = 'col-resize';
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
  }


  const onMouseMove = useCallback((evt: MouseEvent) => {
    const { current: explorer } = explorerRef;
    if (!explorer) { return console.log('explorer not found') }

    console.log(calculatedOffset)


    explorer.style.width = (evt.clientX - calculatedOffset - explorer.offsetLeft) + 'px';
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


  const headerOptions: Lib.T.HeaderOption[] = [
    { name: 'reload', onClick: () => { }, size: 13 },
    { name: 'add-folder', onClick: () => { }, size: 15 },
    { name: 'add-file', onClick: () => { }, size: 14 },
    { name: 'collapse', onClick: () => { }, size: 13 },
  ]

  return {
    on: {
      mouseDown: onMouseDown,
      doubleClick: onDoubleClick,
    },
    I: {
      headerOptions
    }
  }
}
