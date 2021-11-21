import styled from 'styled-components'
import * as Lib from '.';

export const Explorer = styled.div<
  Pick<
    Lib.T.Explorer,
    | 'maxWidth'
    | 'minWidth'
    | 'width'
    | 'height'
  >
  & {}>`

  width: ${({ width }) => width || '250px'};
  height: ${({ height }) => height || '100%'};
  min-width: ${({ minWidth }) => minWidth || '200px'};
  max-width: ${({ maxWidth }) => maxWidth || '500px'};
  background-color: #15181e;
  position: relative;
  padding: 0 5px 0 0;
  
  .resizeHandler {
    position: absolute;
    top: 0;
    bottom: 0;
    right: -5px;
    width: 10px;
    background: transparent;
    cursor: col-resize;
  }
`;
