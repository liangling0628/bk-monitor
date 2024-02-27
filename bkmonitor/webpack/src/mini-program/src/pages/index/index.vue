<template>
  <div class="page-alert">
    <page-wrapper
      title="告警事件"
      tab-bar-page
    >
      <div class="page-alert-header">
        <div
          class="header-search"
          @click="handleGotoSearch"
        >
          <div
            v-if="search"
            class="search-container"
          >
            <van-icon
              name="search"
              class="search-icon"
            />
            <span class="search-content">{{ search }}</span>
          </div>
          <template v-else>
            <van-icon
              name="search"
              class="search-icon"
            />
            {{ t('搜索') }}
          </template>
        </div>
        <div
          v-if="search"
          class="search-cancel"
          @click="handleSearchCancel"
        >
          {{ t('取消') }}
        </div>
      </div>
      <div class="page-alert-tab">
        <van-tabs
          class="alert-tabs"
          :ellipsis="false"
          title-active-color="#494B50"
          title-inactive-color="#63656E"
        >
          <van-tab
            v-for="tab in tabList"
            :key="tab"
            :title="tab"
          />
        </van-tabs>
        <time-select
          :options="TIME_LIST"
          :value="timeLine"
          @select="handleTimeLineSelect"
        />
      </div>
      <div class="page-alert-content">
        <type-filter
          :list="ALARM_TYPE_LIST"
          :active-type="activeType"
          @select="handleTypeSelect"
        />
        <event-item />
        <event-item />
        <event-item />
        <event-item />
        <event-item />
        <event-item />
        <event-item />
        <event-item />
      </div>
    </page-wrapper>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import PageWrapper from '../../components/page-wrapper/page-wrapper.vue';
  import TypeFilter from '../../components/type-filter/type-filter.vue';
  import EventItem from './components/event-item.vue';
  import TimeSelect from '../../components/time-select/time-select.vue';
  import { TIME_LIST, ALARM_TYPE_LIST } from '../../typings';
  import { useI18n } from 'vue-i18n';
  import './index.scss';
  const { t } = useI18n();
  const tabList = ['全部', '未恢复', '异常目标', '已屏蔽', '测试123', '测试666'];

  const activeType = ref('');  // 告警类型
  const search = ref('');      // 搜索内容
  const timeLine = ref('1d');  // 时间筛选

  uni.$on('search', (value:string) => {
    search.value = value;
  });

  const handleTypeSelect = (value:any) => {
    activeType.value = value;
  };

  const handleTimeLineSelect = (value:any) => {
    timeLine.value = value;
  };


  const handleGotoSearch = () => {
    uni.navigateTo({
      url: `/pages/search/search?search=${search.value}`,
    });
  };

  /** 取消搜索 */
  const handleSearchCancel = () => {
    search.value = '';
  };
</script>
