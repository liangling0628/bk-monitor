import { computed, shallowRef } from 'vue';

import { random } from 'monitor-common/utils';
import { useRoute, useRouter } from 'vue-router';

import { EMode } from '../../../components/retrieval-filter/typing';
import { handleTransformToTimestamp } from '../../../components/time-range/utils';
import { useProfilingExploreStore } from '../../../store/modules/profiling-explore';
import { tryURLDecodeParse } from '../../trace-explore/utils';
import { ProfilingTabEnum } from '../constants';
import { mergeWhere, toMicroseconds, whereToFilterLabels } from '../utils/transform';

import type { IWhereItem } from '../../../components/retrieval-filter/typing';
import type { TimeRangeType } from '../../../components/time-range/utils';
import type { IDateComparison, IProfilingQueryParams, ProfilingTabType } from '../typings';

/**
 * 检索条件、对比态与 URL 同步。
 * commonParams 只在 handleQuery 时整体替换，避免输入过程打接口。
 */
export function useProfilingQuery() {
  const route = useRoute();
  const router = useRouter();
  const store = useProfilingExploreStore();

  const filterMode = shallowRef(EMode.ui);
  const where = shallowRef<IWhereItem[]>([]);
  const commonWhere = shallowRef<IWhereItem[]>([]);
  const comparisonWhere = shallowRef<IWhereItem[]>([]);
  const comparisonCommonWhere = shallowRef<IWhereItem[]>([]);
  const dateComparison = shallowRef<IDateComparison>({});
  const urlFavoriteId = shallowRef<null | number>(null);
  const queryVersion = shallowRef('');

  const canQuery = computed(() => !!(store.appName && store.serviceName && store.dataType));

  const commonParams = computed<IProfilingQueryParams>(() => {
    const [start, end] = handleTransformToTimestamp(store.timeRange);
    return {
      app_name: store.appName,
      service_name: store.serviceName,
      data_type: store.dataType,
      agg_method: store.aggMethod,
      is_compared: store.isCompared,
      global_query: false,
      filter_labels: whereToFilterLabels(mergeWhere(where.value, commonWhere.value)),
      diff_filter_labels: store.isCompared
        ? whereToFilterLabels(mergeWhere(comparisonWhere.value, comparisonCommonWhere.value))
        : {},
      start: toMicroseconds(start),
      end: toMicroseconds(end),
    };
  });

  /** 火焰/表格/拓扑使用：时间对比框选写入 filter_labels，趋势图仍走完整时间范围 */
  const graphQueryParams = computed<IProfilingQueryParams>(() => {
    const { filter_labels, diff_filter_labels, ...rest } = commonParams.value;
    const { start, end, diffStart, diffEnd } = dateComparison.value;
    return {
      ...rest,
      filter_labels: {
        ...filter_labels,
        ...(store.dateCompared && start && end ? { start, end } : {}),
      },
      diff_filter_labels: {
        ...diff_filter_labels,
        ...(store.dateCompared && diffStart && diffEnd ? { start: diffStart, end: diffEnd } : {}),
      },
    };
  });

  function handleQuery() {
    queryVersion.value = random(8);
    setUrlParams();
  }

  function setUrlParams() {
    const query: Record<string, string> = {
      tab: store.tab,
      app_name: encodeURIComponent(store.appName || ''),
      service_name: encodeURIComponent(store.serviceName || ''),
      timeRange: encodeURIComponent(JSON.stringify(store.timeRange)),
      timezone: encodeURIComponent(store.timezone),
      refreshInterval: `${store.refreshInterval}`,
      isCompared: `${store.isCompared}`,
      dateCompared: `${store.dateCompared}`,
      dataType: store.dataType,
      aggMethod: store.aggMethod,
      where: encodeURIComponent(JSON.stringify(where.value)),
      commonWhere: encodeURIComponent(JSON.stringify(commonWhere.value)),
      comparisonWhere: encodeURIComponent(JSON.stringify(comparisonWhere.value)),
      comparisonCommonWhere: encodeURIComponent(JSON.stringify(comparisonCommonWhere.value)),
    };
    if (urlFavoriteId.value) {
      query.favorite_id = `${urlFavoriteId.value}`;
    }
    router.replace({ query }).catch(() => {});
  }

  function initFromUrl() {
    const query = route.query as Record<string, string>;
    store.init({
      tab: (query.tab as ProfilingTabType) || ProfilingTabEnum.APPLICATION,
      appName: decodeURIComponent(query.app_name || ''),
      serviceName: decodeURIComponent(query.service_name || ''),
      timeRange: query.timeRange ? tryURLDecodeParse<TimeRangeType>(query.timeRange, undefined) : undefined,
      timezone: decodeURIComponent(query.timezone || '') || window.timezone,
      refreshInterval: query.refreshInterval ? Number(query.refreshInterval) : -1,
      isCompared: query.isCompared === 'true',
      dateCompared: query.dateCompared === 'true',
      dataType: query.dataType || '',
      aggMethod: query.aggMethod || 'AVG',
    });
    where.value = tryURLDecodeParse<IWhereItem[]>(query.where, []);
    commonWhere.value = tryURLDecodeParse<IWhereItem[]>(query.commonWhere, []);
    comparisonWhere.value = tryURLDecodeParse<IWhereItem[]>(query.comparisonWhere, []);
    comparisonCommonWhere.value = tryURLDecodeParse<IWhereItem[]>(query.comparisonCommonWhere, []);
    urlFavoriteId.value = query.favorite_id ? Number(query.favorite_id) : null;
  }

  function clearQuery() {
    where.value = [];
    commonWhere.value = [];
    comparisonWhere.value = [];
    comparisonCommonWhere.value = [];
    dateComparison.value = {};
    handleQuery();
  }

  return {
    canQuery,
    commonParams,
    commonWhere,
    comparisonCommonWhere,
    comparisonWhere,
    dateComparison,
    graphQueryParams,
    filterMode,
    queryVersion,
    urlFavoriteId,
    where,
    clearQuery,
    handleQuery,
    initFromUrl,
    setUrlParams,
  };
}

export type UseProfilingQueryReturn = ReturnType<typeof useProfilingQuery>;
