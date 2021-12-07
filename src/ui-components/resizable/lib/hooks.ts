import { useRef, useCallback } from 'react';
import * as Lib from '.';

export const useResize = ({
  w, h
}: Pick<Lib.T.Resizable, 'w' | 'h'>) => {

  const resizableRef = useRef<HTMLDivElement>(null);


  const width: Lib.T.Size = {
    default: w?.default || '200px',
    max: w?.max || '300px',
    min: w?.min || '100px'
  }

  const height: Lib.T.Size = {
    default: h?.default || '200px',
    max: h?.max || '300px',
    min: h?.min || '100px'
  }




  const onMouseDown = () => {
    document.body.style.cursor = 'col-resize';
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
  }



  const onMouseMove = useCallback((evt: MouseEvent) => {
    const { current: resizable } = resizableRef;
    resizable!.style.width = (evt.clientX - resizable!.offsetLeft) + 'px';
  }, [])



  const onMouseUp = useCallback(() => {
    document.body.style.cursor = 'default';
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  }, [])



  const onDoubleClick = () => {
    const { current: resizable } = resizableRef;
    resizable!.style.width = width.default!
  }



  return {
    on: {
      mouseDown: onMouseDown,
      doubleClick: onDoubleClick,
    },
    resizableRef,
    sizes: { w: width, h: height }
  }
}
