<template>
  <div class="table-row">
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
</script>
