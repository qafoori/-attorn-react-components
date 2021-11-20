import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface Explorer extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  minWidth?: string;
  maxWidth?: string;
  maxHeight?: string;
  minHeight?: string;
  width?: string;
  height?: string;
}
