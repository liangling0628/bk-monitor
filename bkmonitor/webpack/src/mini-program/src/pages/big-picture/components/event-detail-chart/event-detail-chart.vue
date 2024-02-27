<template>
  <div class="event-detail-chart-container">
    <div class="tools-container">
      <div class="select-timer">
        <div
          v-for="item of timerList"
          :key="item.label"
          class="btn"
          :class="[active === item.value && 'active', item.label === t('自定义') && 'custom']"
          @click="handleTimerClick(item.value)"
        >
          {{ t(item.label) }}
        </div>
      </div>
      <div class="data-comparison">
        <div
          class="btn"
          :style="{marginRight: `${menuButtonInfo?.width || 0}px`}"
          @click="handleChangePanel(true)"
        >
          {{ t('数据对比') }}
        </div>
      </div>
    </div>
    <div class="chart-container">
      <monitor-chart
        canvas-id="big-event-detail"
        :options="chartOptions"
        @click="chartClick"
      />
    </div>

    <!-- todo: 等待设计和产品沟通交互方式 -->
    <!-- <monitor-popup
      :show="panelShow"
      position="right"
      :custom-style="{width: '375px', height: '100%', 'box-shadow': '0 2px 7px 0 #1919290d'}"
      :overlay-style="{ background: 'transparent' }"
      @handle-close="handleChangePanel"
    >
      <div class="hide-btn">
        <van-icon name="arrow" />
      </div>
    </monitor-popup> -->


    <picture-float-ball
      screen="landscape"
      @click="JumpEventDetail"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, inject, ComputedRef } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { EChartOption } from 'echarts';
  import monitorChart from '../../../../components/monitor-chart/monitor-chart.vue';
  import pictureFloatBall from '../../../../components/float-ball/picture-float-ball.vue';
  import monitorPopup from '../../../../components/monitor-popup/monitor-popup.vue';
  import './event-detail-chart.scss';
  const { t } = useI18n();

  // eslint-disable-next-line no-undef
  const menuButtonInfo = inject<ComputedRef<UniApp.GetMenuButtonBoundingClientRectRes>>('menuButtonInfo');

  const timerList = [
    { label: '1小时', value: '1小时'  },
    { label: '2小时', value: '2小时'  },
    { label: '24小时', value: '24小时'  },
    { label: '自定义', value: '自定义'  },
  ];

  const active = ref('1小时');
  const handleTimerClick = (val: string) => {
    active.value = val;
  };


  const panelShow = ref(false);
  const handleChangePanel = (val: boolean) => {
    panelShow.value = val;
  };


  const chartOptions: EChartOption = {
    tooltip: {
      trigger: 'axis',
    },
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
              offset: 0, color: '#3A84FF',
            }, {
              offset: 1, color: '#18C0A1',
            }],
            global: false,
          },
        },
      },
      {
        name: '测试2',
        type: 'line',
        data: [
          [0, 8],
          [10, 15],
          [20, 45],
          [30, 30],
          [40, 25],
          [50, 15],
          [60, 35],
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
              offset: 0, color: '#EA3636',
            }, {
              offset: 1, color: '#FF9C01',
            }],
            global: false,
          },
        },
      },
    ],
  };

  const chartClick = () => {
    console.log(1111);
  };

  const JumpEventDetail = () => {
    uni.redirectTo({
      url: '/pages/event-chart-detail/event-chart-detail',
    });
  };

</script>
