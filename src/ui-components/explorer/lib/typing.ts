import { DetailedHTMLProps, HTMLAttributes } from 'react';
import { Icons } from '../../icon/lib/types';

export interface Explorer extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  minWidth?: string;
  maxWidth?: string;
  width?: string;
  height?: string;
  styling: {
    background?: string;
    optionHoverBackground?: string;
    optionsColor?: string;
    optionsBottomBorder?: string;
    itemHover?: string;
  }
}

export type ExplorerEvent = React.MouseEvent<HTMLSpanElement, MouseEvent>;

export type HeaderOption = {
  name: Icons;
  onClick: () => void;
  size: number
}


export interface ExplorerItem {
  name: string;
}

export interface FolderProps extends ExplorerItem {

}

export interface FileProps extends ExplorerItem {

}
