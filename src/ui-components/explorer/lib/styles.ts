import styled from 'styled-components'
import * as Lib from '.';

export const Explorer = styled.div<Pick<Lib.T.Explorer, 'styling'>>`
  background-color: ${({ styling: s }) => s?.background || '#16191e'};
  padding: 0 5px 0 0;
  float: left;
  width: 100%;
  height: 100%;

  > div.explorerContainer {
    width: calc(100% + 5px);
    height: 100%;
    background-color: transparent;

    > .header {
      width: 100%;
      height: 35px;
      display: flex;
      padding: 5px 10px;
      border-bottom: 1px solid ${({ styling: s }) => s?.header?.borderBottom || '#383838'};

      > p {
        margin: 0;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 3px 5px 3px 0;
        color: ${({ styling: s }) => s?.header?.titleColor || '#bcbcbc'};
      }

      > span {
        width: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        cursor: pointer;

        &:hover {
          background: ${({ styling: s }) => s?.header?.iconsHover || '#2e3540'};
        }
      }
    }

    > .body {
      /* overflow: auto; */
      height: 100%;
      height: 100%;

      > .bodyChild {
        height: 100%;
        
        > div:nth-child(1) {
          padding: 3px 0 150px 10px;
          overflow-x: hidden !important;
        }

        > div:nth-child(2),
        > div:nth-child(3) {
          z-index: 2;
          opacity: 0;
          transition: all 150ms linear;
          cursor: default;

          > div {
            cursor: default !important;
          }
        }

        &:hover {
          > div:nth-child(2),
          > div:nth-child(3) {
            opacity: 1;
          }
        }

        > div:nth-child(3) {
          width: 15px !important;
          border-radius: 0 !important;
          right: 0 !important;

          > div {
            background-color: ${({ styling: s }) => s?.scrollTrack || '#ffffff29'} !important;
          }
        }
      }

      &:hover {
        .guide {
          opacity: 1;
        }
      }
    }
  }
`;


export const ExplorerItem = styled.div<Pick<Lib.T.Explorer, 'styling'>>`
  width: 100%;
  cursor: pointer;

  &.cut {
    opacity: .3;
  }

  &.item-adder {
    display: none;

    &.enabled-item-adder {
      display: initial;
    }
  }
  
  > div.details {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 26px;
    padding: 4px 0;
    position: relative;

    &:hover {
      background-color: ${({ styling: s }) => s?.items?.activeBackground || '#ffffff0f'};

      &::after, &::before {
        background-color: ${({ styling: s }) => s?.items?.activeBackground || '#ffffff0f'};
      }
    }

    &.true {
      background-color: ${({ styling: s }) => s?.items?.hoverBackground || '#ffffff29'};

      &::after, &::before {
        background-color: ${({ styling: s }) => s?.items?.hoverBackground || '#ffffff29'};
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
      color: ${({ styling: s }) => s?.items?.nameColor || '#c4c4c4'};

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

      &.empty {
        display: inline-block;
        width: 15px;
        height: 10px;
      }
    }

    > span.border {
      position: absolute;
      left: 0;
      right: 0;
      height: 25%;
      z-index: 1;

      &.top {
        top: -2px;
        border-top: 3px solid transparent;

        &.active {
          border-top: 3px solid red;
        }
      }

      &.center {
        height: calc(50% + 4px);
        top: 0;
        bottom: 0;
        margin: auto;
      }

      &.bottom {
        bottom: -2px;
        border-bottom: 3px solid transparent;
        
        &.active {
          border-bottom: 3px solid red;
        }
      }
    }

    > input {
      margin: 0;
      flex: 1;
      padding: 0 0 0 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 1px 0 0 5px;
      font-size: 10pt;
      position: relative;
      outline: none;
      background: ${({ styling: s }) => s?.background || '#16191e'};
      border: none;
      height: 23px;
      font-style: italic;
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

    &.true-guide {
      > span.guide {
        opacity: 1;
      }
    }

    > span.guide {
      width: 1px;
      background: ${({ styling: s }) => s?.items?.guideColor || '#ffffff2e'};
      height: 100%;
      position: absolute;
      opacity: 0;
      transition: all 150ms linear;

      &.true {
        opacity: 1;
      }
    }
  }

  &.folder.active {
    background-color: var(--foreground);

    .details {
      background-color: var(--foreground);

      &::after, &::before {
        background-color: var(--foreground);
      }
    }
  }
`;
