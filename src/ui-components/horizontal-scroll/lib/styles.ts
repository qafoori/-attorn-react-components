import styled from "styled-components";
import * as Lib from '.';

export const HorizontalScroll = styled.div<Pick<Lib.T.HorizontalScrollProps, 'childrenComponent' | 'scrollbar'>>`
  width: auto;
  height: auto;
  display: flex;
  overflow: auto;

  > ${({ childrenComponent }) => childrenComponent} {
    display: inline-block;
    flex: none;
  }

  ::-webkit-scrollbar {
    height: ${({ scrollbar }) => scrollbar?.size || '5px'};
  }
  ::-webkit-scrollbar-track {
    background: ${({ scrollbar }) => scrollbar?.back || 'transparent'};
  }
  ::-webkit-scrollbar-thumb {
    background: ${({ scrollbar }) => scrollbar?.handler?.back || '#888'};
  }
  ::-webkit-scrollbar-thumb:hover {
    background: ${({ scrollbar }) => scrollbar?.handler?.hover || '#555'};
  }
`;
