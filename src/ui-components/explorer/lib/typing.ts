import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface Explorer extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  minWidth?: string;
  maxWidth?: string;
  width?: string;
  height?: string;
}

export type ExplorerEvent = React.MouseEvent<HTMLSpanElement, MouseEvent>;