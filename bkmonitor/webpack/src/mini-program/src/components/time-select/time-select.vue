<template>
  <van-dropdown-menu
    :class="`${prefix}-warp`"
    active-color="#1768EF"
  >
    <van-dropdown-item
      ref="timeSelect"
      :title="timeName"
      :class="`${prefix}-item`"
    >
      <div
        v-for="(item,index) of options"
        :key="index"
        :class="[
          `${prefix}-option`,
          { 'is-disabled': item?.disabled },
          { 'is-active': item.value === value}
        ]"
        @click="handleOptionSelect(item)"
      >
        {{ item.label }}
      </div>
    </van-dropdown-item>
  </van-dropdown-menu>
</template>
<script lang="ts">
  export default {
    options: { styleIsolation: 'shared' },
  };
</script>
<script lang="ts" setup>
  import { ref, defineProps, PropType, computed } from 'vue';
  import { TimeOptionsType } from './typings';
  import type { DropdownItemInstance } from 'vant';
  import './time-select.scss';

  interface Emits {
    (e: 'select', val: number | string): void;
  }

  const prefix = 'time-select-dropdown';
  const timeSelect = ref<DropdownItemInstance>();

  const props =  defineProps({
    options: {
      type: Array as PropType<TimeOptionsType[]>,
      default: () => [],
    },
    value: {
      type: [String, Number],
      default: '',
    },
    showValue: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: '',
    },
  });

  const timeName = computed(() => {
    if (props.showValue) {
      return String(props.options.find(item => item.value === props.value)?.label || props.value);
    }
    return props.title;
  });


  const emits = defineEmits<Emits>();

  const handleOptionSelect = (item: TimeOptionsType) => {
    if (item.disabled) return;
    emits('select', item.value);
    timeSelect.value?.toggle();
  };
</script>
