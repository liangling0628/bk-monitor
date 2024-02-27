
<template>
  <div class="test-echart">
    <vue3-echarts
      ref="echarts"
      class="test-echart-instance"
      :options="options"
      :canvas-id="canvasId"
      @click="handelChart"
    />
  </div>
</template>

<script setup lang="ts">
  import Vue3Echarts from '../vue3-echarts/vue3-echarts.vue';
  import { shallowReactive, ref, defineProps } from 'vue';
  defineProps({
    canvasId: String,
  });
  const options = shallowReactive({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
      },
      confine: true,
    },
    legend: {
      data: ['销量', '收入'],
    },
    grid: {
      left: 20,
      right: 20,
      bottom: 15,
      top: 40,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '销量',
        data: [20, 30, 40, 50, 60, 70, 80],
        type: 'bar',
        showBackground: true,
      },
      {
        name: '收入',
        data: [30, 40, 50, 60, 70, 80, 90],
        type: 'bar',
        showBackground: true,
      },
    ],
  });
  const echarts = ref(null);
  // chart 点击回调函数
  const handelChart = (val: string) => {
    console.log(val);
  };

</script>

<style lang="scss">
  .test-echart {
    z-index: 1;
    display: flex;
    width: 100vw;
    height: 462px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 10rpx 0;

    &-instance {
      width: 100%;
      height: 462px;
    }
  }

</style>
