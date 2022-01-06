export interface Resizable extends
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  w?: Size
  h?: Size
  t?: boolean;
  r?: boolean;
  b?: boolean;
  l?: boolean;
  tr?: boolean;
  tl?: boolean;
  br?: boolean;
  bl?: boolean;
}

export type Size = {
  default?: string;
  max?: string;
  min?: string;
}

export type ResizeArgs = {
  resizable: HTMLDivElement | null;
  evt: MouseEvent;
  style: CSSStyleDeclaration;
}

export type Direction = 't' | 'r' | 'b' | 'l' | 'tr' | 'tl' | 'br' | 'bl' | 'none';
