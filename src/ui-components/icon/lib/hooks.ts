import * as Lib from '.'

export const useIcon = ({ size }: Pick<Lib.T.IconProps, 'size'>) => {

  const calculateMethodSize = () => {
    const iconSize = size || 20;
    return {
      width: iconSize * 2.4375,
      height: iconSize
    }
  }


  const calculateAbbrMethodSize = () => {
    const iconSize = size || 20;
    return {
      width: iconSize * 1.6,
      height: iconSize
    }
  }


  return {
    on: {
      calculateMethodSize,
      calculateAbbrMethodSize
    }
  }
}