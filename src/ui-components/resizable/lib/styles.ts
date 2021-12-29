import styled from "styled-components";
import * as Lib from '.';

export const Resizable = styled.div<Pick<Lib.T.Resizable, 'w' | 'h'>>`
  width: ${({ w }) => w!.default};
  min-width: ${({ w }) => w!.min};
  max-width: ${({ w }) => w!.max};

  height: ${({ h }) => h!.default};
  min-height: ${({ h }) => h!.min};
  max-height: ${({ h }) => h!.max};

  position: relative;
  float: left;

  .resizeHandler {
    position: absolute;
    background: transparent;
    z-index: 1;
    
    &.r {
      top: 0;
      bottom: 0;
      right: -5px;
      width: 10px;
      cursor: e-resize;
    }

    &.l {
      top: 0;
      bottom: 0;
      left: -5px;
      width: 10px;
      cursor: w-resize;
    }

    &.t {
      top: -5px;
      left: 0;
      right: 0;
      height: 10px;
      width: 100%;
      cursor: n-resize;
    }

    &.b {
      bottom: -5px;
      left: 0;
      right: 0;
      height: 10px;
      width: 100%;
      cursor: s-resize;
    }

    &.tr {
      top: -5px;
      right: -5px;
      width: 15px;
      height: 15px;
      cursor: ne-resize;
    }

    &.tl {
      top: -5px;
      left: -5px;
      width: 15px;
      height: 15px;
      cursor: nw-resize;
    }

    &.br {
      bottom: -5px;
      right: -5px;
      width: 15px;
      height: 15px;
      cursor: se-resize;
    }

    &.bl {
      bottom: -5px;
      left: -5px;
      width: 15px;
      height: 15px;
      cursor: sw-resize;
    }
  }
`;
