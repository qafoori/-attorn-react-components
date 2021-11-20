import{ SVGAttributes } from "react"

type SVGProps = SVGAttributes<SVGSVGElement> | any

export interface IconProps extends SVGProps {
  name: Icons
  size?: number
  color?: string
  secondaryColor?: string
}

export type Icons =
  'white-back-logo'
  | 'chevron-down'
  | 'search'
  | 'sync'
  | 'folder'
  | 'code'
  | 'palette'
  | 'chart'
  | 'copy'
  | 'clock'
  | 'trash'
  | 'gear'
  | 'dots'
  | 'server'
  | 'github'
  | 'download'