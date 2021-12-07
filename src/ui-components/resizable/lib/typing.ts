export interface Resizable extends
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  w?: Size
  h?: Size
  handlers: {
    t?: boolean;
    r?: boolean;
    b?: boolean;
    l?: boolean;
  }
}

export type Size = {
  default?: string;
  max?: string;
  min?: string;
}
