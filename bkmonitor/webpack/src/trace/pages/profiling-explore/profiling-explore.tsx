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
import { computed, defineComponent, onBeforeUnmount, onMounted, shallowRef, useTemplateRef, watch } from 'vue';

import { random } from 'monitor-common/utils';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import useUserConfig from '../../hooks/useUserConfig';
import { useProfilingExploreStore } from '../../store/modules/profiling-explore';
import FavoriteBox, { EditFavorite } from '../trace-explore/components/favorite-box';
import ActiveCollectPanel from './components/active-collect-panel/active-collect-panel';
import ApplicationServicePanel from './components/application-service-panel/application-service-panel';
import FileAnalysisPanel from './components/file-analysis-panel/file-analysis-panel';
import ProfilingExploreHeader from './components/profiling-explore-header/profiling-explore-header';
import ServiceDetailSlider from './components/service-detail-slider/service-detail-slider';
import {
  useProfilingApplication,
  useProfilingFavorite,
  useProfilingLabels,
  useProfilingQuery,
  useProfilingVisualization,
} from './composables';
import { PROFILING_FAVORITE_TYPE, PROFILING_THUMBTACK_KEY, ProfilingTabEnum } from './constants';

import './profiling-explore.scss';

export default defineComponent({
  name: 'ProfilingExplore',
  setup() {
    const { t } = useI18n();
    const route = useRoute();
    const store = useProfilingExploreStore();
    const { handleGetUserConfig: getThumbtackConfig, handleSetUserConfig: setThumbtackConfig } = useUserConfig();

    const thumbtackList = shallowRef<string[]>([]);
    const detailShow = shallowRef(false);
    const favoriteBoxRef = useTemplateRef<InstanceType<typeof FavoriteBox>>('favoriteBoxRef');

    const queryCtx = useProfilingQuery();
    queryCtx.initFromUrl();

    const applicationCtx = useProfilingApplication({
      timeRange: computed(() => store.timeRange),
      onDataTypeChange: () => queryCtx.handleQuery(),
      onReady: () => queryCtx.handleQuery(),
    });
    const labelsCtx = useProfilingLabels({
      appName: computed(() => store.appName),
      serviceName: computed(() => store.serviceName),
      timeRange: computed(() => store.timeRange),
    });
    const visualization = useProfilingVisualization({
      canQuery: queryCtx.canQuery,
      queryParams: queryCtx.graphQueryParams,
      queryVersion: queryCtx.queryVersion,
    });
    const favoriteCtx = useProfilingFavorite({
      where: queryCtx.where,
      commonWhere: queryCtx.commonWhere,
      comparisonWhere: queryCtx.comparisonWhere,
      comparisonCommonWhere: queryCtx.comparisonCommonWhere,
      onApplied: () => queryCtx.handleQuery(),
    });

    watch(
      () => store.refreshImmediate,
      () => queryCtx.handleQuery()
    );
    watch(
      () => store.refreshInterval,
      interval => {
        if (refreshTimer) window.clearInterval(refreshTimer);
        if (interval <= 0) return;
        refreshTimer = window.setInterval(() => {
          store.refreshImmediate = random(4);
        }, interval);
      }
    );

    let refreshTimer = 0;

    async function initPage() {
      thumbtackList.value = ((await getThumbtackConfig(PROFILING_THUMBTACK_KEY)) as string[]) || [];
      await applicationCtx.loadApplications();
      labelsCtx.loadLabels();
    }

    function handleServiceChange() {
      queryCtx.handleQuery();
    }

    function handleDataTypeChange(value: string) {
      const matched = store.serviceDetail?.data_types?.find(item => item.key === value);
      store.dataType = value;
      store.aggMethod = matched?.default_agg_method || store.aggMethod || 'AVG';
      queryCtx.handleQuery();
    }

    function handleAggMethodChange(value: string) {
      store.aggMethod = value;
      queryCtx.handleQuery();
    }

    async function handleThumbtackChange(list: string[]) {
      thumbtackList.value = list;
      await setThumbtackConfig(PROFILING_THUMBTACK_KEY, JSON.stringify(list));
    }

    watch(
      () => store.dateCompared,
      val => {
        if (!val) queryCtx.dateComparison.value = {};
      }
    );

    onMounted(() => {
      initPage();
    });

    onBeforeUnmount(() => {
      if (refreshTimer) window.clearInterval(refreshTimer);
    });

    return {
      t,
      route,
      store,
      queryCtx,
      labelsCtx,
      visualization,
      favoriteCtx,
      applicationCtx,
      thumbtackList,
      detailShow,
      favoriteBoxRef,
      handleServiceChange,
      handleDataTypeChange,
      handleAggMethodChange,
      handleThumbtackChange,
    };
  },
  render() {
    const { favoriteCtx, queryCtx } = this;
    return (
      <div class='profiling-explore'>
        <div
          style={{ display: favoriteCtx.favoriteShow.value ? 'block' : 'none' }}
          class='favorite-panel'
        >
          <FavoriteBox
            ref='favoriteBoxRef'
            defaultFavoriteId={queryCtx.urlFavoriteId.value}
            type={PROFILING_FAVORITE_TYPE}
            onChange={favoriteCtx.applyFavorite}
            onClose={() => {
              favoriteCtx.favoriteShow.value = false;
            }}
            onOpenBlank={data => favoriteCtx.openFavoriteInBlank(data, this.route.path)}
          />
        </div>
        <div class='main-panel'>
          <ProfilingExploreHeader
            applicationList={this.applicationCtx.applicationList.value}
            favoriteShow={favoriteCtx.favoriteShow.value}
            thumbtackList={this.thumbtackList}
            onFavoriteShowChange={show => {
              favoriteCtx.favoriteShow.value = show;
            }}
            onServiceChange={this.handleServiceChange}
            onSetUrlParams={() => queryCtx.handleQuery()}
            onShowServiceDetail={() => {
              this.detailShow = true;
            }}
            onTabChange={() => queryCtx.setUrlParams()}
            onThumbtackChange={this.handleThumbtackChange}
          />
          <div class='profiling-explore-content'>
            {this.store.tab === ProfilingTabEnum.APPLICATION && (
              <ApplicationServicePanel
                dataTypeList={this.store.serviceDetail?.data_types || []}
                fields={this.labelsCtx.fields.value}
                getValueFn={this.labelsCtx.getFieldValues}
                queryCtx={queryCtx}
                selectedFavorite={favoriteCtx.selectedFavorite.value}
                visualization={this.visualization}
                onAggMethodChange={this.handleAggMethodChange}
                onDataTypeChange={this.handleDataTypeChange}
                onFavorite={isEdit => favoriteCtx.saveFavorite(isEdit, () => this.favoriteBoxRef?.refreshGroupList())}
              />
            )}
            {this.store.tab === ProfilingTabEnum.FILE && <FileAnalysisPanel />}
            {this.store.tab === ProfilingTabEnum.ACTIVE && <ActiveCollectPanel />}
          </div>
        </div>
        <ServiceDetailSlider
          detail={this.store.serviceDetail}
          show={this.detailShow}
          onShowChange={val => {
            this.detailShow = val;
          }}
        />
        <EditFavorite
          data={favoriteCtx.editFavoriteData.value}
          isCreate={true}
          isShow={favoriteCtx.editFavoriteShow.value}
          onClose={() => {
            favoriteCtx.editFavoriteShow.value = false;
          }}
          onSuccess={() => {
            favoriteCtx.editFavoriteShow.value = false;
            this.favoriteBoxRef?.refreshGroupList();
          }}
        />
      </div>
    );
  },
});
