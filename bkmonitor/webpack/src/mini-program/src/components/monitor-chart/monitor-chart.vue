<template>
  <div class="monitor-charts">
    <van-skeleton
      :row="localRow"
      :loading="loading"
      :row-width="localRowWidth"
    >
      <vue3-echarts
        ref="chartRef"
        :options="monitorEchartOptions"
        v-bind="$attrs"
      />
    </van-skeleton>
  </div>
</template>
<script lang="ts">
  export default {
    // #ifdef MP-WEIXIN
    options: { styleIsolation: 'shared' },
    // #endif
  };
</script>
<script lang="ts" setup>
  import { EChartOption } from 'echarts';
  import deepMerge from 'deepmerge';
  import { computed, withDefaults, onMounted, getCurrentInstance, ref } from 'vue';
  import './monitor-chart.scss';
  import vue3Echarts from '../vue3-echarts/vue3-echarts.vue';

  interface MonitorChartProps {
    options: EChartOption
    loading?: boolean
    skeletonRow?: number
    skeletonRowWidth?: number | string |  (number | string)[]
  }
  const props = withDefaults(defineProps<MonitorChartProps>(), {
    loading: false,
  });

  const chartRef = ref<InstanceType<typeof vue3Echarts>>();
  const instance = getCurrentInstance();

  const defaultOptions: EChartOption = {
    tooltip: {
      trigger: 'axis',
    },
    series: [],
  };

  const monitorEchartOptions = computed<EChartOption>(() => deepMerge(defaultOptions, props.options));

  // 容器的高度
  const info = uni.createSelectorQuery().in(instance)
    .select('.monitor-charts');
  const rectHeight = ref(0);
  /**
   * 骨架屏设置
   * 根据容器的高度，设置骨架屏的行数，默认是按照每行28计算
   * 骨架屏默认宽度为50% - 80%
   */
  const localRow = computed(() => props.skeletonRow || Math.floor(rectHeight.value / 28));
  const localRowWidth = computed(() => props.skeletonRowWidth || new Array(localRow.value).fill(0)
    .map(() => `${(Math.random() * 50 + 30).toFixed(2)}%`));

  onMounted(() => {
    // 通过uniapp提供的方法获取容器的高度
    info.boundingClientRect((data) => {
      if (Array.isArray(data)) return;
      rectHeight.value = data.height!;
    }).exec();
  });

</script>
