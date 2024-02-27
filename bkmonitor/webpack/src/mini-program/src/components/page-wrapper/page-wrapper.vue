<template>
  <div
    class="page-wrapper"
    :style="{ height: wrapperHeight }"
  >
    <van-nav-bar
      class="page-wrapper-nav"
      fixed
      right-text=""
      :title="title"
    >
      <template #left>
        <div
          class="nav-left"
          @click="handleGotoBizList"
        >
          {{ bizName }}
          <van-icon
            name="play"
            class="nav-left-icon"
          />
        </div>
      </template>
    </van-nav-bar>
    <div
      class="page-wrapper-content"
      :style="contentStyle"
    >
      <slot />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { defineProps, computed } from 'vue';
  import './page-wrapper.scss';
  import { useAppStore } from '../../store/app';

  interface PageWrapperPage {
    title?: string,
    needLeftBiz?: boolean,
    tabBarPage?: boolean, // 是否在tabBar页面使用，涉及到页面高度计算
  }
  const props = defineProps<PageWrapperPage>();

  const { bizName, systemInfo } = useAppStore();

  // 在H5端时，视口高度包含tabBar和导航栏，而小程序视口高度不包含，因此h5端的高度需要减去tabBar和导航栏的高度
  const wrapperHeight = computed(() => {
    if (systemInfo?.uniPlatform === 'mp-weixin' || !props.tabBarPage) return '100vh';
    return 'calc(100vh - 60px)';
  });

  // 内容区域增加边界样式
  const contentStyle = computed(() => ({
    paddingTop: `${systemInfo?.statusBarHeight ? 46 + systemInfo.statusBarHeight : 46}px`,
    paddingBottom: props.tabBarPage ? '0' : 'env(safe-area-inset-bottom, 0)',
  }));

  function handleGotoBizList() {
    uni.navigateTo({
      url: '/pages/biz-list/biz-list',
    });
  }

</script>
