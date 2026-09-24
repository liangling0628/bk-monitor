import { type PropType, defineComponent } from 'vue';

import { useI18n } from 'vue-i18n';

import RetrievalFilter from '../../../../components/retrieval-filter/retrieval-filter';
import { EMode } from '../../../../components/retrieval-filter/typing';
import useUserConfig from '../../../../hooks/useUserConfig';
import { useProfilingExploreStore } from '../../../../store/modules/profiling-explore';
import { PROFILING_RESIDENT_KEY } from '../../constants';
import DataTypeToolbar from '../data-type-toolbar/data-type-toolbar';
import ProfileVisualization from '../profile-visualization/profile-visualization';
import TrendPanel from '../trend-panel/trend-panel';

import type { IFilterField, IGetValueFnParams, IWhereValueOptionsItem } from '../../../../components/retrieval-filter/typing';
import type { UseProfilingQueryReturn } from '../../composables/use-profiling-query';
import type { UseProfilingVisualizationReturn } from '../../composables/use-profiling-visualization';
import type { IProfilingDataType } from '../../typings';

import './application-service-panel.scss';

export default defineComponent({
  name: 'ApplicationServicePanel',
  props: {
    queryCtx: {
      type: Object as PropType<UseProfilingQueryReturn>,
      required: true,
    },
    visualization: {
      type: Object as PropType<UseProfilingVisualizationReturn>,
      required: true,
    },
    fields: {
      type: Array as PropType<IFilterField[]>,
      default: () => [],
    },
    dataTypeList: {
      type: Array as PropType<IProfilingDataType[]>,
      default: () => [],
    },
    getValueFn: {
      type: Function as PropType<(params: IGetValueFnParams) => Promise<IWhereValueOptionsItem>>,
      required: true,
    },
    selectedFavorite: {
      type: Object as PropType<{ commonWhere?: unknown[]; where?: unknown[] }>,
      default: null,
    },
  },
  emits: {
    favorite: (_isEdit: boolean) => true,
    dataTypeChange: (_value: string) => true,
    aggMethodChange: (_value: string) => true,
  },
  setup() {
    const { t } = useI18n();
    const store = useProfilingExploreStore();
    const { handleGetUserConfig, handleSetUserConfig } = useUserConfig();
    return { t, store, handleGetUserConfig, handleSetUserConfig, residentSettingOnlyId: PROFILING_RESIDENT_KEY };
  },
  render() {
    const { queryCtx } = this;
    return (
      <div class='application-service-panel'>
        <div class='filter-row'>
          {this.store.dateCompared && <div class='compare-filter-label'>{this.t('查询项')}</div>}
          <RetrievalFilter
            commonWhere={queryCtx.commonWhere.value}
            fields={this.fields}
            filterMode={EMode.ui}
            getValueFn={this.getValueFn}
            handleGetUserConfig={this.handleGetUserConfig}
            handleSetUserConfig={this.handleSetUserConfig}
            isShowClear={true}
            isShowFavorite={!this.store.isCompared}
            isShowResident={true}
            isShowSearchBtn={true}
            isSingleMode={true}
            residentSettingOnlyId={this.residentSettingOnlyId}
            selectFavorite={this.selectedFavorite}
            where={queryCtx.where.value}
            onCommonWhereChange={value => {
              queryCtx.commonWhere.value = value;
              queryCtx.handleQuery();
            }}
            onFavorite={isEdit => this.$emit('favorite', isEdit)}
            onSearch={queryCtx.handleQuery}
            onWhereChange={value => {
              queryCtx.where.value = value;
              queryCtx.handleQuery();
            }}
          />
        </div>
        {this.store.isCompared && (
          <div class='filter-row'>
            <div class={['compare-filter-label', { 'is-icon': !this.store.dateCompared }]}>
              {this.store.dateCompared ? (
                this.t('对比项')
              ) : (
                <>
                  <i class='icon-monitor icon-duibi' />
                  <span>{this.t('对比')}</span>
                </>
              )}
            </div>
            <RetrievalFilter
              commonWhere={queryCtx.comparisonCommonWhere.value}
              fields={this.fields}
              filterMode={EMode.ui}
              getValueFn={this.getValueFn}
              handleGetUserConfig={this.handleGetUserConfig}
              handleSetUserConfig={this.handleSetUserConfig}
              isShowClear={true}
              isShowResident={true}
              isShowSearchBtn={true}
              isSingleMode={true}
              residentSettingOnlyId={this.residentSettingOnlyId}
              where={queryCtx.comparisonWhere.value}
              onCommonWhereChange={value => {
                queryCtx.comparisonCommonWhere.value = value;
                queryCtx.handleQuery();
              }}
              onSearch={queryCtx.handleQuery}
              onWhereChange={value => {
                queryCtx.comparisonWhere.value = value;
                queryCtx.handleQuery();
              }}
            />
          </div>
        )}
        <DataTypeToolbar
          aggMethod={this.store.aggMethod}
          dataType={this.store.dataType}
          dataTypeList={this.dataTypeList}
          onUpdate:aggMethod={val => this.$emit('aggMethodChange', val)}
          onUpdate:dataType={val => this.$emit('dataTypeChange', val)}
        />
        <TrendPanel
          queryParams={queryCtx.commonParams.value}
          onDateComparisonChange={val => {
            queryCtx.dateComparison.value = val;
          }}
        />
        <ProfileVisualization
          queryParams={queryCtx.graphQueryParams.value}
          visualization={this.visualization}
        />
      </div>
    );
  },
});
