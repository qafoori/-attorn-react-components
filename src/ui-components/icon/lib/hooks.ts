import * as Lib from '.'

export const useIcon = ({ size }: Pick<Lib.T.IconProps, 'size'>) => {

  const calculateMethodSize = () => {
    const iconSize = size || 20;
    return {
      width: iconSize * 2.4375,
      height: iconSize
    }
  }


  return {
    on: {
      calculateMethodSize
    }
  }
}