export interface MonitorCollapseItemProps {
  attrs: {
    name: string | number;
    [key: string]:  number | string | boolean | undefined
  },
  default: {
    /**
     * 插槽内容 或者 传递一个插槽名称
     * 插槽内容优先级比插槽名称高
     */
    content?: string;
    slotName?: string;
  }
}
