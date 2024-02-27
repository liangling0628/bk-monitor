<template>
  <div class="table">
    <slot />
  </div>
</template>
<script lang="ts">
  export default {
    // #ifdef MP-WEIXIN
    options: { styleIsolation: 'shared', virtualHost: true },
    // #endif
  };
</script>
<script lang="ts" setup>
  import './detail-table.scss';

</script>
