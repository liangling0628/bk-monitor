import { type PropType, computed, defineComponent, onScopeDispose, provide, shallowRef, watch } from 'vue';

import { Radio } from 'bkui-vue';
import { random } from 'monitor-common/utils/utils';
import { getDefaultTimezone } from 'monitor-pc/i18n/dayjs';
import { useI18n } from 'vue-i18n';

import ChartCollapse from '@/pages/trace-explore/components/explore-chart/chart-collapse';

import TimeSeries from '../../../../plugins/charts/time-series/time-series';
import {
  REFRESH_IMMEDIATE_KEY,
  REFRESH_INTERVAL_KEY,
  TIME_OFFSET_KEY,
  TIME_RANGE_KEY,
  TIMEZONE_KEY,
  VIEW_OPTIONS_KEY,
} from '../../../../plugins/hooks';
import { PanelModel } from '../../../../plugins/typings';
import { useProfilingExploreStore } from '../../../../store/modules/profiling-explore';
import { TrendSourceEnum } from '../../constants';
import { fetchTrendSeries } from '../../services/profile-query';
import TimeCompareChart from '../time-compare-chart/time-compare-chart';

import type { IViewOptions } from 'monitor-ui/chart-plugins/typings';
import type { IDateComparison, IProfilingQueryParams, ITrendSeriesItem, TrendSourceType } from '../../typings';

import './trend-panel.scss';

const DEFAULT_PANEL_CONFIG = {
  title: '',
  gridPos: { x: 16, y: 16, w: 8, h: 4 },
  type: 'graph',
  targets: [],
};

