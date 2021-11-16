import { SVGProps } from 'react'

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: Icons
  size?: number
  color?: string
}

export type Icons =
  'white-back-logo'
  | 'chevron-down'
