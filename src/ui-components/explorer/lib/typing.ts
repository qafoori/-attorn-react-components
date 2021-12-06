import {
  DetailedHTMLProps,
  Dispatch,
  DragEvent,
  FocusEvent,
  HTMLAttributes,
  KeyboardEvent,
  SetStateAction
} from 'react';
import { Icons } from '../../icon/lib/types';

export interface Explorer extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  minWidth?: string;
  maxWidth?: string;
  width?: string;
  height?: string;
  data: Array<FileProps | FolderProps>;
  tabIndent?: number;
  onAddNew: (name: string, type: AddNewTypes) => Promise<number | string>;
  onReload?: () => void;
  onRightClick?: (
    id: number | string,
    type: OnContextMenuPayloadTypes,
    evt: OnContextMenuEvent,
    pasteEnabled: boolean,
    timingEnabled: TimingEnabled
  ) => void;
  ContextMenu?: (method: ContextMenuMethods) => void;
  contextHandlerState?: ContextMenuHandlerState
  onErrors?: (error: ErrorThrowing) => void;
  onChangeItems?: OnChange;
  beforeDelete?: (id: number | string, item: string, type: 'file' | 'folder') => boolean;
  styling?: {
    background?: string;
    scrollTrack?: string;
    header?: {
      titleColor?: string;
      iconsColor?: string;
      iconsHover?: string;
      borderBottom?: string;
    }
    items?: {
      nameColor?: string;
      iconsColor?: {
        chevron?: string;
        folder?: string;
        methodsBackground?: string;
      },
      activeBackground?: string;
      hoverBackground?: string;
      guideColor?: string;
    }
  }
}

export type TimingEnabled = {
  undo: boolean;
  redo: boolean;
}

export type OnChange = (
  method: OnChangeMethods,
  newList: (FileProps | FolderProps)[]
) => void;

export type OnChangeMethods =
  | Copy
  | Cut
  | NewFile
  | NewFolder
  | Delete
  | Restore
  | Rename
  | ChangePosition
  |
  {
    timing: 'undo' | 'redo';
    detail:
    | Copy
    | Cut
    | NewFile
    | NewFolder
    | Delete
    | Restore
    | Rename
  }

export type Copy = { copy: ID; into: Into, newId: ID };

export type Cut = { cut: ID; into: Into, from: Into };

export type NewFile = { newFile: FileProps; into: Into };

export type NewFolder = { newFolder: FolderProps; into: Into };

export type Delete = { delete: ID };

export type Restore = { restore: ID };

export type Rename = { rename: ID; to: string, from: string };

export type ChangePosition = { move: true };

export type ID = number | string;

export type Into = ID | 'root';

export type OnContextMenuEvent = React.MouseEvent<HTMLDivElement, MouseEvent> | React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>

export type ContextMenuMethods = 'new-file' | 'new-folder' | 'delete'
  | 'copy' | 'cut' | 'paste' | 'undo' | 'redo' | 'rename';


export type OnContextMenuPayloadTypes = 'file' | 'folder' | 'whiteArea'


export type ExplorerEvent = React.MouseEvent<HTMLSpanElement, MouseEvent>;

export type HeaderOption = {
  name: Icons;
  onClick: () => void;
  size: number
}

export type Methods =
  'post' | 'delete' | 'patch' | 'get' | 'put' | 'options' | 'head' | 'copy'
  | 'link' | 'unlink' | 'purge' | 'lock' | 'unlock' | 'propfind' | 'view';


export type Position = 'above' | 'into' | 'below'

export interface DNDProps {
  onDragStart?: (evt: DragEvent<HTMLDivElement>, name: string, id: number | string) => void
  onDragEnd?: (evt: DragEvent<HTMLDivElement>) => void
  onDragOver?: (evt: DragEvent<HTMLDivElement>) => void
  onDragLeave?: (evt: DragEvent<HTMLSpanElement>) => void
  onHelpersDragEnd?: (id: number | string, position: Position) => void
}

export interface ExplorerItem {
  name: string;
  id: string | number;
  onClick?: () => void;
  active?: boolean;
  disabledItems?: boolean;
}

export type ItemIdToAppendNew = {
  val: string | number | null;
  set: Dispatch<SetStateAction<string | number | null>>
}

export interface FolderProps extends
  ExplorerItem, DNDProps, Omit<ItemAdderProps, 'type'>,
  Pick<Explorer, 'onRightClick' | 'styling'>,
  Pick<ItemProps, 'itemIdToRename' | 'onRename' | 'pasteEnabled' | 'timingEnabled'> {
  subItems: FolderProps[] | FileProps[];
  collapsed?: boolean;
  itemIdToAppendNew?: ItemIdToAppendNew
  addNewType?: AddNewTypes
}

export interface FileProps extends ExplorerItem, DNDProps,
  Pick<Explorer, 'onRightClick' | 'styling'>,
  Pick<ItemProps, 'itemIdToRename' | 'onRename' | 'pasteEnabled' | 'timingEnabled'> {
  method: Methods;
  itemIdToAppendNew?: ItemIdToAppendNew
}

export interface ItemProps extends
  DNDProps, Omit<ItemAdderProps, 'type'>,
  Pick<Explorer, 'onRightClick' | 'styling'> {
  item: FolderProps | FileProps;
  active: number | string | null;
  setActive: Dispatch<SetStateAction<number | string | null>>
  collapsed: boolean
  disabledItems: boolean;
  itemIdToAppendNew: ItemIdToAppendNew
  addNewType: AddNewTypes
  itemIdToRename?: { val: string | number | null, set: Dispatch<SetStateAction<string | number | null>> }
  pasteEnabled?: boolean;
  timingEnabled?: TimingEnabled;
  onRename?: {
    blur: OnRenameType<React.FocusEvent<HTMLInputElement, Element>>;
    keyUp: OnRenameType<React.KeyboardEvent<HTMLInputElement>>;
  }
}

