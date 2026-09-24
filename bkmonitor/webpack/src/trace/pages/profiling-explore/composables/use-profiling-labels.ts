import { type MaybeRef, computed, onScopeDispose, shallowRef, watch } from 'vue';

import { get } from '@vueuse/core';

import { handleTransformToTimestamp } from '../../../components/time-range/utils';
import { fetchLabelKeys, fetchLabelValues } from '../services/labels';
import { labelsToFilterFields, toMicroseconds } from '../utils/transform';

import type { IFilterField, IGetValueFnParams, IWhereValueOptionsItem } from '../../../components/retrieval-filter/typing';
import type { TimeRangeType } from '../../../components/time-range/utils';

interface IUseProfilingLabelsOptions {
  appName: MaybeRef<string>;
  serviceName: MaybeRef<string>;
  timeRange: MaybeRef<TimeRangeType>;
}

export function useProfilingLabels(options: IUseProfilingLabelsOptions) {
  const loading = shallowRef(false);
  const labelKeys = shallowRef<string[]>([]);
  let disposed = false;

  const fields = computed<IFilterField[]>(() => labelsToFilterFields(labelKeys.value));

  const commonParams = computed(() => {
    const [start, end] = handleTransformToTimestamp(get(options.timeRange));
    return {
      app_name: get(options.appName),
      service_name: get(options.serviceName),
      global_query: false,
      start: toMicroseconds(start),
      end: toMicroseconds(end),
    };
  });

  async function loadLabels() {
    if (!get(options.appName) || !get(options.serviceName)) {
      labelKeys.value = [];
      return;
    }
    loading.value = true;
    const { data, isAborted } = await fetchLabelKeys(commonParams.value);
    if (isAborted || disposed) return;
    labelKeys.value = data;
    loading.value = false;
  }

  async function getFieldValues(params: IGetValueFnParams): Promise<IWhereValueOptionsItem> {
    if (!params.field) return { count: 0, list: [] };
    const { data, isAborted } = await fetchLabelValues({
      ...commonParams.value,
      label_key: params.field,
      value: params.search || '',
    });
    if (isAborted) return { count: 0, list: [] };
    return { count: data.length, list: data };
  }

  const stop = watch(
    () => [get(options.appName), get(options.serviceName), get(options.timeRange)] as const,
    () => {
      loadLabels();
    }
  );

  onScopeDispose(() => {
    disposed = true;
    stop();
  });

  return {
    fields,
    loading,
    getFieldValues,
    loadLabels,
  };
}

export type UseProfilingLabelsReturn = ReturnType<typeof useProfilingLabels>;
