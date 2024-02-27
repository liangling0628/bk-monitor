<template>
  <div
    class="event-item-warp"
  >
    <div
      class="event-item-warp-title"
      :class="{ 'is-expand': isExpand }"
      @click="isExpand = !isExpand"
    >
      <div
        class="mark"
        :style="{ background: backgroundColor }"
      />
      <span class="title">出包量大于40W</span>
      <span
        class="icon"
      >
        <van-icon :name="isExpand? 'arrow-down' : 'arrow-up'" />
      </span>
    </div>
    <div
      v-if="isExpand"
      class="event-item-warp-detail"
    >
      <div
        class="list-item"
        @click="jumpAlarmDetail"
      >
        <div class="label-warp">
          <span class="label-title">目标:</span>
          <span class="label-content">100.67.88.121,100.67.88.122</span>
        </div>
        <div class="label-warp">
          <span class="label-title">时长:</span>
          <span class="label-content">1天10小时40分</span>
        </div>
      </div>

      <div
        class="list-item"
        @click="jumpAlarmDetail"
      >
        <div class="label-warp">
          <span class="label-title">目标:</span>
          <span class="label-content">100.67.88.121,100.67.88.122</span>
        </div>
        <div class="label-warp">
          <span class="label-title">时长:</span>
          <span class="label-content">1天10小时40分</span>
        </div>
      </div>
    </div>

    <div
      v-else
      class="event-item-warp-sub-title"
    >
      <span>异常事件</span> :
      <span>1个</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { ALARM_TYPE_LIST } from '../../../typings';
  import './event-item.scss';

  const isExpand = ref(false);

  const backgroundColor = ALARM_TYPE_LIST.find(item => item.value === Math.round(Math.random() * 2))?.iconColor;

  const jumpAlarmDetail = () => {
    uni.navigateTo({
      url: '/pages/alarm-detail/alarm-detail',
    });
  };
</script>