export type OnRenameType<T> = (evt: T, prevName: string, setDefault: Dispatch<React.SetStateAction<string>>) => void;

export type OnDragEndInfo = {
  position: Position
  id: string | number
}

export type AddNewTypes = 'file' | 'folder' | undefined;

export interface ItemAdderProps extends Pick<Explorer, 'styling'> {
  type?: AddNewTypes;
  onBlur?: (evt: FocusEvent<HTMLInputElement, Element>) => void;
  onKeyUp?: (evt: KeyboardEvent<HTMLInputElement>) => void
  visibility?: boolean
}


export type ContextMenuHandlerState = {
  type: ContextMenuMethods;
  id: number | string;
} | null;


export type ToCopyOrCutTypes = 'copy' | 'cut';


export type ToCopyOrCut = {
  item: string;
  action: ToCopyOrCutTypes
} | null


export type ErrorThrowing = {
  message: string;
  fn: string;
  [name: string]: any;
}





















// //////////////////////////////
const threeChild1: FileProps[] = [
  {
    name: 'this is an api',
    method: 'copy',
    id: 1
  },
  {
    name: 'this is another one',
    method: 'delete',
    id: 2
  },
  {
    name: 'and thats it',
    method: 'delete',
    id: 3
  }
]
const threeChild2: FileProps[] = [
  {
    name: 'this is an api',
    method: 'post',
    id: 18
  },
  {
    name: 'this is another one',
    method: 'delete',
    id: 4
  },
  {
    name: 'and thats it',
    method: 'delete',
    id: 5
  }
]
const threeChild3: FileProps[] = [
  {
    name: 'this is an api',
    method: 'post',
    id: 6
  },
  {
    name: 'this is another one',
    method: 'delete',
    id: 7
  },
  {
    name: 'and thats it',
    method: 'delete',
    id: 8
  }
]
const threeChild4: FileProps[] = [
  {
    name: 'this is an api',
    method: 'post',
    id: 9
  },
  {
    name: 'this is another one',
    method: 'delete',
    id: 10
  },
  {
    name: 'and thats it',
    method: 'delete',
    id: 11
  }
]
const threeChild5: FileProps[] = [
  {
    name: 'this is an api',
    method: 'post',
    id: 12
  },
  {
    name: 'this is another one',
    method: 'delete',
    id: 13
  },
  {
    name: 'and thats it',
    method: 'delete',
    id: 14
  }
]
const threeChild6: FileProps[] = [
  {
    name: 'this is an api',
    method: 'post',
    id: 15
  },
  {
    name: 'this is another one',
    method: 'delete',
    id: 16
  },
  {
    name: 'and thats it',
    method: 'delete',
    id: 17
  }
]
const threeChild7: FileProps[] = [
  {
    name: 'this is an api',
    method: 'post',
    id: 39
  },
  {
    name: 'this is another one',
    method: 'delete',
    id: 40
  },
  {
    name: 'and thats it',
    method: 'delete',
    id: 41
  }
]
const threeChild8: FileProps[] = [
  {
    name: 'this is an api',
    method: 'post',
    id: 42
  },
  {
    name: 'this is another one',
    method: 'delete',
    id: 43
  },
  {
    name: 'and thats it',
    method: 'delete',
    id: 44
  }
]
export const apiCallerExplorerThings: Array<FileProps | FolderProps> = [
  {
    name: 'folder_1',
    id: 19,
    subItems: [
      {
        name: 'folder_1_1',
        id: 20,
        subItems: [
          {
            name: 'folder_1_1_1',
            subItems: threeChild1,
            id: 21,
          }
        ]
      },
      {
        name: 'folder_1_2',
        id: 22,
        subItems: [
          {
            name: 'folder_1_2_1',
            id: 23,
            subItems: [
              {
                name: 'folder_1_2_1_1',
                id: 24,
                subItems: [
                  {
                    name: 'folder_1_2_1_1_1',
                    id: 25,
                    subItems: [
                      {
                        name: 'folder_1_2_1_1_1_1',
                        id: 26,
                        subItems: [
                          {
                            name: 'folder_1_2_1_1_1_1_1',
                            id: 27,
                            subItems: [
                              {
                                name: 'folder_1_2_1_1_1_1_1_1',
                                id: 28,
                                subItems: []
                              },
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'folder_2',
    id: 29,
    subItems: [
      {
        name: 'folder_2_1',
        id: 31,
        subItems: threeChild3
      },
    ]
  },
  {
    name: 'folder_3',
    id: 30,
    subItems: [
      {
        name: 'folder_3_1',
        id: 32,
        subItems: threeChild4
      },
    ]
  },
  ...threeChild8,
  {
    name: 'folder_4',
    id: 33,
    subItems: [
      {
        name: 'folder_4_1',
        id: 34,
        subItems: []
      },
    ]
  },
  {
    name: 'folder_5',
    id: 35,
    subItems: [
      {
        name: 'folder_5_1',
        id: 36,
        subItems: threeChild5
      },
    ]
  },
  {
    name: 'folder_6',
    id: 37,
    subItems: [
      {
        name: 'folder_6_1',
        id: 38,
        subItems: threeChild6
      },
    ]
  },
  {
    name: 'folder_500',
    id: 500,
    subItems: [
      {
        name: 'file_501',
        id: 501,
        method: 'options'
      },
    ]
  },
  ...threeChild7,
]
