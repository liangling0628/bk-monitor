import { type MaybeRef, computed, onScopeDispose, shallowRef, watch } from 'vue';

import { get } from '@vueuse/core';

import { handleTransformToTimestamp } from '../../../components/time-range/utils';
import { useProfilingExploreStore } from '../../../store/modules/profiling-explore';
import { fetchApplicationServices, fetchServiceDetail } from '../services/application';

import type { TimeRangeType } from '../../../components/time-range/utils';
import type { IProfilingApplication, IProfilingApplicationList } from '../typings';

interface IUseProfilingApplicationOptions {
  onDataTypeChange?: () => void;
  onReady?: () => void;
  timeRange: MaybeRef<TimeRangeType>;
}

export function useProfilingApplication(options: IUseProfilingApplicationOptions) {
  const store = useProfilingExploreStore();
  const loading = shallowRef(false);
  const detailLoading = shallowRef(false);
  let disposed = false;
  let detailSeq = 0;
  /** 首屏详情和 onReady 共用同一次查询，避免数据类型回填再打一遍图表 */
  let initialDetail = true;

  const applicationList = computed<IProfilingApplication[]>(() => [
    ...store.appList.normal,
    ...store.appList.no_data,
  ]);

  async function loadApplications() {
    loading.value = true;
    const [start_time, end_time] = handleTransformToTimestamp(get(options.timeRange));
    const { data, isAborted } = await fetchApplicationServices({ start_time, end_time });
    if (isAborted || disposed) return;
    store.appList = data;
    loading.value = false;
    ensureDefaultSelection(data);
    await loadServiceDetail();
    initialDetail = false;
    options.onReady?.();
  }

  function ensureDefaultSelection(list: IProfilingApplicationList) {
    if (store.appName && store.serviceName) {
      const matched = [...list.normal, ...list.no_data].find(item => item.app_name === store.appName);
      if (matched?.services.some(service => service.name === store.serviceName)) return;
    }
    const firstApp = list.normal[0] || list.no_data[0];
    const firstService = firstApp?.services?.[0];
    if (!firstApp || !firstService) return;
    store.appName = firstApp.app_name;
    store.serviceName = firstService.name;
  }

  async function loadServiceDetail() {
    if (!store.appName || !store.serviceName) {
      store.serviceDetail = null;
      return;
    }
    const seq = ++detailSeq;
    detailLoading.value = true;
    const [start_time, end_time] = handleTransformToTimestamp(get(options.timeRange));
    const { data, isAborted } = await fetchServiceDetail({
      start_time,
      end_time,
      app_name: store.appName,
      service_name: store.serviceName,
    });
    if (isAborted || disposed || seq !== detailSeq) return;
    store.serviceDetail = data;
    const prevType = store.dataType;
    syncDataType(data?.data_types || []);
    detailLoading.value = false;
    if (!initialDetail && store.dataType !== prevType) options.onDataTypeChange?.();
  }

  function syncDataType(dataTypes: { default_agg_method?: string; key: string; name?: string }[]) {
    const list = dataTypes.filter(item => item.key);
    if (!list.length) {
      store.dataType = '';
      return;
    }
    const matched = list.find(item => item.key === store.dataType);
    if (matched) {
      if (!store.aggMethod) {
        store.aggMethod = matched.default_agg_method || 'AVG';
      }
      return;
    }
    store.dataType = list[0].key;
    store.aggMethod = list[0].default_agg_method || 'AVG';
  }

  const stop = watch(
    () => [store.appName, store.serviceName, get(options.timeRange)] as const,
    () => {
      loadServiceDetail();
    }
  );

  onScopeDispose(() => {
    disposed = true;
    stop();
  });

  return {
    applicationList,
    detailLoading,
    loading,
    loadApplications,
    loadServiceDetail,
  };
}

export type UseProfilingApplicationReturn = ReturnType<typeof useProfilingApplication>;
