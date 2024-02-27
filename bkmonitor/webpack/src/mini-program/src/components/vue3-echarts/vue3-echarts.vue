
<template>
  <!-- #ifdef MP-WEIXIN -->
  <canvas
    :id="canvasId"
    type="2d"
    class="echart-cover"
    :canvas-id="canvasId"
    @touchstart="touchStart"
    @touchmove="touchMove"
    @touchend="touchEnd"
  />
  <!-- #endif -->
  <!-- #ifdef H5 -->
  <canvas
    :id="canvasId"
    class="echart-cover"
    :canvas-id="canvasId"
    @touchstart="touchStart"
    @touchmove="touchMove"
    @touchend="touchEnd"
  />
  <!-- #endif -->
</template>

<script  setup>
  import * as echarts from 'echarts';
  import {
    defineEmits,
    defineExpose,
    defineProps,
    getCurrentInstance,
    nextTick,
    onBeforeUnmount,
    onMounted,
    watch,
  } from 'vue';
  import WxCanvas from './wx-canvas.js';
  const instance = getCurrentInstance?.();
  const exposes = {}; // 导出组件方法、echart实例
  let chartInstance;
  let ctx = null;
  const emits = defineEmits(['click']);
  const props = defineProps({
    canvasId: {
      type: String,
      default: 'echarts',
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  });
  onMounted(() => {
    echarts.registerPreprocessor((options) => {
      if (options?.series) {
        if (options.series.length > 0) {
          options.series.forEach((series) => {
            series.progressive = 0;
          });
        } else if (typeof options.series === 'object') {
          options.series.progressive = 0;
        }
      }
    });
  });

  onBeforeUnmount(() => {
    chartInstance?.dispose?.();
  });

  // #ifdef H5
  // H5绘制图表
  const initChart = (options) => {
    ctx = uni.createCanvasContext(props.canvasId, instance);
    chartInstance = echarts.init(document.getElementById(props.canvasId));
    chartInstance.clear();
    chartInstance.setOption(options ? options : props.options);
    chartInstance.on('click', (params) => {
      emits('click', params);
    });
    exposes.chart = chartInstance;
  };
  // H5生成图片
  const canvasToTempFilePath = (opt) => {
    const base64 = chartInstance.getDataURL();
    opt.success && opt.success({ tempFilePath: base64 });
  };
  exposes.canvasToTempFilePath = canvasToTempFilePath;
  // #endif
  // #ifndef H5
  // 绘制图表
  const initChart = async (options) => {
    // #ifdef MP-WEIXIN
    const canvasAttr = await getCanvasAttr2d();
    // #endif
    // #ifndef MP-WEIXIN
    const canvasAttr = await getCanvasAttr();
    // #endif
    const { canvas, canvasWidth, canvasHeight, canvasDpr } = canvasAttr;
    chartInstance = echarts.init(canvas, null, {
      width: canvasWidth,
      height: canvasHeight,
      devicePixelRatio: canvasDpr, // new
    });
    canvas.setChart(chartInstance);
    chartInstance.clear();
    chartInstance.setOption(options ? options : props.options);
    chartInstance.on('click', (params) => {
      emits('click', params);
    });
    exposes.chart = chartInstance;
  };
  // 生成图片
  const canvasToTempFilePath = (opt) => {
    // #ifdef MP-WEIXIN
    const query = uni
      .createSelectorQuery()
      // #ifndef MP-ALIPAY
      .in(instance);
    // #endif
    query
      .select(`#${props.canvasId}`)
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvasNode = res[0].node;
        opt.canvas = canvasNode;
        uni.canvasToTempFilePath(opt, instance);
      });
    // #endif
    // #ifndef MP-WEIXIN
    if (!opt.canvasId) {
      opt.canvasId = props.canvasId;
    }
    ctx.draw(true, () => {
      uni.canvasToTempFilePath(opt, instance);
    });
    // #endif
  };
  exposes.canvasToTempFilePath = canvasToTempFilePath;
  // #endif
  const getCanvasAttr2d = function () {
    return new Promise((resolve) => {
      const query = uni.createSelectorQuery().in(instance);
      query
        .select(`#${props.canvasId}`)
        .fields({
          node: true,
          size: true,
        })
        .exec((res) => {
          const canvasNode = res[0].node;
          const canvasDpr = uni.getSystemInfoSync().pixelRatio;
          const canvasWidth = res[0].width;
          const canvasHeight = res[0].height;
          ctx = canvasNode.getContext('2d');

          const canvas = new WxCanvas(ctx, props.canvasId, true, canvasNode);
          echarts.setCanvasCreator(() => canvas);
          resolve({
            canvas,
            canvasWidth,
            canvasHeight,
            canvasDpr,
          });
        });
    });
  };

  const getCanvasAttr = function () {
    return new Promise((resolve) => {
      ctx = uni.createCanvasContext(props.canvasId, instance);
      const canvas = new WxCanvas(ctx, props.canvasId, false);
      echarts.setCanvasCreator(() => canvas);
      const canvasDpr = 1;
      const query = uni
        .createSelectorQuery()
        // #ifndef MP-ALIPAY
        .in(instance);
      // #endif
      query
        .select(`#${props.canvasId}`)
        .boundingClientRect((res) => {
          const canvasWidth = res.width;
          const canvasHeight = res.height;
          resolve({
            canvas,
            canvasWidth,
            canvasHeight,
            canvasDpr,
          });
        })
        .exec();
    });
  };
  const touchStart = (e) => {
    if (chartInstance && e.touches.length > 0) {
      const touch = e.touches[0];
      const { handler } = chartInstance.getZr();
      handler.dispatch('mousedown', {
        zrX: touch.x,
        zrY: touch.y,
      });
      handler.dispatch('mousemove', {
        zrX: touch.x,
        zrY: touch.y,
      });
      handler.processGesture(wrapTouch(e), 'start');
    }
  };
  const touchMove = (e) => {
    if (chartInstance && e.touches.length > 0) {
      const touch = e.touches[0];
      const { handler } = chartInstance.getZr();
      handler.dispatch('mousemove', {
        zrX: touch.x,
        zrY: touch.y,
      });
      handler.processGesture(wrapTouch(e), 'change');
    }
  };

  const touchEnd = (e) => {
    if (chartInstance) {
      const touch = e.changedTouches ? e.changedTouches[0] : {};
      const { handler } = chartInstance.getZr();
      handler.dispatch('mouseup', {
        zrX: touch.x,
        zrY: touch.y,
      });
      handler.dispatch('click', {
        zrX: touch.x,
        zrY: touch.y,
      });
      handler.processGesture(wrapTouch(e), 'end');
    }
  };
  const wrapTouch = function (event) {
    for (let i = 0; i < event.touches.length; ++i) {
      const touch = event.touches[i];
      touch.offsetX = touch.x;
      touch.offsetY = touch.y;
    }
    return event;
  };

  watch(
    () => props.options,
    (newValue) => {
      if (newValue.series) {
        nextTick(() => {
          initChart(newValue);
        });
      }
    },
    {
      deep: true,
      immediate: true,
    },
  );
  defineExpose(exposes); // 导出组件方法、echart实例
</script>
<style lang="scss" scoped>
.echart-cover {
  z-index: 0;
  width: 100%;
  height: 100%;
}
</style>
