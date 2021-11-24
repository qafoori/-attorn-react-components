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

  > div.explorerContainer {
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

      > .file {
        > .details {
          padding: 0 0 0 15px;
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
      margin: 1px 0 0 0;
      font-size: 10pt;
      position: relative;

      &.fileName {
        margin: 1px 0 0 3px;
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

    > span.border {
      position: absolute;
      left: 0;
      right: 0;
      height: 25%;
      z-index: 1;

      &.top {
        top: 0;
      }

      &.center {
        height: 50%;
        top: 0;
        bottom: 0;
        margin: auto;
      }

      &.bottom {
        bottom: 0;
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

  &.draggedNode {
    > .details {
      background-color: transparent;
      &::after, &::before {
        content: unset;
      }
      span {
        display: none;
      }
    }
    .children {
      display: none;
    }
  }
`;
