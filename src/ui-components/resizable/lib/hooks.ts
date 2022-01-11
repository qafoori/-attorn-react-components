import { useRef, useCallback } from 'react';
import * as Lib from '.';

export const useResize = ({ w, h, setSize }: Pick<Lib.T.Resizable, 'w' | 'h' | 'setSize'>) => {
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

  class Handler {
    resizable = <HTMLDivElement>resizableRef.current;
    attr = 'data-active-handler';
    get(): Lib.T.Direction {
      return <Lib.T.Direction>this.resizable.getAttribute(this.attr) || 'none';
    }
    set(direction: Lib.T.Direction) {
      this.resizable.setAttribute(this.attr, direction);
    }
  }

  const checkHandler = (evt: React.MouseEvent<HTMLSpanElement, MouseEvent>): Lib.T.Direction => {
    const { classList } = <HTMLSpanElement>evt.target;
    const { style } = document.body;
    const handler = new Handler();
    if (classList.contains('t')) {
      style.cursor = 'n-resize';
      handler.set('t');
      return 't';
    }
    else if (classList.contains('r')) {
      style.cursor = 'e-resize';
      handler.set('r');
      return 'r';
    }
    else if (classList.contains('b')) {
      style.cursor = 's-resize';
      handler.set('b');
      return 'b';
    }
    else if (classList.contains('l')) {
      style.cursor = 'w-resize';
      handler.set('l');
      return 'l';
    }
    else if (classList.contains('tr')) {
      style.cursor = 'ne-resize';
      handler.set('tr');
      return 'tr';
    }
    else if (classList.contains('tl')) {
      style.cursor = 'nw-resize';
      handler.set('tl');
      return 'tl';
    }
    else if (classList.contains('br')) {
      style.cursor = 'se-resize';
      handler.set('br');
      return 'br';
    }
    else if (classList.contains('bl')) {
      style.cursor = 'sw-resize';
      handler.set('bl');
      return 'bl';
    }
    else {
      style.cursor = 'default';
      handler.set('none');
      return 'none';
    }
  }

  const onMouseDown = (evt: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    checkHandler(evt);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
  }

  const onMouseMove = useCallback((evt: MouseEvent) => {
    const { current: resizable } = resizableRef;
    const style = window.getComputedStyle(resizable!)
    const args: Lib.T.ResizeArgs = { resizable, evt, style };
    const handler = new Handler();
    switch (handler.get()) {
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

  const dispatchSize = (dir: 'w' | 'h') => {
    const { current: resizable } = resizableRef;
    const style = window.getComputedStyle(resizable!)
    if (dir == 'w') {
      if (setSize && setSize.w) {
        setSize.w(style.width);
      }
    }
    else {
      if (setSize && setSize.h) {
        setSize.h(style.height);
      }
    }
  }

  const resizeL = ({ evt, resizable, style }: Lib.T.ResizeArgs) => {
    const newSize = resizable!.offsetLeft - evt.clientX + parseInt(style.width);
    resizable!.style.width = newSize + 'px';
    dispatchSize('w');
  }

  const resizeR = ({ evt, resizable }: Lib.T.ResizeArgs) => {
    const newSize = evt.clientX - resizable!.offsetLeft;
    resizable!.style.width = newSize + 'px';
    dispatchSize('w');
  }

  const resizeT = ({ evt, resizable, style }: Lib.T.ResizeArgs) => {
    const newSize = resizable!.offsetTop - evt.clientY + parseInt(style.height);
    resizable!.style.height = newSize + 'px';
    dispatchSize('h');
  }

  const resizeB = ({ evt, resizable }: Lib.T.ResizeArgs) => {
    const newSize = evt.clientY - resizable!.offsetTop;
    resizable!.style.height = newSize + 'px';
    dispatchSize('h');

  }

  const onMouseUp = useCallback(() => {
    document.body.style.cursor = 'default';
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  }, [])

  const onDoubleClick = () => {
    const { current: resizable } = resizableRef;
    resizable!.style.width = width.default!;
    dispatchSize('h')
    dispatchSize('w')
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
