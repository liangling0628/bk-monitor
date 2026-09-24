import { type MaybeRef, computed, onScopeDispose, shallowRef, watch } from 'vue';

import { get } from '@vueuse/core';

import { assignUniqueIds } from '../../../utils/utils';
import { ProfileViewModeEnum } from '../constants';
import { fetchProfileSamples } from '../services/profile-query';
import { buildDiagramTypes } from '../utils/transform';

import type { IProfilingQueryParams, ProfileViewModeType } from '../typings';
import type { BaseDataType, ProfilingTableItem } from 'monitor-ui/chart-plugins/typings';
import type { ProfileDataUnit } from 'monitor-ui/chart-plugins/plugins/profiling-graph/utils';

interface IUseProfilingVisualizationOptions {
  canQuery: MaybeRef<boolean>;
  queryParams: MaybeRef<IProfilingQueryParams>;
  queryVersion: MaybeRef<string>;
}

export function useProfilingVisualization(options: IUseProfilingVisualizationOptions) {
  const loading = shallowRef(false);
  /** 第一次查询结束前不展示空态，避免刷新时先闪「暂无数据」 */
  const settled = shallowRef(false);
  const viewMode = shallowRef<ProfileViewModeType>(ProfileViewModeEnum.COMBINE);
  const tableData = shallowRef<ProfilingTableItem[]>([]);
  const flameData = shallowRef<BaseDataType>({ name: '', children: undefined, id: '' });
  const topoSrc = shallowRef('');
  const unit = shallowRef<ProfileDataUnit>('nanoseconds');
  const keyword = shallowRef('');
  const highlightName = shallowRef('');
  let cancelFn = () => {};
  let disposed = false;
  let requestSeq = 0;

  const isCompared = computed(() => !!get(options.queryParams)?.is_compared);
  const displayModes = computed(() => [
    ProfileViewModeEnum.TABLE,
    ProfileViewModeEnum.COMBINE,
    ProfileViewModeEnum.FLAME,
    ProfileViewModeEnum.TOPO,
  ]);

  function resetData() {
    tableData.value = [];
    flameData.value = { name: '', children: undefined, id: '' };
    topoSrc.value = '';
    unit.value = 'nanoseconds';
  }

  async function loadData() {
    const seq = ++requestSeq;
    if (!get(options.canQuery)) {
      cancelFn();
      resetData();
      loading.value = false;
      settled.value = true;
      return;
    }
    cancelFn();
    loading.value = true;
    const { data, isAborted } = await fetchProfileSamples(
      {
        ...get(options.queryParams),
        diagram_types: buildDiagramTypes(viewMode.value),
      },
      c => {
        cancelFn = c;
      }
    );
    if (disposed || seq !== requestSeq || isAborted) return;
    if (!data || !Object.keys(data).length) {
      resetData();
      loading.value = false;
      settled.value = true;
      return;
    }
    unit.value = (data.unit as ProfileDataUnit) || 'nanoseconds';
    if (data.flame_data) {
      const flame = data.flame_data as BaseDataType;
      if (flame.children) assignUniqueIds(flame.children);
      flameData.value = flame;
    } else {
      flameData.value = { name: '', children: undefined, id: '' };
    }
    tableData.value = ((data.table_data as { items?: ProfilingTableItem[] })?.items || []).slice();
    topoSrc.value = (data.call_graph_data as string) || '';
    loading.value = false;
    settled.value = true;
  }

  function handleModeChange(mode: ProfileViewModeType) {
    if (mode === viewMode.value) return;
    viewMode.value = mode;
  }

  function handleKeywordChange(value: string) {
    keyword.value = value;
    highlightName.value = value;
  }

  function needQuery() {
    if (viewMode.value === ProfileViewModeEnum.FLAME && (flameData.value as { value?: number })?.value) return false;
    if (viewMode.value === ProfileViewModeEnum.TABLE && tableData.value?.length) return false;
    if (
      viewMode.value === ProfileViewModeEnum.COMBINE &&
      (flameData.value as { value?: number })?.value &&
      tableData.value?.length
    ) {
      return false;
    }
    if (viewMode.value === ProfileViewModeEnum.TOPO && topoSrc.value) return false;
    return true;
  }

  const stopParams = watch(
    () => [get(options.queryVersion), JSON.stringify(get(options.queryParams) || {})] as const,
    () => {
      loadData();
    }
  );
  const stopMode = watch(
    () => viewMode.value,
    () => {
      if (!needQuery()) return;
      loadData();
    }
  );

  onScopeDispose(() => {
    disposed = true;
    cancelFn();
    stopParams();
    stopMode();
  });

  return {
    displayModes,
    flameData,
    highlightName,
    isCompared,
    keyword,
    loading,
    settled,
    tableData,
    topoSrc,
    unit,
    viewMode,
    handleKeywordChange,
    handleModeChange,
    loadData,
  };
}

export type UseProfilingVisualizationReturn = ReturnType<typeof useProfilingVisualization>;
