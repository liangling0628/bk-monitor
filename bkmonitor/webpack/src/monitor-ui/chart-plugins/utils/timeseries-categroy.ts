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
import dayjs from 'dayjs';

import type { MonitorEchartOptions } from '../typings';

export const timeseries2category = (options: MonitorEchartOptions, onlyBeginEnd = false) => {
  let { xAxis, series } = options;
  const xTimeData = new Set<number>();
  series = Array.isArray(series) ? series : [series];
  for (const item of series) {
    const xData = [];
    for (const val of item.data as any) {
      xData.push({
        ...val,
        value: Array.isArray(val.value) ? val.value[1] : val,
      });
      const time = Array.isArray(val.value) ? val.value[0] : val;
      if (typeof time === 'number') {
        xTimeData.add(time);
      }
    }
    item.data = xData;
  }
  xAxis = Array.isArray(xAxis) ? xAxis[0] : xAxis;
  const data = Array.from(xTimeData)
    .filter(v => v !== undefined && v !== null)
    .sort();
  const minX = data.at(0);
  const maxX = data.at(-1);
  const duration = Math.abs(dayjs.tz(+maxX).diff(dayjs.tz(+minX), 'second'));
  return {
    ...options,
    xAxis: {
      ...xAxis,
      type: 'category',
      data,
      axisLabel: {
        ...xAxis.axisLabel,
        formatter: (v: any) => {
          if (onlyBeginEnd && v > minX && v < maxX) {
            return '';
          }
          if (duration < 1 * 60) {
            return dayjs.tz(+v).format('mm:ss');
          }
          if (duration < 60 * 60 * 24 * 1) {
            return dayjs.tz(+v).format('HH:mm');
          }
          if (duration < 60 * 60 * 24 * 6) {
            return dayjs.tz(+v).format('MM-DD HH:mm');
          }
          if (duration <= 60 * 60 * 24 * 30 * 12) {
            return dayjs.tz(+v).format('MM-DD');
          }
          return dayjs.tz(+v).format('YYYY-MM-DD');
        },
      },
    },
  };
};
