/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) available.
 *
 * Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
 *
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) is licensed under the MIT License.
 *
 * License for 蓝鲸智云PaaS平台 (BlueKing PaaS):
 *
 * ---------------------------------------------------
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 * to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of
 * the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */
import { Component, Emit, Prop } from 'vue-property-decorator';
import { Component as tsc } from 'vue-tsx-support';

import { SPACE_TYPE_MAP } from '../../common/constant';

import type { ThemeType } from './biz-select';

import './list.scss';

interface IProps {
  list: IListItem[];
  checked?: number;
  theme?: ThemeType;
}
interface IEvents {
  onSelected: number;
}
export interface IListItem {
  id: number | string;
  name: string;
  space_code?: string;
  space_type_id?: string;
  space_id?: string;
  tags?: ITagsItem[];
  children?: IListItem[];
  is_hidden_tag?: boolean;
}
interface ITagsItem {
  id: string;
  name: string;
  type: ETagsType;
}
export enum ETagsType {
  BCS = 'bcs' /** 容器项目 */,
  BKCC = 'bkcc' /** 业务 */,
  BKCI = 'bkci' /** 蓝盾项目 */,
  BKSAAS = 'bksaas' /** 蓝鲸应用 */,
  MONITOR = 'monitor' /** 监控空间 */,
}
@Component
export default class List extends tsc<IProps, IEvents> {
  /** 选中的id */
  @Prop({ type: Number }) checked: number;
  /** 列表数据 */
  @Prop({ default: () => [], type: Array }) list: IListItem[];
  /** 主题 */
  @Prop({
    default: 'light',
    type: String,
    validator: (val: string) => ['dark', 'light'].includes(val),
  })
  theme: ThemeType;

  @Emit('selected')
  handleSelected(id: number | string) {
    return id;
  }
  render() {
    return (
      <div class={['biz-list-wrap', this.theme]}>
        {this.list.length ? (
          this.list.map(item => (
            <div
              key={item.name}
              class={['list-group', this.theme, { 'no-name': !item.name }]}
            >
              {item.name && <div class='list-group-name'>{item.name}</div>}
              {item.children.map((child, i) => (
                <div
                  key={child.id || i}
                  class={['list-item', this.theme, { checked: child.id === this.checked }]}
                  onClick={() => this.handleSelected(child.id)}
                >
                  <span class='list-item-left'>
                    <span
                      class='list-item-name'
                      v-bk-overflow-tips
                    >
                      {child.name}
                    </span>
                    <span
                      class={['list-item-id', this.theme]}
                      v-bk-overflow-tips
                    >
                      ({child.space_type_id === ETagsType.BKCC ? `#${child.id}` : child.space_id || child.space_code})
                    </span>
                  </span>
                  {!child.is_hidden_tag && (
                    <span class='list-item-right'>
                      {child.tags?.map?.(tag => (
                        <span
                          key={tag.id}
                          style={{ ...SPACE_TYPE_MAP[tag.id]?.[this.theme] }}
                          class='list-item-tag'
                        >
                          {SPACE_TYPE_MAP[tag.id]?.name}
                        </span>
                      ))}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))
        ) : (
          <bk-exception
            class='no-data'
            scene='part'
            type='search-empty'
          />
        )}
      </div>
    );
  }
}
