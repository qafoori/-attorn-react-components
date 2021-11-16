import React, { FC } from 'react'
import * as Lib from './lib'



export const Icon: FC<Lib.T.IconProps> = ({
  name, color = 'black', size = 20, ...otherProps
}) => {
  const props = { width: size, height: size };

  switch (name) {
    case 'white-back-logo':
      return <svg {...props} viewBox="0 0 138 138" {...otherProps}>
        <rect width="138" height="138" rx="35" fill="white" />
        <path d="M60.5934 21H71.8022H78.5275L120 94.0089L109.912 110.857H28.0879L18 94.0089L60.5934 21Z" fill="#007DFF" />
        <path d="M95.9346 97.4211C94.9108 83.4583 83.6482 66.9569 75.8296 60.61C73.4633 58.6892 69.1279 55.8497 63.5431 60.61C57.9584 65.3703 47.9059 75.8422 42.3211 97.4211C41.5765 101.229 41.651 109.861 47.9059 113.923C54.1608 117.985 66.1494 119 71.3618 119C83.6482 119 97.0516 112.653 95.9346 97.4211Z" fill="white" />
      </svg>

    case 'chevron-down':
      return <svg {...props} viewBox="0 0 9 5" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.63125 0.368744L4.5 3.23124L7.36875 0.368744L8.25 1.24999L4.5 4.99999L0.75 1.24999L1.63125 0.368744Z" fill={color} />
      </svg>



  }
}
