<template>
  <float-ball-basic
    v-bind="$attrs"
    @click="handleClick"
  >
    <svg-icon
      :name="screen"
      :size="24"
      color="#3a84ff"
    />
  </float-ball-basic>
</template>

<script setup lang="ts">
  import { defineEmits, defineProps, withDefaults } from 'vue';
  import floatBallBasic from './float-ball-basic.vue';
  import SvgIcon from '../svg-icon/svgIcon.vue';
  import './picture-float-ball.scss';


  interface PictureFloatBallProps {
    screen?: 'landscape' |  'portrait'
  }

  withDefaults(defineProps<PictureFloatBallProps>(), {
    screen: 'portrait',
  });

  const emits = defineEmits<{(e: 'click'): void}>();

  const handleClick = () => {
    emits('click');
  };
</script>
