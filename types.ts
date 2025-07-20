// types.ts
export type MenuItem = {
  icon: string;
  name: string;
  action?: () => void;
};

export type Position = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type DropdownMenuProps = {
  visible: boolean;
  onClose: () => void;
  anchorPosition: Position;
  items?: MenuItem[];
};