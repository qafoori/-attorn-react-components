import { DetailedHTMLProps, Dispatch, HTMLAttributes, SetStateAction } from 'react';
import { Icons } from '../../icon/lib/types';

export interface Explorer extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  minWidth?: string;
  maxWidth?: string;
  width?: string;
  height?: string;
  data: Array<FileProps | FolderProps>;
  id: string;
  styling: {
    background?: string;
    optionHoverBackground?: string;
    optionsColor?: string;
    optionsBottomBorder?: string;
    itemHover?: string;
  }
}

export type ExplorerEvent = React.MouseEvent<HTMLSpanElement, MouseEvent>;

export type HeaderOption = {
  name: Icons;
  onClick: () => void;
  size: number
}

export type Methods =
  'post' | 'delete' | 'patch' | 'get' | 'put' | 'options' | 'head' | 'copy'
  | 'link' | 'unlink' | 'purge' | 'lock' | 'unlock' | 'propfind' | 'view';

export interface ExplorerItem {
  name: string;
  id: string | number;
  onClick?: () => void;
  active?: boolean;
}

export interface FolderProps extends ExplorerItem {
  subItems: FolderProps[] | FileProps[];
}

export interface FileProps extends ExplorerItem {
  method: Methods;
}

export type ItemProps = {
  item: FolderProps | FileProps;
  active: number | string | null;
  setActive: Dispatch<SetStateAction<number | string | null>>
}






// //////////////////////////////
const threeChild1: FileProps[] = [
  {
    name: 'this is an api',
    method: 'post',
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
                                subItems: [
                                  {
                                    name: 'folder_1_2_1_1_1_1_1',
                                    id: 27,
                                    subItems: [
                                      {
                                        name: 'folder_1_2_1_1_1_1_1_1',
                                        id: 28,
                                        subItems: [
                                          {
                                            name: 'folder_1_2_1_1_1_1_1',
                                            id: 27,
                                            subItems: [
                                              {
                                                name: 'folder_1_2_1_1_1_1_1_1',
                                                id: 28,
                                                subItems: [
                                                  {
                                                    name: 'folder_1_2_1_1_1_1_1',
                                                    id: 27,
                                                    subItems: [
                                                      {
                                                        name: 'folder_1_2_1_1_1_1_1_1',
                                                        id: 28,
                                                        subItems: [
                                                          {
                                                            name: 'folder_1_2_1_1_1_1_1',
                                                            id: 27,
                                                            subItems: [
                                                              {
                                                                name: 'folder_1_2_1_1_1_1_1_1',
                                                                id: 28,
                                                                subItems: [
                                                                  {
                                                                    name: 'folder_1_2_1_1_1_1_1',
                                                                    id: 27,
                                                                    subItems: [
                                                                      {
                                                                        name: 'folder_1_2_1_1_1_1_1_1',
                                                                        id: 28,
                                                                        subItems: threeChild2
                                                                      },
                                                                    ]
                                                                  }
                                                                ]
                                                              },
                                                            ]
                                                          }
                                                        ]
                                                      },
                                                    ]
                                                  }
                                                ]
                                              },
                                            ]
                                          }
                                        ]
                                      },
                                    ]
                                  }
                                ]
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
  ...threeChild7
]
