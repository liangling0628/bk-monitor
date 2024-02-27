<template>
  <div class="monitor-picker-container">
    <!-- #ifdef H5 -->
    <van-picker
      :columns="h5Columns"
      v-bind="$attrs"
      :default-index="selectIndex[0] || 0"
      :show-toolbar="showToolbar"
      @change="h5HandleChange"
      @confirm="h5HandleConfirm"
    />
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <van-picker
      v-bind="$attrs"
      :show-toolbar="showToolbar"
      :columns="(wxColumns as any)"
      @change="wxHandleChange"
      @confirm="wxHandleConfirm"
    />
    <!-- #endif -->
  </div>
</template>

<script setup lang="ts">
  import { defineProps, defineEmits, computed, withDefaults } from 'vue';
  import { MonitorPickerItem, WXColumns } from './typing';
  import './monitor-picker.scss';

  export interface MonitorPickerProps {
    columns: MonitorPickerItem[]
    value: (string | number)[]
    showToolbar?: boolean
  }
  export interface MonitorPickerEmits {
    (e: 'change', val: (string | number)[]): void
    (e: 'confirm', val: (string | number)[]): void
  }

  const props = withDefaults(defineProps<MonitorPickerProps>(), {
    showToolbar: true,
  });
  const emits = defineEmits<MonitorPickerEmits>();


  // 是否是级联选择模式
  const isCascade = computed(() => props.columns.some(item => item.children && item.children.length));
  // 获取用于设置默认值的索引
  const selectIndex = computed(() => {
    let curColumn = props.columns;
    // 获取已选值的索引
    const indexLists =  props.value.map((item) => {
      const ind =  curColumn.findIndex(column => column.value === item);
      curColumn = curColumn[ind].children || [];
      return ind > -1 ? ind : 0;
    });

    // 获取已选值子级的索引
    while (curColumn.length) {
      indexLists.push(0);
      curColumn = curColumn[0].children || [];
    }

    return indexLists;
  });

  // #ifdef H5
  const h5Columns = computed(() => {
    // 不需要设置默认值
    if (!selectIndex.value.length) return props.columns;
    const localColumns:MonitorPickerItem[] = JSON.parse(JSON.stringify(props.columns));
    let curColumn = localColumns;
    // 设置已选择的值为默认值
    for (let i = 0; i < selectIndex.value.length; i ++) {
      curColumn[selectIndex.value[i]].defaultIndex = selectIndex.value[i + 1] || 0;
      curColumn = curColumn[selectIndex.value[i]].children || [];
    }
    return localColumns;
  });
  const h5HandleChange = (val:MonitorPickerItem | MonitorPickerItem[]) => {
    emits('change', Array.isArray(val) ? val.map(item => item.value) : [val.value]);
  };
  const h5HandleConfirm = (val:MonitorPickerItem | MonitorPickerItem[]) => {
    emits('confirm', Array.isArray(val) ? val.map(item => item.value) : [val.value]);
  };
  // #endif

  // #ifdef MP-WEIXIN
  const wxColumns = computed<WXColumns>(() => {
    let curColumn = props.columns;
    return selectIndex.value.map((ind) => {
      const values = curColumn;
      curColumn = curColumn[ind].children || [];
      return {
        values,
        defaultIndex: ind,
      };
    });
  });
  const wxHandleChange = (e:any) => {
    const { detail: { index, picker, value } } = e;
    if (!isCascade.value) {
      emits('change', [value.value]);
      return ;
    }

    // 修改当前列后面的所有列的显示内容
    let children = value[index].children || [];
    for (let i = index; i < value.length - 1;i++) {
      picker.setColumnValues(i + 1, children);
      picker.setColumnIndex(i + 1, 0);
      children = children[0]?.children || [];
    }

    emits('change', picker.getValues().map((item:MonitorPickerItem) => item.value));
  };
  const wxHandleConfirm = (e:any) => {
    const { detail: { value } } = e;
    emits('confirm', Array.isArray(value) ? value.map((item:MonitorPickerItem) => item.value) : [value.value]);
  };
  // #endif
</script>
