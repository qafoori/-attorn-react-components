import styled from 'styled-components';
import * as Lib from '.';

export const ScrollSection = styled.div<Pick<Lib.T.ScrollSectionProps, 'h' | 'w'>>`
  float: left;
  overflow: hidden;

  width: ${({ w }) => w?.default || '200px'};
  max-width: ${({ w }) => w?.max || '200px'};
  min-width: ${({ w }) => w?.min || '200px'};

  height: ${({ h }) => h?.default || '100%'};
  max-height: ${({ h }) => h?.max || '100%'};
  min-height: ${({ h }) => h?.min || '100%'};

  background-color: black;
  color: #474747;
`;
