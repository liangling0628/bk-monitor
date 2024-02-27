<template>
  <div
    class="model"
    @click="handleModelClick"
  >
    <van-datetime-picker
      v-bind="$attrs"
      class="date-picker"
      @confirm="handleConfirm"
      @cancel="handleCancel"
      @tap.stop=""
    />
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
  import { useAttrs } from 'vue';
  import './date-picker.scss';
  const $attrs = useAttrs();
  const $emit = defineEmits(['confirm', 'cancel']);

  function handleConfirm(value: any) {
    // #ifdef MP-WEIXIN
    $emit('confirm', value.detail);
    // #endif
    // #ifdef H5
    $emit('confirm', value);
    // #endif
  }

  function handleCancel() {
    $emit('cancel');
  }

  function handleModelClick() {
    $emit('cancel');
  }
</script>
