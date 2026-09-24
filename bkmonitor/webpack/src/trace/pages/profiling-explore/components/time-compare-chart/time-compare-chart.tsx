import { type PropType, defineComponent, nextTick, shallowRef, watch } from 'vue';

import { getValueFormat } from 'monitor-ui/monitor-echarts/valueFormats';
import { useI18n } from 'vue-i18n';

import ChartSkeleton from '../../../../components/skeleton/chart-skeleton';
import BaseEchart from '../../../../plugins/base-echart';
import { useChartResize } from '../../../../plugins/hooks';
import { Toolbox } from '../../../../plugins/typings';

import type { ITrendSeriesItem } from '../../typings';

import './time-compare-chart.scss';

const COLORS = ['#3A84FF', '#FF9C01'];
const AREA_COLORS = ['rgba(58, 132, 255, 0.1)', 'rgba(255, 156, 1, 0.12)'];
const HANDLE_COLORS = ['#699DF4', '#FFB848'];

const TimeCompareCard = defineComponent({
  name: 'TimeCompareCard',
  props: {
    data: {
      type: Object as PropType<ITrendSeriesItem>,
      default: null,
    },
    comparisonDate: {
      type: Array as PropType<number[]>,
      default: () => [],
    },
    title: {
      type: String,
      default: '',
    },
    colorIndex: {
      type: Number,
      default: 0,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    brushEnd: (_value: number[]) => true,
  },
  setup(props, { emit }) {
    const { t } = useI18n();
    const baseEchart = shallowRef<{ dispatchAction?: (payload: unknown) => void }>();
    const chartContainer = shallowRef<HTMLDivElement>();
    const width = shallowRef(300);
    const height = shallowRef(100);
    const options = shallowRef<Record<string, unknown>>({});
    const brushCoordRange = shallowRef<number[]>([]);
    useChartResize(chartContainer, chartContainer, width, height);

    function getSeriesData(isCustom = false) {
      if (!props.data?.datapoints?.length) return [];
      const data = props.data.datapoints.map(item => [item[1], item[0]]);
      if (!isCustom) return data;
      const customData = [];
      const [start, end] = brushCoordRange.value;
      for (let i = 0, len = data.length; i < len; i++) {
        const [time] = data[i];
        if (i === 0 || i === len - 1) {
          if (start < time || start > time) customData.push([start, 1]);
          if (end < time || end > time) customData.push([end, 1]);
          customData.push([time, null]);
          continue;
        }
        customData.push([time, null]);
        if (!brushCoordRange.value.length) continue;
        const [preTime] = data[i - 1];
        const [nextTime] = data[i + 1];
        if (start >= preTime && start <= time) {
          customData.push([start, 1]);
          continue;
        }
        if (end >= time && end <= nextTime) customData.push([end, 1]);
      }
      return customData;
    }

    function setChartBrush() {
      baseEchart.value?.dispatchAction?.({
        type: 'brush',
        areas: brushCoordRange.value.length
          ? [{ brushType: 'lineX', xAxisIndex: 0, coordRange: brushCoordRange.value }]
          : [],
      });
    }

    function setOptions(hasSetChartBrush = true) {
      if (!props.data) return;
      const colorIndex = props.colorIndex;
      options.value = {
        animation: false,
        xAxis: [
          {
            type: 'time',
            axisLine: { lineStyle: { color: '#F0F1F5' } },
            axisLabel: { color: '#979BA5' },
            axisTick: { show: false },
            splitLine: { show: false },
          },
        ],
        yAxis: {
          type: 'value',
          axisTick: { show: false },
          axisLabel: {
            formatter: (v: number) => {
              if (props.data.unit && props.data.unit !== 'none') {
                const obj = getValueFormat(props.data.unit)(v, 0);
                return obj.text + (obj.suffix || '');
              }
              return v;
            },
          },
          splitNumber: 2,
          minInterval: 1,
          position: 'left',
        },
        toolbox: { showTitle: false, itemSize: 0, feature: { brush: {} } },
        brush: {
          xAxisIndex: 'all',
          brushLink: 'all',
          toolbox: ['lineX', 'clear'],
          brushStyle: {
            borderType: 'dashed',
            color: AREA_COLORS[colorIndex],
          },
          outOfBrush: { colorAlpha: 0.1 },
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(54,58,67,.88)',
          borderWidth: 0,
        },
        grid: { left: 16, top: 10, right: 40, bottom: 10, containLabel: true },
        series: [
          {
            name: props.title,
            type: 'line',
            data: getSeriesData(false),
            lineStyle: { color: COLORS[colorIndex] },
            showSymbol: false,
            unitFormatter:
              props.data.unit && props.data.unit !== 'none'
                ? getValueFormat(props.data.unit)
                : (v: number) => ({ text: v }),
            precision: 2,
          },
          {
            type: 'custom',
            renderItem: (params, api) => {
              const xValue = api.value(0);
              if (Number.isNaN(xValue)) return;
              const x = api.coord([xValue, 0])[0];
              const coordSys = params.coordSys;
              const handleHeight = 24;
              return {
                type: 'rect',
                shape: {
                  x: x - 2,
                  y: coordSys.y + (coordSys.height - handleHeight) / 2,
                  width: 4,
                  height: handleHeight,
                  r: 2,
                },
                style: {
                  fill: HANDLE_COLORS[colorIndex],
                  stroke: HANDLE_COLORS[colorIndex],
                },
              };
            },
            tooltip: { show: false },
            data: getSeriesData(true),
            z: 100000,
            silent: true,
          },
        ],
      };
      if (hasSetChartBrush) {
        nextTick(() => setChartBrush());
      }
    }

    watch(
      () => props.data,
      () => setOptions(),
      { immediate: true }
    );
    watch(height, () => {
      setOptions();
    });

    watch(
      () => props.comparisonDate,
      val => {
        brushCoordRange.value = val || [];
        setOptions();
      },
      { immediate: true }
    );

    function handleBrushEnd(data) {
      const coordRange = data.areas?.[0]?.coordRange || [];
      if (!coordRange.length) return;
      brushCoordRange.value = coordRange;
      emit('brushEnd', brushCoordRange.value);
    }

    function handleBrush(data) {
      const coordRange = data.areas?.[0]?.coordRange || [];
      if (coordRange.length) brushCoordRange.value = coordRange;
      setOptions(!coordRange.length);
    }

    return {
      t,
      baseEchart,
      chartContainer,
      width,
      height,
      options,
      setChartBrush,
      handleBrushEnd,
      handleBrush,
    };
  },
  render() {
    return (
      <div
        ref='chartContainer'
        class='time-compare-item'
      >
        <div class='time-compare-title'>{this.title}</div>
        <div class='time-compare-chart-wrap'>
          {this.loading ? (
            <ChartSkeleton />
          ) : this.data ? (
            <BaseEchart
              ref='baseEchart'
              width={this.width}
              height={this.height}
              notMerge={false}
              options={this.options}
              toolbox={[Toolbox.Brush, Toolbox.DataZoom]}
              onBrush={this.handleBrush}
              onBrushEnd={this.handleBrushEnd}
              onLoaded={this.setChartBrush}
            />
          ) : (
            <div class='time-compare-empty'>{this.t('查无数据')}</div>
          )}
        </div>
      </div>
    );
  },
});

export default defineComponent({
  name: 'TimeCompareChart',
  props: {
    series: {
      type: Array as PropType<ITrendSeriesItem[]>,
      default: () => [],
    },
    queryRange: {
      type: Array as PropType<number[]>,
      default: () => [],
    },
    diffRange: {
      type: Array as PropType<number[]>,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    brushEnd: (_value: number[], _type: 'comparison' | 'search') => true,
  },
  setup() {
    const { t } = useI18n();
    return { t };
  },
  render() {
    return (
      <div class='profiling-time-compare-chart'>
        <TimeCompareCard
          colorIndex={0}
          comparisonDate={this.queryRange}
          data={this.series[0]}
          loading={this.loading}
          title={this.t('查询项')}
          onBrushEnd={val => this.$emit('brushEnd', val, 'search')}
        />
        <TimeCompareCard
          colorIndex={1}
          comparisonDate={this.diffRange}
          data={this.series[1]}
          loading={this.loading}
          title={this.t('对比项')}
          onBrushEnd={val => this.$emit('brushEnd', val, 'comparison')}
        />
      </div>
    );
  },
});
