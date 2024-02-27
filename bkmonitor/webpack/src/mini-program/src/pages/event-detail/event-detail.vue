<template>
  <div class="event-detail-page">
    <div class="charts-container">
      <monitor-chart
        canvas-id="event-detail"
        :options="chartOptions"
      />
    </div>


    <div class="event-detail-page-content">
      <div class="status-condition">
        <type-filter
          :list="typeList"
          :active-type="activeType"
        />
      </div>
      <div class="event-info">
        <van-cell
          v-for="item of data"
          :key="item.label"
          :title="item.label"
          :value="item.value"
        />
      </div>
    </div>


    <div class="event-detail-page-footer">
      <van-button
        class="confirm-btn"
        type="primary"
        size="large"
        plain
        block
        @click="handleJumpShield"
      >
        {{ t('快捷屏蔽') }}
      </van-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { onLoad } from '@dcloudio/uni-app';
  import { ref, onMounted } from 'vue';
  import { EChartOption } from 'echarts';
  import { useI18n } from 'vue-i18n';
  import { EventInfoItem } from '../../typings/event-detail';
  import MonitorChart from '../../components/monitor-chart/monitor-chart.vue';
  import TypeFilter from '../../components/type-filter/type-filter.vue';
  import { ITypeFilterItem } from '../../components/type-filter/typings';
  import './event-detail.scss';

  const { t }  = useI18n();


  const chartOptions: EChartOption = {
    grid: {
      top: 16,
      left: 16,
      right: 16,
      bottom: 16,
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      boundaryGap: false,
      axisLabel: {
        margin: 11,
        color: '#C4C6CC',
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'rgba(240, 241, 244, 0)', // 0% 处的颜色
            }, {
              offset: 1, color: '#DCDEE5', // 100% 处的颜色
            }],
            global: false,
          },
        },
      },
    },
    yAxis: {
      type: 'value',
      min: 0,
      axisLabel: {
        color: '#63656E',
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
    backgroundColor: '#FAFBFD',
    series: [
      {
        name: '测试',
        type: 'line',
        data: [
          [0, 10],
          [10, 20],
          [20, 30],
          [30, 10],
          [40, 40],
          [50, 20],
          [60, 30],
        ],
        smooth: true,
        symbol: 'none',
        lineStyle: {
          width: 2,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: '#3A84FF', // 0% 处的颜色
            }, {
              offset: 1, color: '#18C0A1', // 100% 处的颜色
            }],
            global: false,
          },
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'rgba(58, 132, 255, 0.2)', // 0% 处的颜色
            }, {
              offset: 1, color: 'rgba(24, 192, 161, 0.02)', // 100% 处的颜色
            }],
            global: false,
          },
        },
      },
    ],
  };

  // 状态查询条件
  const typeList:ITypeFilterItem[] = [
    { name: t('致命'), value: 1, background: '#F0F1F5', icon: 'warn-o', iconColor: '#EA3636' },
    { name: t('已告警'), value: 1, background: '#F0F1F5', icon: 'success', iconColor: '#10C178' },
    { name: t('未恢复'), value: 1, background: '#F0F1F5', icon: 'cross', iconColor: '#EA3636' },
  ];
  const activeType = ref('');

  // 详情信息
  const data = ref<EventInfoItem[]>([
    { label: '策略名称', value: '常规体/14px/4.3 正文内容 弱显示' },
    { label: '事件产生时间', value: '2020-02-22 11:10:00' },
    { label: '首次异常时间', value: '2020-02-22 11:08:00' },
    { label: '持续时长', value: '10天08小时07分钟' },
    { label: '指标检测', value: 'avg(druid_status) = 1' },
    { label: '当前值', value: '2' },
    { label: '查询条件', value: '无' },
  ]);

  const handleJumpShield = () => {
    uni.navigateTo({
      url: '/pages/quick-sheild/quick-sheild?delta=2',
    });
  };

  onLoad((query) => {
    console.log(query, 3);
  });

  onMounted(() => {
    uni.setNavigationBarTitle({
      title: '在线/上海/druid',
    });
  });
</script>
