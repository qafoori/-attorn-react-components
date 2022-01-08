import { StyledComponent } from "styled-components";

export interface HorizontalScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  childrenComponent?: keyof HTMLElementTagNameMap;
  scrollbar?: {
    size?: string;
    back?: string;
    handler?: {
      back?: string;
      hover?: string;
    }
  };
}
