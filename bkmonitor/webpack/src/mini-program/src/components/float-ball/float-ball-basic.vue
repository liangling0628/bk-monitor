<template>
  <div
    class="float-ball-basic"
    :style="{ top,bottom, left, right, width, height }"
    @click="handleClick"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
  import { withDefaults, defineProps, defineEmits } from 'vue';
  import './float-ball-basic.scss';

  interface FloatBallBasicProps {
    width?: string
    height?: string
    left?: string
    bottom?: string
    right?: string
    top?: string
  }

  withDefaults(defineProps<FloatBallBasicProps>(), {
    top: 'auto',
    bottom: '46px',
    left: 'auto',
    right: '24px',
    width: '56px',
    height: '56px',
  });

  interface FloatBallBasicEmits {
    (e: 'click'):void
  }

  const emits = defineEmits<FloatBallBasicEmits>();

  const handleClick = () => {
    emits('click');
  };

</script>
