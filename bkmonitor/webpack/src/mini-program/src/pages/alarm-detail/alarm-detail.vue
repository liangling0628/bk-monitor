<template>
  <div class="alarm-detail-page">
    <div class="alarm-detail-page-content">
      <van-cell
        :title="t('告警时间')"
        value="2020-02-22 11:10:00"
      />
      <van-cell
        :title="t('告警类型')"
        value="汇总告警"
      />
      <van-cell
        :title="t('通知人')"
        value="javanzhang，nekzhang"
      />

      <monitor-collapse
        :data="collapseData"
        :value="activeNames"
        @change="handleCollapseChange"
      >
        <template #info-summary>
          <div class="info-summary">
            <content-view-card
              :data="infoDetail"
              label-width="42px"
            />
          </div>
        </template>
      </monitor-collapse>

      <div class="event-list">
        <p class="event-list-title">
          {{ t('事件列表') }}({{ eventList.length }})
        </p>
        <div class="event-list-content">
          <event-item-card />
          <event-item-card />
          <event-item-card />
          <event-item-card />
          <event-item-card />
        </div>
      </div>
    </div>
    <div class="alarm-detail-page-footer">
      <van-button
        class="confirm-btn"
        type="primary"
        size="large"
        block
        :disabled="hasConfirm"
        @click="confirmDialogVisible = true"
      >
        {{ t(hasConfirm ? '已确认' : '告警确认') }}
      </van-button>
    </div>


    <van-dialog
      :show="confirmDialogVisible"
      use-slot
      width="280px"
      :title="t('告警确认')"
      show-confirm-button
      show-cancel-button
      @confirm="handleDialogClick('confirm')"
      @cancel="handleDialogClick('cancel')"
    >
      <div class="confirm-container">
        {{ t('告警确认后，异常事件持续未恢复情况将不会再发起通知。注意：请及时处理故障，以免影响业务正常运行！') }}
      </div>
    </van-dialog>
  </div>
</template>
<script lang="ts" setup>
  import { onLoad } from '@dcloudio/uni-app';
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import './alarm-detail.scss';
  import MonitorCollapse from '../../components/monitor-collapse/monitor-collapse.vue';
  import { MonitorCollapseItemProps } from '../../components/monitor-collapse/type';
  import ContentViewCard, { ContentViewCardItem } from '../../components/content-view-card/content-view-card.vue';
  import EventItemCard from './components/event-item-card/event-item-card.vue';

  const { t } = useI18n();

  /** 信息摘要  */
  const activeNames = ref(['1']);
  const collapseData = ref<MonitorCollapseItemProps[]>([{
    attrs: {
      name: '1',
      title: '信息摘要',
    },
    default: {
      slotName: 'info-summary',
    },
  }]);
  const infoDetail = ref<ContentViewCardItem[]>([
    { label: '级别：', value: '[致命] 10G网卡外网流量大于90%' },
    { label: '时间：', value: '2019-09-08  20:17:09' },
    { label: '内容：', value: '已持续10分钟，sum(out_bit_rate)>4G bit，当前值 5.1G bit' },
    { label: '目标：', value: '蓝鲸监控 [100147] 10.57.203.12,20.57.203.1,10.1.0.1' },
  ]);
  const handleCollapseChange = (val: any) => {
    activeNames.value = val;
  };


  /** 事件列表  */
  const eventList = ref([]);


  /** 告警确认  */
  const hasConfirm = ref(false);
  const confirmDialogVisible = ref(false);
  const handleDialogClick = (type: 'confirm' | 'cancel') => {
    if (type === 'confirm') {
      hasConfirm.value = true;
    }
    confirmDialogVisible.value = false;
  };


  onLoad((options) => {
    console.log(options);
  });


</script>
