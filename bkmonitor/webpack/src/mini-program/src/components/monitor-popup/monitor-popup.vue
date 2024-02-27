<template>
  <div class="monitor-popup-container">
    <!-- #ifdef MP-WEIXIN -->
    <van-popup
      :show="show"
      v-bind="$attrs"
      :custom-style="wxCustomStyle"
      :overlay-style="(wxOverlayStyle as any)"
      @close="handleClose"
      @click-overlay="handleClose('overlay')"
    >
      <slot />
    </van-popup>
    <!-- #endif -->

    <!-- #ifdef H5 -->
    <van-popup
      :show="show"
      :style="customStyle"
      :overlay-style="(h5OverlayStyle as any)"
      v-bind="$attrs"
      @click-overlay="handleClose('overlay')"
      @click-close-icon="handleClose('icon')"
    >
      <slot />
    </van-popup>
    <!-- #endif -->
  </div>
</template>

<script setup lang="ts">
  import { defineProps, defineEmits, computed } from 'vue';
  import './monitor-popup.scss';

  interface MonitorPopupProps {
    show: boolean;
    customStyle?: {[key: string]: string} | String
    overlayStyle?: {[key: string]: string} | String
  }
  const props = defineProps<MonitorPopupProps>();

  interface MonitorPopupEmits {
    (e: 'handle-close', val: false): void
    (e: 'click-overlay'): void
    // #ifdef H5
    (e: 'click-close-icon'): void
    // #endif
  }
  const emits = defineEmits<MonitorPopupEmits>();

  const handleClose = (type?: 'overlay' | 'icon') => {
    emits('handle-close', false);
    // #ifdef H5
    if (type === 'icon') emits('click-close-icon');
    // #endif
    if (type === 'overlay') emits('click-overlay');
  };

  // #ifdef MP-WEIXIN
  // 小程序组件customStyle和overlay-style不支持传object，需要把object转化成字符串
  const wxCustomStyle = computed(() => {
    if (!props.customStyle) return '';
    if (typeof props.customStyle === 'string') return props.customStyle;
    return transformStyle(props.customStyle as {[key: string]: string});
  });
  const wxOverlayStyle = computed(() => {
    if (!props.overlayStyle) return '';
    if (typeof props.overlayStyle === 'string') return props.overlayStyle;
    return transformStyle(props.overlayStyle as {[key: string]: string});
  });
  // #endif

  // #ifdef H5
  // h5组件verlay-style不支持传string，需要把字符串转化成object
  const h5OverlayStyle  = computed(() => {
    if (!props.overlayStyle) return '';
    if (typeof props.overlayStyle === 'object') return props.overlayStyle;
    return transformStyle(props.overlayStyle as {[key: string]: string});
  });
  // #endif

  const transformStyle = (style: {[key: string]: string} | string) => {
    if (typeof style === 'string') {
      return style.split(';').reduce<{[key: string]: string}>((cur, pre: any) => {
        const [key, value] = pre.split(':');
        return cur[key] = value;
      }, {});
    }
    return Object.keys(style).map(key => `${key}: ${(style as any)[key]}`)
      .join(';');
  };
</script>
