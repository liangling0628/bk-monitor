import { computed, ref as deepRef, shallowRef } from 'vue';

import { defineStore } from 'pinia';

import { type TimeRangeType, DEFAULT_TIME_RANGE } from '../../components/time-range/utils';
import { getDefaultTimezone } from '../../i18n/dayjs';
import { ProfilingTabEnum } from '../../pages/profiling-explore/constants';

import type { IProfilingApplication, IProfilingServiceDetail, ProfilingTabType } from '../../pages/profiling-explore/typings';

/**
 * Profiling 检索跨区域状态。
 * 只放 header / 检索区 / 趋势 / 可视化多方读写的字段。
 */
export const useProfilingExploreStore = defineStore('profilingExplore', () => {
  const timeRange = deepRef<TimeRangeType>(DEFAULT_TIME_RANGE);
  const timezone = shallowRef(getDefaultTimezone());
  const tab = shallowRef<ProfilingTabType>(ProfilingTabEnum.APPLICATION);
  const appName = shallowRef('');
  const serviceName = shallowRef('');
  const appList = shallowRef<IProfilingApplicationListState>({ normal: [], no_data: [] });
  const serviceDetail = shallowRef<IProfilingServiceDetail | null>(null);
  const refreshInterval = shallowRef(-1);
  const refreshImmediate = shallowRef('');
  const isCompared = shallowRef(false);
  const dateCompared = shallowRef(false);
  const dataType = shallowRef('');
  const aggMethod = shallowRef('AVG');

  const currentApp = computed(() =>
    [...appList.value.normal, ...appList.value.no_data].find(item => item.app_name === appName.value)
  );

  function init(data: {
    aggMethod?: string;
    appName?: string;
    dataType?: string;
    dateCompared?: boolean;
    isCompared?: boolean;
    refreshInterval?: number;
    serviceName?: string;
    tab?: ProfilingTabType;
    timeRange?: TimeRangeType;
    timezone?: string;
  }) {
    timeRange.value = data.timeRange || DEFAULT_TIME_RANGE;
    timezone.value = data.timezone || getDefaultTimezone();
    tab.value = data.tab || ProfilingTabEnum.APPLICATION;
    appName.value = data.appName || '';
    serviceName.value = data.serviceName || '';
    refreshInterval.value = data.refreshInterval ?? -1;
    isCompared.value = !!data.isCompared;
    dateCompared.value = !!data.dateCompared;
    dataType.value = data.dataType || '';
    aggMethod.value = data.aggMethod || 'AVG';
    if (!isCompared.value) {
      dateCompared.value = false;
    }
  }

  function setCompared(val: boolean) {
    isCompared.value = val;
    if (!val) {
      dateCompared.value = false;
    }
  }

  return {
    aggMethod,
    appList,
    appName,
    currentApp,
    dataType,
    dateCompared,
    isCompared,
    refreshImmediate,
    refreshInterval,
    serviceDetail,
    serviceName,
    tab,
    timeRange,
    timezone,
    init,
    setCompared,
  };
});

interface IProfilingApplicationListState {
  no_data: IProfilingApplication[];
  normal: IProfilingApplication[];
}
