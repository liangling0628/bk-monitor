<template>
  <div class="biz-list">
    {{ bizName }}
    <van-index-bar
      highlight-color="#3a84ff"
    >
      <template
        v-for="i in ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p']"
        :key="i"
      >
        <view>
          <van-index-anchor :index="i.toLocaleUpperCase()" />
          <van-cell title="文本2" />
          <van-cell title="文本" />
          <van-cell title="文本" />
        </view>
      </template>
    </van-index-bar>
  </div>
</template>
<script lang="ts" setup>
  import { useAppStore } from '../../store/app';
  const { bizName } = useAppStore();
</script>
<style lang="scss" scoped>
.biz-list {
  display: flex;
  flex-direction: column;
}
</style>
