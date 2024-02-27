<template>
  <div class="event-chart-detail-page">
    <div class="timer-select">
      <div
        v-for="item of timerList"
        :key="item.label"
        class="btn"
        :class="[active === item.value && 'active', item.label === t('自定义') && 'custom']"
        @click="handleTimerClick(item.value)"
      >
        {{ t(item.label) }}
      </div>
    </div>
    <div class="chart-container">
      <monitor-chart
        canvas-id="event-chart-detail"
        :options="chartOptions"
      />
    </div>
    <div class="data-list">
      <div class="filter">
        <div
          class="filter-item"
          @click="showFilterPopup('type')"
        >
          <span>{{ typeLabel }}</span>
          <van-icon
            class="item-icon"
            name="play"
          />
        </div>
        <div
          class="filter-item"
          @click="showFilterPopup('value')"
        >
          <span>{{ selectLabel }}</span>
          <van-icon
            class="item-icon"
            name="play"
          />
        </div>
      </div>

      <div style="margin-top: 8px;">
        <detail-table>
          <detail-table-row>
            <detail-table-header width="100">
              <div class="header-time">
                时间
              </div>
            </detail-table-header>

            <detail-table-header align="right">
              min
            </detail-table-header>

            <detail-table-header align="right">
              max
            </detail-table-header>

            <detail-table-header align="right">
              avg
            </detail-table-header>

            <detail-table-header align="right">
              current
            </detail-table-header>

            <detail-table-header align="right">
              total
            </detail-table-header>
          </detail-table-row>

          <detail-table-row
            v-for="(rows, rowIndex) in tableData"
            :key="rowIndex"
          >
            <detail-table-cell>
              <div class="custom-cell">
                <div :class="'badge-' + rowIndex" />
                <div>
                  {{ rows.time }}
                </div>
              </div>
            </detail-table-cell>

            <detail-table-cell align="right">
              {{ rows.min }}
            </detail-table-cell>

            <detail-table-cell align="right">
              {{ rows.max }}
            </detail-table-cell>

            <detail-table-cell align="right">
              {{ rows.avg }}
            </detail-table-cell>

            <detail-table-cell align="right">
              {{ rows.current }}
            </detail-table-cell>

            <detail-table-cell align="right">
              {{ rows.total }}
            </detail-table-cell>
          </detail-table-row>
        </detail-table>
      </div>
    </div>


    <monitor-popup
      :show="filterConfig.show"
      position="bottom"
    >
      <monitor-picker
        v-if="filterConfig.type === 'type'"
        :columns="typeColumns"
        :value="typeValue"
        @cancel="filterConfig.show = false"
        @confirm="(val) => handleFilterConfirm(val, 'type')"
      />

      <monitor-picker
        v-else
        :columns="selectColumns"
        :value="selectValue"
        @cancel="filterConfig.show = false"
        @confirm="(val) => handleFilterConfirm(val, 'value')"
      />
    </monitor-popup>
    <picture-float-ball @click="handleJumpBigPicture" />
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { EChartOption } from 'echarts';
  import './event-chart-detail.scss';
  import monitorChart from '../../components/monitor-chart/monitor-chart.vue';
  import pictureFloatBall from '../../components/float-ball/picture-float-ball.vue';
  import monitorPopup from '../../components/monitor-popup/monitor-popup.vue';
  import monitorPicker from '../../components/monitor-picker/monitor-picker.vue';
  import { MonitorPickerItem } from '../../components/monitor-picker/typing';
  import DetailTable from './table/detail-table.vue';
  import DetailTableRow from './table/detail-table-row.vue';
  import DetailTableHeader from './table/detail-table-header.vue';
  import DetailTableCell from './table/detail-table-cell.vue';
  const { t } = useI18n();

  const timerList = [
    { label: '1小时', value: '1小时' },
    { label: '2小时', value: '2小时' },
    { label: '24小时', value: '24小时' },
    { label: '自定义', value: '自定义' },
  ];
  const active = ref('1小时');
  const handleTimerClick = (val: string) => {
    active.value = val;
  };

  const chartOptions: EChartOption = {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      top: 25,
      left: 16,
      right: 16,
      bottom: 22,
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      boundaryGap: false,
      axisLabel: {
        margin: 11,
        color: '#C4C6CC',
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'rgba(240, 241, 244, 0)', // 0% 处的颜色
            }, {
              offset: 1, color: '#DCDEE5', // 100% 处的颜色
            }],
            global: false,
          },
        },
      },
    },
    yAxis: {
      type: 'value',
      min: 0,
      axisLabel: {
        color: '#63656E',
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
    series: [
      {
        name: '测试',
        type: 'line',
        data: [
          [0, 10],
          [10, 20],
          [20, 30],
          [30, 10],
          [40, 40],
          [50, 20],
          [60, 30],
        ],
        smooth: true,
        symbol: 'none',
        lineStyle: {
          width: 2,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: '#3A84FF',
            }, {
              offset: 1, color: '#18C0A1',
            }],
            global: false,
          },
        },
      },
      {
        name: '测试2',
        type: 'line',
        data: [
          [0, 8],
          [10, 15],
          [20, 45],
          [30, 30],
          [40, 25],
          [50, 15],
          [60, 35],
        ],
        smooth: true,
        symbol: 'none',
        lineStyle: {
          width: 2,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: '#EA3636',
            }, {
              offset: 1, color: '#FF9C01',
            }],
            global: false,
          },
        },
      },
    ],
  };

  // 筛选功能
  const filterConfig = reactive<{ show: boolean, type: 'type' | 'value' }>({
    show: false,
    type: 'type', // 弹窗内容 type: 类型 value: 值
  });
  const showFilterPopup = (type: 'type' | 'value') => {
    filterConfig.show = true;
    filterConfig.type = type;
  };
  const typeLabel = computed(() => typeColumns.value.find(item => item.value === typeValue.value[0])?.text || '');
  const typeValue = ref<(string | number)[]>([1]);
  const typeColumns = ref<MonitorPickerItem[]>([
    { text: t('汇聚周期'), value: 1 },
    { text: t('汇聚方法'), value: 2 },
    { text: t('时间对比'), value: 3 },
  ]);

  const selectLabel = computed(() => selectColumns.value.find(item => item.value === selectValue.value[0])?.text || '');
  const selectValue = ref<(string | number)[]>([1]);
  const selectColumns = ref<MonitorPickerItem[]>([
    { text: t('1小时前'), value: 1 },
    { text: t('昨天'), value: 2 },
    { text: t('上周'), value: 3 },
  ]);
  const handleFilterConfirm = (val: (number | string)[], type: 'type' | 'value') => {
    if (type === 'type') {
      typeValue.value = val;
      selectValue.value = [];
    } else {
      selectValue.value = val;
    }
    filterConfig.show = false;
  };

  const handleJumpBigPicture = () => {
    uni.navigateTo({
      url: '/pages/big-picture/big-picture?type=event-detail',
    });
  };

  const tableData = ref([
    {
      time: '当前',
      min: '0',
      max: '0',
      avg: '0',
      current: '0',
      total: '0',
    },
    {
      time: '一周前',
      min: '87',
      max: '98',
      avg: '93',
      current: '90',
      total: '8.2Mk',
    },
  ]);
</script>
