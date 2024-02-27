<template>
  <div class="container">
    <div class="p16 pb0">
      <div class="card-title mb8">
        屏蔽类型
      </div>
      <!-- v-model 和 value 是同时兼容 小程序 和 H5 的写法 -->
      <van-radio-group
        ref="sheildType"
        v-model="selectedSheildType"
        :value="selectedSheildType"
        class="radio-group"
        @change="onChange"
      >
        <van-radio
          name="1"
          class="radio"
        >
          事件屏蔽
        </van-radio>
        <div class="divider" />
        <van-radio
          name="2"
          class="radio"
        >
          策略屏蔽
        </van-radio>
        <div class="divider" />
        <van-radio
          name="3"
          class="radio"
        >
          基于目标屏蔽
        </van-radio>
      </van-radio-group>
    </div>

    <div class="p16 pb0">
      <div class="card-title mb8">
        屏蔽内容
      </div>

      <div class="sheild-content-container p16">
        <div>
          <div class="sheild-content-label">
            级别123
          </div>
        </div>
        <div>:</div>
        <div class="sheild-content-content">
          [致命]
        </div>

        <div>
          <div class="sheild-content-label">
            维度
          </div>
        </div>
        <div>:</div>
        <div class="sheild-content-content">
          集群-业务-模块(influxdb,redis_cluster) lorejaljjlajskd
        </div>

        <div>
          <div class="sheild-content-label">
            条件
          </div>
        </div>
        <div>:</div>
        <div class="sheild-content-content">
          当前进程(influxd)不存在
        </div>
      </div>
    </div>

    <div class="p16 pb0">
      <div class="card-title mb8">
        屏蔽时长
      </div>

      <div class="sheild-time">
        <div
          class="sheild-time-item-container"
          @click="selected = '0'"
        >
          <div
            :class="selected === '0' && 'selected'"
          >
            10分钟
          </div>
        </div>

        <div
          class="sheild-time-item-container"
          @click="selected = '1'"
        >
          <div
            :class="selected === '1' && 'selected'"
          >
            30分钟
          </div>
        </div>

        <div
          class="sheild-time-item-container"
          @click="selected = '2'"
        >
          <div
            :class="selected === '2' && 'selected'"
          >
            12小时
          </div>
        </div>

        <div
          class="sheild-time-item-container"
          @click="selected = '3'"
        >
          <div
            :class="selected === '3' && 'selected'"
          >
            1天
          </div>
        </div>

        <div
          class="sheild-time-item-container"
          @click="selected = '4'"
        >
          <div
            :class="selected === '4' && 'selected'"
          >
            7天
          </div>
        </div>

        <div
          class="sheild-time-item-container"
          @click="selected = '5';isShowDateTimePicker = true;"
        >
          <div
            :class="selected === '5' && 'selected'"
          >
            <div v-if="date && time">
              <div>{{ date }}</div>
              <div>{{ time }}</div>
            </div>
            <div v-else>
              自定义
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- eslint-disable vue/attribute-hyphenation -->
    <!-- 由于 Vant 的 date-time-picker 组件的 props 在安装后会从连字符转成驼峰，
         恰好这里需要透传 props 如：minDate 会转成 min-date 导致透传失败。这里关闭 ESlint 检查。
    -->
    <date-picker
      v-if="isShowDateTimePicker"
      type="datetime"
      :value="datePicker.currentDate"
      :minDate="datePicker.minDate"
      :maxDate="datePicker.maxDate"
      title="请选择截止时间"
      @confirm="handlePickConfirm"
      @cancel="isShowDateTimePicker = false"
    />
    <!-- eslint-enable -->

    <div class="p16 pb0 mb8">
      <div class="card-title mb8">
        原因
      </div>
      <van-radio-group
        ref="reasonType"
        v-model="selectedReasonType"
        :value="selectedReasonType"
        class="radio-group"
        @change="onReasonTypeChange"
      >
        <van-radio
          name="1"
          class="radio"
        >
          变更中
        </van-radio>
        <div class="divider" />
        <van-radio
          name="2"
          class="radio"
        >
          无关紧要
        </van-radio>
      </van-radio-group>
    </div>

    <div class="submit-container">
      <van-button
        type="primary"
        @click="handleSubmit"
      >
        提交
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref, watch } from 'vue';
  import DatePicker from './components/date-picker.vue';
  import './quick-sheild.scss';
  import Dayjs from 'dayjs';
  import { onLoad } from '@dcloudio/uni-app';

  const selectedSheildType = ref('');
  function onChange(e: any) {
    // #ifdef MP-WEIXIN
    selectedSheildType.value = e.detail;
    // #endif
  }
  const selectedReasonType = ref('');
  function onReasonTypeChange(e: any) {
    // #ifdef MP-WEIXIN
    selectedReasonType.value = e.detail;
    // #endif
  }

  const selected = ref('');

  const isShowDateTimePicker = ref(false);
  let currentDate = null;
  // #ifdef H5
  currentDate = Dayjs().toDate();
  // #endif
  // #ifdef MP-WEIXIN
  currentDate = Dayjs().valueOf();
  // #endif

  let maxDate = null;
  // #ifdef H5
  maxDate = Dayjs().add(1, 'year')
    .toDate();
  // #endif
  // #ifdef MP-WEIXIN
  maxDate = Dayjs().add(1, 'year')
    .valueOf();
  // #endif
  const datePicker = reactive({
    minDate: currentDate,
    maxDate,
    currentDate,
  });

  // 在提交的时候，把 date 、time 两个拼接起来即可。
  const date = ref('');
  const time = ref('');
  function handlePickConfirm(value: any) {
    date.value = Dayjs(value).format('YYYY-MM-DD');
    time.value = Dayjs(value).format('HH:ss');
    isShowDateTimePicker.value = false;
  }

  watch(selected, (val) => {
    if (val !== '5') {
      date.value = '';
      time.value = '';
    }
  });

  let delta = 1;
  onLoad((option: any) => {
    // 从事件列表中的事件详情跳转过来后，在提交操作后需要直接跳回事件列表页，而非简单的跳回上一页
    delta = Number(option.delta) || 1;
  });
  function handleSubmit() {
    uni.navigateBack({
      delta,
    });
  }
</script>
