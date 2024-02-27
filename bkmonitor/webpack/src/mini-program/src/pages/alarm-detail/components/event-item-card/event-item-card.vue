<template>
  <div
    class="event-item-card"
    @click="handleJumpEventDetail"
  >
    <monitor-card>
      <div class="card-top">
        <div class="title-box">
          <span class="title">在线/上海/druid</span>
          <span class="status red">
            （未恢复）
          </span>
        </div>

        <div
          class="shield-btn"
          @click.stop="handleShieldClick"
        >
          <van-button
            plain
            type="primary"
          >
            {{ t('快捷屏蔽') }}
          </van-button>
        </div>
      </div>

      <p class="time">
        02-22 11:07:00
      </p>

      <div class="card-content">
        <content-view-card
          class="detail"
          :data="detailData"
          label-width="42px"
        />
        <div
          class="echarts-container"
          @click.stop="viewBigChart"
        >
          <monitor-chart
            canvas-id="canvas1"
            :options="chartOptions"
          />
        </div>
      </div>
    </monitor-card>
  </div>
</template>
<script lang="ts">
  export default {
    options: {
      // #ifdef MP-WEIXIN
      styleIsolation: 'shared',
      // #endif
    },
  };
</script>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { EChartOption } from 'echarts';
  import { useI18n } from 'vue-i18n';
  import MonitorCard from '../../../../components/monitor-card/monitor-card.vue';
  import ContentViewCard, { ContentViewCardItem } from '../../../../components/content-view-card/content-view-card.vue';
  import MonitorChart from '../../../../components/monitor-chart/monitor-chart.vue';
  import './event-item-card.scss';

  interface EventItemCardProps { }

  const { t } = useI18n();

  const detailData = ref<ContentViewCardItem[]>([
    { label: '策略：', value: 'druid_staus健康状态' },
    { label: '时长：', value: '1天03小时03分钟' },
  ]);

  const chartOptions: EChartOption = {
    grid: {
      left: 0,
      right: 0,
      top: 5,
      bottom: 0,
    },
    legend: {
      show: false,
    },
    xAxis: {
      type: 'category',
      show: false,
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      show: false,
      min: 0,
    },
    tooltip: {
      show: false,
    },
    backgroundColor: '#FAFBFD',
    series: [
      {
        name: '测试',
        type: 'line',
        data: [
          ['Mon', 10],
          ['Tue', 20],
          ['Wed', 30],
          ['Thu', 10],
          ['Fri', 40],
          ['Sat', 20],
          ['Sun', 30],
        ],
        smooth: true,
        symbol: 'none',
        lineStyle: {
          width: 1,
          color: '#A0B0CB',
        },
        areaStyle: {
          color: '#E8EBF3',
        },
      },
    ],
  };

  const viewBigChart = () => {
    uni.navigateTo({
      url: '/pages/event-chart-detail/event-chart-detail',
    });
  };

  const handleJumpEventDetail = () => {
    uni.navigateTo({
      url: '/pages/event-detail/event-detail',
    });
  };

  const handleShieldClick = () => {
    uni.navigateTo({
      url: '/pages/quick-sheild/quick-sheild',
    });
  };
</script>
