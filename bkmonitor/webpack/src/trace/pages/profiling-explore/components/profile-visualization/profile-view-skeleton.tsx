/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) available.
 *
 * Copyright (C) 2017-2025 Tencent.  All rights reserved.
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
import { type PropType, defineComponent } from 'vue';

import { useI18n } from 'vue-i18n';

import { ProfileViewModeEnum } from '../../constants';

import type { ProfileViewModeType } from '../../typings';

import './profile-view-skeleton.scss';

const TABLE_NAME_WIDTHS = [72, 88, 64, 80, 56, 92, 70, 84, 60, 76];

interface IFlameBlock {
  left: number;
  tone: number;
  width: number;
}

/** 从 start 向右排，块变少时右边留空，不在区间里居中 */
function placeBlocks(start: number, budget: number, count: number, toneOffset: number): IFlameBlock[] {
  if (count <= 0 || budget <= 0) return [];
  const gap = 0.45;
  const width = Math.max((budget - gap * (count - 1)) / count, 0);
  return Array.from({ length: count }, (_, index) => ({
    left: start + index * (width + gap),
    width,
    tone: (toneOffset + index) % 3,
  }));
}

/**
 * 顶层一整条。前几层从左铺满且块多，之后块数逐级减少。
 * 左右两个峰都从各自左边缘往右收，中间是谷。
 */
function buildFlameLevels(): IFlameBlock[][] {
  const counts = [1, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 4, 3, 3, 2, 1];
  return counts.map((count, level) => {
    if (level === 0) return placeBlocks(0, 100, 1, 0);
    if (level <= 3) return placeBlocks(0, 100, count, level);
    const leftCount = Math.ceil(count / 2);
    const rightCount = count - leftCount;
    const shrink = (level - 3) * 6;
    const sideShrink = (level - 3) * 2.2;
    const showSide = level <= 11;
    const parts: { budget: number; count: number; gapBefore: number; tone: number }[] = [
      ...(showSide
        ? [{ budget: Math.max(14 - sideShrink, 6), count: Math.max(Math.ceil(count / 3), 1), gapBefore: 0, tone: level + 2 }]
        : []),
      { budget: Math.max(22 - shrink, 3.2), count: leftCount, gapBefore: 0, tone: level },
      { budget: Math.max(18 - shrink, 2.6), count: rightCount, gapBefore: 3.5, tone: level + 1 },
      ...(showSide
        ? [{ budget: Math.max(12 - sideShrink, 5), count: Math.max(Math.floor(count / 3), 1), gapBefore: 0, tone: level + 2 }]
        : []),
    ];
    let cursor = 22;
    const row: IFlameBlock[] = [];
    parts.forEach(part => {
      cursor += part.gapBefore;
      const blocks = placeBlocks(cursor, part.budget, part.count, part.tone);
      const last = blocks[blocks.length - 1];
      if (last) cursor = last.left + last.width + 0.4;
      row.push(...blocks);
    });
    return row;
  });
}

const FLAME_LEVELS = buildFlameLevels();

const TableSkeleton = defineComponent({
  name: 'ProfileTableSkeleton',
  props: {
    isCompared: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const { t } = useI18n();
    return { t };
  },
  render() {
    const valueHeaders = this.isCompared
      ? [this.t('查询项'), this.t('对比项'), 'Diff']
      : [this.t('Self'), this.t('Total')];
    return (
      <div class='profile-table-skeleton'>
        <div class='table-skeleton-head'>
          <span class='col-name'>{this.t('Location')}</span>
          {valueHeaders.map(label => (
            <span
              key={label}
              class='col-value'
            >
              {label}
            </span>
          ))}
          <span class='col-bar' />
        </div>
        <div class='table-skeleton-body'>
          {TABLE_NAME_WIDTHS.map((width, index) => (
            <div
              key={width}
              class='table-skeleton-row'
            >
              <span class='col-name'>
                <span class={['dot', `tone-${index % 5}`]} />
                <span
                  style={{ width: `${width}%` }}
                  class='bone name'
                />
              </span>
              {valueHeaders.map(label => (
                <span
                  key={label}
                  class='col-value'
                >
                  <span class='bone value' />
                </span>
              ))}
              <span class='bar-track'>
                <span
                  style={{ width: `${88 - index * 6}%` }}
                  class='bone bar'
                />
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  },
});

const FlameSkeleton = defineComponent({
  name: 'ProfileFlameSkeleton',
  render() {
    return (
      <div class='profile-flame-skeleton'>
        {FLAME_LEVELS.map((row, rowIndex) => (
          <div
            key={rowIndex}
            class='flame-row'
          >
            {row.map((block, blockIndex) => (
              <span
                key={`${rowIndex}-${blockIndex}`}
                style={{
                  left: `${block.left}%`,
                  width: `${block.width}%`,
                  animationDelay: `${rowIndex * 0.12}s`,
                }}
                class={['flame-block', `tone-${block.tone}`]}
              >
                {block.width > 12 ? <i class='flame-label' /> : null}
              </span>
            ))}
          </div>
        ))}
      </div>
    );
  },
});

const TopoSkeleton = defineComponent({
  name: 'ProfileTopoSkeleton',
  render() {
    const levels = [1, 2, 3];
    return (
      <div class='profile-topo-skeleton'>
        {levels.map(count => (
          <div
            key={count}
            class='topo-level'
          >
            {Array.from({ length: count }, (_, index) => (
              <div
                key={index}
                class='topo-node'
              >
                <span class='node-dot' />
                <span class='bone node-label' />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  },
});

export default defineComponent({
  name: 'ProfileViewSkeleton',
  props: {
    viewMode: {
      type: String as PropType<ProfileViewModeType>,
      default: ProfileViewModeEnum.COMBINE,
    },
    isCompared: {
      type: Boolean,
      default: false,
    },
  },
  render() {
    const combine = this.viewMode === ProfileViewModeEnum.COMBINE;
    const showTable = this.viewMode === ProfileViewModeEnum.TABLE || combine;
    const showFlame = this.viewMode === ProfileViewModeEnum.FLAME || combine;
    const showTopo = this.viewMode === ProfileViewModeEnum.TOPO;
    return (
      <div class={['profile-view-skeleton', { 'is-combine': combine }]}>
        {showTable && <TableSkeleton isCompared={this.isCompared} />}
        {showFlame && <FlameSkeleton />}
        {showTopo && <TopoSkeleton />}
      </div>
    );
  },
});
