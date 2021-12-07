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
    top: 0;
    bottom: 0;
    right: -5px;
    width: 10px;
    background: transparent;
    cursor: col-resize;
    z-index: 1;
  }
`;
