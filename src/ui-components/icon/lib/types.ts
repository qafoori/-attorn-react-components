import { SVGAttributes } from "react"

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
  | 'chevron-right'
  | 'search'
  | 'sync'
  | 'folder'
  | 'folder-open'
  | 'folder-close'
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
  | 'collapse'
  | 'add-file'
  | 'add-folder'
  | 'reload'
  | 'method-post'
  | 'method-delete'
  | 'method-patch'
  | 'method-get'
  | 'method-put'
  | 'method-options'
  | 'method-head'
  | 'method-copy'
  | 'method-link'
  | 'method-unlink'
  | 'method-purge'
  | 'method-lock'
  | 'method-unlock'
  | 'method-propfind'
  | 'method-view'
  | 'method-abbr-post'
  | 'method-abbr-delete'
  | 'method-abbr-patch'
  | 'method-abbr-get'
  | 'method-abbr-put'
  | 'method-abbr-options'
  | 'method-abbr-head'
  | 'method-abbr-copy'
  | 'method-abbr-link'
  | 'method-abbr-unlink'
  | 'method-abbr-purge'
  | 'method-abbr-lock'
  | 'method-abbr-unlock'
  | 'method-abbr-propfind'
  | 'method-abbr-view'
  | 'method-abbr-empty'