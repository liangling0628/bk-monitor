<template>
  <div class="type-filter">
    <div
      v-for="item of list"
      :key="item.value"
      class="type-item"
      :class="{ 'is-active': activeType === item.value}"
      :style="{ background: item.background }"
      @click="handleTypeItemClick(item.value)"
    >
      <van-icon
        v-if="item.icon"
        :name="item.icon"
        :color="item.iconColor"
      />

      <svg-icon
        v-if="item.svg"
        class="svg-icon"
        :name="item.svg"
        :size="14"
        :color="item.iconColor"
      />

      <span class="item-name">{{ item.name }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { defineProps, defineEmits } from 'vue';
  import { ITypeFilterItem } from './typings';
  import SvgIcon from '../svg-icon/svgIcon.vue';
  import './type-filter.scss';

  interface ITypeFilterProps {
    list: ITypeFilterItem[],
    activeType: string | number
  }

  interface Emits {
    (e: 'select', val: number | string): void;
  }


  defineProps<ITypeFilterProps>();

  const emits = defineEmits<Emits>();

  const handleTypeItemClick = (val: number| string) => {
    emits('select', val);
  };

</script>
