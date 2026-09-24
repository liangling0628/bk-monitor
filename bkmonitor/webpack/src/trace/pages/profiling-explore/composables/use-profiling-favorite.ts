import { computed, shallowRef } from 'vue';

import { Message } from 'bkui-vue';
import { updateFavorite } from 'monitor-api/modules/model';
import { useI18n } from 'vue-i18n';

import { handleTransformToTimestamp } from '../../../components/time-range/utils';
import { useAppStore } from '../../../store/modules/app';
import { useProfilingExploreStore } from '../../../store/modules/profiling-explore';
import { EMode } from '../../../components/retrieval-filter/typing';
import { PROFILING_FAVORITE_TYPE } from '../constants';

import type { IWhereItem } from '../../../components/retrieval-filter/typing';
import type { IProfilingFavoriteConfig } from '../typings';
import type { UseProfilingQueryReturn } from './use-profiling-query';

interface IProfilingFavoriteItem {
  config: IProfilingFavoriteConfig;
  id: number;
  name: string;
}

interface IUseProfilingFavoriteOptions {
  commonWhere: UseProfilingQueryReturn['commonWhere'];
  comparisonCommonWhere: UseProfilingQueryReturn['comparisonCommonWhere'];
  comparisonWhere: UseProfilingQueryReturn['comparisonWhere'];
  where: UseProfilingQueryReturn['where'];
  onApplied: () => void;
}

export function useProfilingFavorite(options: IUseProfilingFavoriteOptions) {
  const { t } = useI18n();
  const appStore = useAppStore();
  const store = useProfilingExploreStore();

  const currentFavorite = shallowRef<IProfilingFavoriteItem | null>(null);
  const editFavoriteShow = shallowRef(false);
  const editFavoriteData = shallowRef(null);
  const favoriteShow = shallowRef(false);

  const selectedFavorite = computed(() => {
    if (!currentFavorite.value) return null;
    return {
      where: currentFavorite.value.config?.queryParams?.filters || [],
      commonWhere: [],
    };
  });

  function buildPayload() {
    const [startTime, endTime] = handleTransformToTimestamp(store.timeRange);
    return {
      config: {
        bk_biz_id: appStore.bizId,
        componentData: {
          tab: store.tab,
          filterMode: EMode.ui,
          timeRange: store.timeRange,
          refreshInterval: store.refreshInterval,
          isCompared: store.isCompared,
          dateCompared: store.dateCompared,
          dataType: store.dataType,
          aggMethod: store.aggMethod,
          serviceName: store.serviceName,
          commonWhere: options.commonWhere.value,
          comparisonCommonWhere: options.comparisonCommonWhere.value,
          comparisonWhere: options.comparisonWhere.value,
        },
        queryParams: {
          app_name: store.appName,
          service_name: store.serviceName,
          start_time: startTime,
          end_time: endTime,
          filters: options.where.value,
        },
      } as IProfilingFavoriteConfig,
    };
  }

  async function saveFavorite(isEdit = false, onUpdated?: () => void) {
    const payload = buildPayload();
    if (!isEdit || !currentFavorite.value) {
      editFavoriteData.value = payload;
      editFavoriteShow.value = true;
      return;
    }
    await updateFavorite(currentFavorite.value.id, { type: PROFILING_FAVORITE_TYPE, ...payload });
    onUpdated?.();
    Message({ theme: 'success', message: t('收藏成功') });
  }

  function applyFavorite(favorite: IProfilingFavoriteItem | null) {
    currentFavorite.value = favorite || null;
    if (!favorite) {
      options.where.value = [];
      options.commonWhere.value = [];
      options.comparisonWhere.value = [];
      options.comparisonCommonWhere.value = [];
      options.onApplied();
      return;
    }
    const { componentData, queryParams } = favorite.config || ({} as IProfilingFavoriteConfig);
    options.where.value = (queryParams?.filters || []) as IWhereItem[];
    options.commonWhere.value = (componentData?.commonWhere || []) as IWhereItem[];
    options.comparisonWhere.value = (componentData?.comparisonWhere || []) as IWhereItem[];
    options.comparisonCommonWhere.value = (componentData?.comparisonCommonWhere || []) as IWhereItem[];
    store.init({
      tab: componentData?.tab || store.tab,
      appName: queryParams?.app_name || store.appName,
      serviceName: queryParams?.service_name || componentData?.serviceName || store.serviceName,
      timeRange: componentData?.timeRange,
      timezone: store.timezone,
      refreshInterval: componentData?.refreshInterval,
      isCompared: componentData?.isCompared,
      dateCompared: componentData?.dateCompared,
      dataType: componentData?.dataType,
      aggMethod: componentData?.aggMethod,
    });
    options.onApplied();
  }

  function openFavoriteInBlank(favorite: IProfilingFavoriteItem, routePath: string) {
    const href = `${location.origin}${location.pathname}?bizId=${appStore.bizId}#${routePath}`;
    window.open(`${href}?favorite_id=${favorite.id}`, '_blank');
  }

  return {
    currentFavorite,
    editFavoriteData,
    editFavoriteShow,
    favoriteShow,
    selectedFavorite,
    applyFavorite,
    openFavoriteInBlank,
    saveFavorite,
  };
}

export type UseProfilingFavoriteReturn = ReturnType<typeof useProfilingFavorite>;
