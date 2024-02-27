<template>
  <div class="content-view-card">
    <div
      v-for="item of data"
      :key="item.label"
      class="content-view-card-item"
    >
      <div
        class="item-label"
        :style="{width: item.labelWidth || labelWidth}"
      >
        {{ item.label }}
        {{ (item.labelSuffix || labelSuffix) ? '：' : '' }}
      </div>
      <div
        class="item-value"
        :class="[item.overflowType || overflowType]"
      >
        {{ item.value }}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { defineProps, withDefaults } from 'vue';
  import './content-view-card.scss';

  export interface ContentViewCardConfig {
    labelWidth?: string;
    labelSuffix?: boolean;
    overflowType?: 'wrap' | 'ellipsis'
  }

  export interface ContentViewCardItem extends ContentViewCardConfig{
    label: string;
    value: string;
  }

  interface ContentViewCardProps extends ContentViewCardConfig{
    data: ContentViewCardItem[]
  }

  withDefaults(defineProps<ContentViewCardProps>(), {
    labelWidth: '60px',
    overflowType: 'wrap',
    labelSuffix: false,
  });


</script>
