import styled from 'styled-components'
import * as Lib from '.';

export const Explorer = styled.div<
  Pick<
    Lib.T.Explorer,
    'height'
    | 'maxHeight'
    | 'maxWidth'
    | 'minHeight'
    | 'minWidth'
    | 'width'
  >
  & {}>`

  width: ${({ width }) => width || '200px'};
  height: ${({ height }) => height || '100%'};
  min-height: ${({ minHeight: MH }) => MH || '100%'};
  background-color: #15181e;
`;
