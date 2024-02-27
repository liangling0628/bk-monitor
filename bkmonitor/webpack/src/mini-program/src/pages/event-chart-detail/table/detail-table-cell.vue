<template>
  <div
    class="table-cell"
    :style="{
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
    align?: TextAlignProperty
  }>(), {
    align: 'left',
  });
</script>
