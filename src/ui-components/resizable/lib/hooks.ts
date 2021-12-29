import { useRef, useCallback } from 'react';
import * as Lib from '.';

export const useResize = ({ w, h }: Pick<Lib.T.Resizable, 'w' | 'h'>) => {
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

  let handler: 't' | 'r' | 'b' | 'l' | 'tr' | 'tl' | 'br' | 'bl' | null = null;

  const checkHandler = (evt: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const { classList } = <HTMLSpanElement>evt.target;
    const { style } = document.body;
    if (classList.contains('t')) {
      handler = 't';
      style.cursor = 'n-resize';
    }
    else if (classList.contains('r')) {
      handler = 'r';
      style.cursor = 'e-resize';
    }
    else if (classList.contains('b')) {
      handler = 'b';
      style.cursor = 's-resize';
    }
    else if (classList.contains('l')) {
      handler = 'l';
      style.cursor = 'w-resize';
    }
    else if (classList.contains('tr')) {
      handler = 'tr';
      style.cursor = 'ne-resize';
    }
    else if (classList.contains('tl')) {
      handler = 'tl';
      style.cursor = 'nw-resize';
    }
    else if (classList.contains('br')) {
      handler = 'br';
      style.cursor = 'se-resize';
    }
    else if (classList.contains('bl')) {
      handler = 'bl';
      style.cursor = 'sw-resize';
    }
  }

  const onMouseDown = (evt: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    checkHandler(evt);
    if (handler === 't' || handler === 'b') {
      document.body.style.cursor = 'row-resize';
    }
    else {
      document.body.style.cursor = 'col-resize';
    }
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
  }

  const onMouseMove = useCallback((evt: MouseEvent) => {
    const { current: resizable } = resizableRef;
    const style = window.getComputedStyle(resizable!)
    const args: Lib.T.ResizeArgs = { resizable, evt, style };
    switch (handler) {
      case 'l': resizeL(args); break;
      case 'r': resizeR(args); break;
      case 't': resizeT(args); break;
      case 'b': resizeB(args); break;
      case 'tr': resizeT(args); resizeR(args); break;
      case 'tl': resizeT(args); resizeL(args); break;
      case 'br': resizeB(args); resizeR(args); break;
      case 'bl': resizeB(args); resizeL(args); break;
    }
  }, []);


  const resizeL = ({ evt, resizable, style }: Lib.T.ResizeArgs) => {
    resizable!.style.width = (resizable!.offsetLeft - evt.clientX + parseInt(style.width)) + 'px';
  }

  const resizeR = ({ evt, resizable }: Lib.T.ResizeArgs) => {
    resizable!.style.width = (evt.clientX - resizable!.offsetLeft) + 'px';
  }

  const resizeT = ({ evt, resizable, style }: Lib.T.ResizeArgs) => {
    resizable!.style.height = (resizable!.offsetTop - evt.clientY + parseInt(style.height)) + 'px';
  }

  const resizeB = ({ evt, resizable }: Lib.T.ResizeArgs) => {
    resizable!.style.height = (evt.clientY - resizable!.offsetTop) + 'px';
  }

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
