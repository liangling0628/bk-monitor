export interface MonitorPickerItem {
  text: string | number;
  value: string | number;
  disabled?: boolean;
  children?: MonitorPickerItem[]
  defaultIndex?: number;
}

export interface WXCascadeColumns {
  values: MonitorPickerItem[];
  defaultIndex?: number;
}

export type WXColumns = WXCascadeColumns[] | MonitorPickerItem[];