export default defineComponent({
  name: 'TrendPanel',
  props: {
    queryParams: {
      type: Object as PropType<IProfilingQueryParams>,
      default: () => ({}),
    },
  },
  emits: {
    dateComparisonChange: (_value: IDateComparison) => true,
  },
  setup(props, { emit }) {
    const { t } = useI18n();
    const store = useProfilingExploreStore();
    const source = shallowRef<TrendSourceType>(TrendSourceEnum.ALL);
    const chartData = shallowRef<ITrendSeriesItem[]>([]);
    const compareLoading = shallowRef(false);
    const comparisonPosition = shallowRef<[number, number][]>([]);
    const panel = shallowRef<PanelModel>(null);
    const timeSeriesChartRef = shallowRef<{ options?: { series?: unknown[] }; setOptions?: (opt: unknown) => void }>();
    const timezone = shallowRef(getDefaultTimezone());
    const defaultViewOptions = shallowRef<IViewOptions>({});
    const chartTime = { start: 0, end: 0, mid: 0 };
    let cancelTrend = () => {};

    const timeRange = computed(() => store.timeRange);
    const refreshInterval = computed(() => store.refreshInterval);
    const refreshImmediate = computed(() => store.refreshImmediate);

    provide(TIME_RANGE_KEY, timeRange);
    provide(TIMEZONE_KEY, timezone);
    provide(REFRESH_INTERVAL_KEY, refreshInterval);
    provide(REFRESH_IMMEDIATE_KEY, refreshImmediate);
    provide(VIEW_OPTIONS_KEY, defaultViewOptions);
    provide(TIME_OFFSET_KEY, shallowRef([]));

    function buildPanel() {
      const allTrend = source.value === TrendSourceEnum.ALL;
      const { start: _start, end: _end, ...rest } = props.queryParams;
      panel.value = new PanelModel({
        ...DEFAULT_PANEL_CONFIG,
        id: random(6),
        options: { time_series: { type: allTrend ? 'line' : 'bar' } },
        targets: [
          {
            api: allTrend ? 'apm_profile.query' : 'apm_profile.queryProfileBarGraph',
            datasource: 'time_series',
            alias: '',
            data: {
              ...rest,
              ...(allTrend ? { diagram_types: ['tendency'] } : {}),
            },
          },
        ],
      });
    }

    function handleComparisonDateChange() {
      emit('dateComparisonChange', {
        start: Math.floor((comparisonPosition.value[0]?.[0] || 0) / 1000) * 1000000,
        end: Math.floor((comparisonPosition.value[0]?.[1] || 0) / 1000) * 1000000,
        diffStart: Math.floor((comparisonPosition.value[1]?.[0] || 0) / 1000) * 1000000,
        diffEnd: Math.floor((comparisonPosition.value[1]?.[1] || 0) / 1000) * 1000000,
      });
    }

    function setDefaultDate() {
      if (!chartData.value.length || !store.dateCompared) return;
      comparisonPosition.value = [
        [chartTime.start, chartTime.mid],
        [chartTime.mid, chartTime.end],
      ];
      handleComparisonDateChange();
    }

    function handleChartData(data: ITrendSeriesItem[]) {
      chartData.value = data || [];
      const points = data?.[0]?.datapoints || [];
      if (!points.length) return;
      chartTime.start = points[0][1];
      chartTime.end = points[points.length - 1][1];
      chartTime.mid = chartTime.start + (chartTime.end - chartTime.start) / 2;
      setDefaultDate();
    }

    function handleBrushEnd(data: number[], type: 'comparison' | 'search') {
      const next: [number, number][] = [...comparisonPosition.value];
      next[type === 'search' ? 0 : 1] = data as [number, number];
      comparisonPosition.value = next;
      handleComparisonDateChange();
    }

    async function loadCompareSeries() {
      cancelTrend();
      compareLoading.value = true;
      const { data, isAborted } = await fetchTrendSeries(props.queryParams, 'all', cancel => {
        cancelTrend = cancel;
      });
      if (isAborted) return;
      const list = ((data as { series?: ITrendSeriesItem[] } | null)?.series || []) as ITrendSeriesItem[];
      handleChartData(list);
      compareLoading.value = false;
    }

    watch(
      () => [props.queryParams, source.value, store.dateCompared] as const,
      () => {
        if (store.dateCompared) return;
        buildPanel();
      },
      { immediate: true, deep: true }
    );

    watch(
      () => [store.dateCompared, props.queryParams] as const,
      () => {
        if (!store.dateCompared) {
          cancelTrend();
          return;
        }
        emit('dateComparisonChange', {});
        loadCompareSeries();
      },
      { deep: true, immediate: true }
    );

    onScopeDispose(() => cancelTrend());

    watch(
      () => store.dateCompared,
      val => {
        if (!val) {
          comparisonPosition.value = [];
          emit('dateComparisonChange', {});
          return;
        }
        setDefaultDate();
      }
    );

    return {
      t,
      store,
      source,
      panel,
      chartData,
      compareLoading,
      comparisonPosition,
      timeSeriesChartRef,
      handleSourceChange: (val: TrendSourceType) => {
        source.value = val;
      },
      handleChartData,
      handleBrushEnd,
    };
  },
  render() {
    return (
      <div class='profiling-trend-panel'>
        {this.store.dateCompared ? (
          <TimeCompareChart
            diffRange={this.comparisonPosition[1]}
            loading={this.compareLoading}
            queryRange={this.comparisonPosition[0]}
            series={this.chartData}
            onBrushEnd={this.handleBrushEnd}
          />
        ) : (
          <ChartCollapse
            defaultHeight={180}
            hasResize={true}
            maxHeight={360}
            minHeight={120}
            title=''
          >
            {{
              headerCustom: () => (
                <Radio.Group
                  class='trend-source-tabs'
                  modelValue={this.source}
                  type='capsule'
                  onChange={this.handleSourceChange}
                >
                  <Radio.Button label={TrendSourceEnum.ALL}>{this.t('总趋势')}</Radio.Button>
                  <Radio.Button label={TrendSourceEnum.TRACE}>{this.t('Trace 数据')}</Radio.Button>
                </Radio.Group>
              ),
              default: () =>
                this.panel ? (
                  <TimeSeries
                    key={this.source}
                    ref='timeSeriesChartRef'
                    needChartLoading={true}
                    panel={this.panel}
                    showChartHeader={false}
                    onChartData={this.handleChartData}
                  />
                ) : undefined,
            }}
          </ChartCollapse>
        )}
      </div>
    );
  },
});
