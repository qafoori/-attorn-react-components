import { useCallback } from 'react'
import * as Lib from '.';


export const useExplorer = (
  explorerRef: React.RefObject<HTMLDivElement>,
  { width }: Pick<Lib.T.Explorer, 'width'>
) => {
  let calculatedOffset: number;

  const onMouseDown = (evt: Lib.T.ExplorerEvent) => {
    const { current: explorer } = explorerRef;
    if (!explorer) { return }
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
    if (!explorer) { return }
    explorer.style.width = (evt.clientX - calculatedOffset - explorer.offsetLeft) + 'px';
  }, [])


  const onMouseUp = useCallback(() => {
    document.body.style.cursor = 'default';
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  }, [])


  const onDoubleClick = () => {
    const { current: explorer } = explorerRef;
    if (!explorer) { return }
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
