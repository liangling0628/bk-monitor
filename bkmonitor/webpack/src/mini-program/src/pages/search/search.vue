<template>
  <div class="page-search">
    <page-wrapper title="搜索">
      <div class="page-search-header">
        <icon
          class="search-icon"
          type="search"
          :size="12"
        />
        <input
          :value="search"
          class="uni-input"
          confirm-type="search"
          :placeholder="t('搜索')"
          @input="handleInputChange"
          @confirm="handleSearch"
        >
        <icon
          v-if="showClearIcon"
          class="clear-icon"
          type="clear"
          :size="14"
          @click="clearInputValue"
        />
      </div>
      <div class="page-search-history">
        <div class="page-search-history-title">
          <span class="name">{{ t('历史搜索') }}</span>
          <van-icon
            name="delete-o"
            @click="handleDeleteSearchHistory"
          />
        </div>
        <div class="page-search-history-tag">
          <span
            v-for="(item,index) of historyList"
            :key="index"
            class="tag"
            @click="handleTagClick(item)"
          >{{ item }}</span>
        </div>
      </div>
    </page-wrapper>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import PageWrapper from '../../components/page-wrapper/page-wrapper.vue';
  import { useI18n } from 'vue-i18n';
  import './search.scss';

  const { t } = useI18n();
  const search = ref('');
  const showClearIcon = ref(false);
  const historyList = ref<string[]>([]);

  onLoad((options) => {
    search.value = options?.search || '';
    showClearIcon.value = !!options?.search;
  });

  const handleDeleteSearchHistory = () => {
    try {
      uni.removeStorageSync('event_history');
      getSearchHistoryList();
    } catch (e) {
      console.log(e);
    }
  };

  const getSearchHistoryList = () => {
    try {
      const eventHistory = uni.getStorageSync('event_history');
      historyList.value = eventHistory ? eventHistory : [];
    } catch (e) {
      console.log(e);
    }
  };


  const handleSearch = () => {
    try {
      // 搜索记录中已有的关键词需将搜索关键词放到最前面
      if (historyList.value.includes(search.value)) {
        const list = [...historyList.value];
        const index = list.findIndex(item => item === search.value);
        list.splice(index, 1);
        list.unshift(search.value);
        uni.setStorageSync('event_history', list);
      } else {
        uni.setStorageSync('event_history', [search.value, ...historyList.value]);
      }
      getSearchHistoryList();
      uni.$emit('search', search.value);
      uni.switchTab({
        url: '/pages/index/index',
      });
      search.value = '';
    } catch (e) {
      console.log(e);
    }
  };


  const handleTagClick = (value:string) => {
    uni.$emit('search', value);
    uni.switchTab({
      url: '/pages/index/index',
    });
  };

  const handleInputChange = (event:any) => {
    search.value = event.detail.value;
    showClearIcon.value = !!event.detail.value.length;
  };

  const clearInputValue = () => {
    search.value = '';
    showClearIcon.value = false;
  };


  onMounted(() => {
    getSearchHistoryList();
  });
</script>
