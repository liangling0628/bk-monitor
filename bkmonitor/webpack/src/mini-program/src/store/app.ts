import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('app', () => {
  const bizName = ref('蓝鲸');
  const systemInfo = ref<UniApp.GetSystemInfoResult>();
  const setBizName = (id: string) => bizName.value = id;

  const getSystemInfo = () => {
    try {
      systemInfo.value = uni.getSystemInfoSync();
    } catch (e) {
      console.log(e);
    }
  };

  // #ifdef MP-WEIXIN
  const menuButtonInfo = ref<UniApp.GetMenuButtonBoundingClientRectRes>();
  const getMenuButtonBoundingClientRect = () => {
    try {
      menuButtonInfo.value = uni.getMenuButtonBoundingClientRect();
    } catch (e) {
      console.log(e);
    }
  };
  // #endif
  return {
    bizName,
    setBizName,
    systemInfo,
    getSystemInfo,
    // #ifdef MP-WEIXIN
    menuButtonInfo,
    getMenuButtonBoundingClientRect,
    // #endif
  };
});
