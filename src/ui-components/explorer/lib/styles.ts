import styled from 'styled-components'
import * as Lib from '.';

export const Explorer = styled.div<
  Pick<
    Lib.T.Explorer,
    | 'maxWidth'
    | 'minWidth'
    | 'width'
    | 'height'
    | 'styling'
  >
  & {}>`

  width: ${({ width }) => width || '250px'};
  height: ${({ height }) => height || '100%'};
  min-width: ${({ minWidth }) => minWidth || '200px'};
  max-width: ${({ maxWidth }) => maxWidth || '500px'};
  background-color: ${({ styling }) => styling.background || 'black'};
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

  > div {
    width: calc(100% + 5px);
    height: 100%;
    background-color: transparent;

    > .header {
      width: 100%;
      height: 35px;
      display: flex;
      padding: 5px 10px;
      border-bottom: 1px solid ${({ styling }) => styling.optionsBottomBorder || 'white'};

      > p {
        margin: 0;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 3px 5px 3px 0;
        color: ${({ styling }) => styling.optionsColor || 'white'};
      }

      > span {
        width: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        cursor: pointer;

        &:hover {
          background: ${({ styling }) => styling.optionHoverBackground || '#1e1e1e'};
        }
      }
    }

    > .body {
      overflow: auto;
      overflow-x: hidden;
      max-height: 100%;
      padding: 0 10px;

      &:hover {
        .guide {
          opacity: 1;
        }
      }
    }
  }
`;


export const ExplorerItem = styled.div`
  width: 100%;
  cursor: pointer;
  
  > div.details {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 26px;
    padding: 4px 0;
    position: relative;

    &:hover, &.true {
      background-color: var(--foreground);

      &::after, &::before {
        background-color: var(--foreground);
      }
    }

    &::before, &::after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      width: 10px;
    }

    &::before {
      left: -10px;
    }

    &::after {
      right: -10px
    }

    > p {
      margin: 0;
      flex: 1;
      padding: 0 0 0 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 4px 0 0 0;
      font-size: 11pt;
      position: relative;

      &::before {
        content: '';
      }
    }

    > span {
      display: flex;
      align-items: center;
      justify-content: center;

      &.folder {
        margin: 0 4px 0 6px;
      }
    }
  }

  > div.children {
    width: 100%;
    display: grid;
    position: relative;
    display: none;

    &.true {
      display: grid;
    }

    > span.guide {
      width: 1px;
      background: #ffffff2e;
      height: 100%;
      position: absolute;
      opacity: 0;
      transition: all 150ms linear;

      &.true {
        opacity: 1;
      }
    }
  }
`;
