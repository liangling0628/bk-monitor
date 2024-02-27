<template>
  <div>
    <!-- #ifdef MP-WEIXIN -->
    <van-collapse
      :value="value"
      v-bind="$attrs"
      @change="handleValueChange"
    >
      <van-collapse-item
        v-for="item of data"
        :key="item.attrs.name"
        v-bind="item.attrs"
      >
        <!-- 展示内容 -->
        <template v-if="item.default.content">
          {{ item.default.content }}
        </template>
        <!-- 展示自定义插槽内容 -->
        <template v-else-if="item.default.slotName">
          <slot
            :name="item.default.slotName"
            :item="item"
          />
        </template>
      </van-collapse-item>
    </van-collapse>
    <!-- #endif -->
    <!-- #ifndef MP-WEIXIN -->
    <van-collapse
      :model-value="value"
      v-bind="$attrs"
      @change="handleValueChange"
    >
      <van-collapse-item
        v-for="item of data"
        :key="item.attrs.name"
        v-bind="item.attrs"
      >
        <template v-if="item.default.content">
          {{ item.default.content }}
        </template>
        <template v-else-if="item.default.slotName">
          <slot :name="item.default.slotName" />
        </template>
      </van-collapse-item>
    </van-collapse>
  <!-- #endif -->
  </div>
</template>
<script lang="ts" setup>
  import { defineProps, defineEmits } from 'vue';
  import { MonitorCollapseItemProps } from './type';


  interface MonitorCollapseProps {
    value: string | number | (string | number)[];
    data: MonitorCollapseItemProps[]
  }

  interface MonitorCollapseEvent {
    (e: 'change', val: string | number | (string | number)[]): void
  }

  defineProps<MonitorCollapseProps>();
  const emits = defineEmits<MonitorCollapseEvent>();

  const handleValueChange = (val:  any) => {
    // #ifdef MP-WEIXIN
    emits('change', val.detail);
    // #endif

    // #ifndef MP-WEIXIN
    emits('change', val);
    // #endif
  };

</script>
