<template>
  <!-- #ifdef H5 -->
  <img
    :src="svg"
    alt=""
    :style="{ width: `${size}px`, height: `${size}px`}"
  >
  <!-- #endif -->

  <!-- #ifdef MP-WEIXIN -->
  <image
    :src="url"
    :style="{ width: `${size}px`, height: `${size}px`}"
  />
  <!-- #endif -->
</template>

<script lang="ts" setup>
  import { computed, withDefaults, defineProps, ref, watch } from 'vue';
  import useIconDirMapHook from './useIconDirMapHook';
  export interface SvgIconProps {
    name: string
    prefix?: string
    color?: string
    size?: number
  }

  const props = withDefaults(defineProps<SvgIconProps>(), {
    prefix: 'icon',
    color: '#333',
    size: 16,
  });


  const { cacheDirMap, modules, importGlobModules } = useIconDirMapHook();
  !modules.value && importGlobModules();


  // #ifdef H5
  const svg = ref('');
  watch(() => [props.name, modules.value], async () => {
    const res = await modules.value?.[cacheDirMap.value?.[props.name] || '']();
    svg.value = res?.default;
  }, {
    immediate: true,
  });
  // #endif

  // #ifdef MP-WEIXIN
  const url = computed(() => cacheDirMap.value?.[props.name] || '');
  // #endif


</script>
