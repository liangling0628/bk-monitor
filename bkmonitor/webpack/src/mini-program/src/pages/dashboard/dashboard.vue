<template>
  <div class="page-dashboard">
    <page-wrapper
      title="仪表盘"
      tab-bar-page
    >
      <!-- #ifdef MP-WEIXIN -->
      <web-view :src="url" />
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <iframe
        class="page-dashboard-iframe"
        :src="url"
      />
      <!-- #endif -->
    </page-wrapper>
  </div>
</template>
<script setup lang="ts">
  import PageWrapper from '../../components/page-wrapper/page-wrapper.vue';
  import { defineProps, PropType, defineEmits } from 'vue';
  import './dashboard.scss';
  const url = 'https://paas-dev.bktencent.com/o/bk_monitorv3/grafana/d/W9GOGHm4k/xxx-jian-kong-da-pan?orgName=2&orgId=2&view_only=1&from=now-30m&to=now';
  defineProps({
    value: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  });
  defineEmits<{(event: 'change'): void;
               (event: 'update', id: number): void}>();
</script>
