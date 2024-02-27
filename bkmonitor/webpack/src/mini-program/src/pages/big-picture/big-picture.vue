<template>
  <div
    class="big-picture-page"
  >
    <event-detail-chart v-if="type === 'event-detail'" />
  </div>
</template>

<script setup lang="ts">
  import { onLoad } from '@dcloudio/uni-app';
  import { computed, ref, provide } from 'vue';
  import { BigPictureChartType } from './typeing';
  import './big-picture.scss';
  import EventDetailChart from './components/event-detail-chart/event-detail-chart.vue';
  import { useAppStore } from '../../store/app';

  // 获取右上角胶囊功能的信息
  const appStore = useAppStore();
  const menuButtonInfo = computed(() => appStore.menuButtonInfo);
  provide('menuButtonInfo', menuButtonInfo);
  // #ifdef MP-WEIXIN
  appStore.getMenuButtonBoundingClientRect();
  // #endif

  const type = ref<BigPictureChartType | ''>('');
  onLoad((query) => {
    type.value = query?.type || '';
  });

</script>
