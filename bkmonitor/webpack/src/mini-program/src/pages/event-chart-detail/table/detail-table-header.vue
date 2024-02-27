<template>
  <div
    class="table-header"
    :style="{
      width: width + 'px',
      textAlign: align
    }"
  >
    <slot />
  </div>
</template>

<script lang="ts">
  export default {
    // #ifdef MP-WEIXIN
    options: { virtualHost: true },
    // #endif
  };
</script>
<script lang="ts" setup>
  import { TextAlignProperty } from '../../../typings/css-types';

  withDefaults(defineProps<{
    width?: string,
    align?: TextAlignProperty
  }>(), {
    width: '',
    align: 'left',
  });
</script>
