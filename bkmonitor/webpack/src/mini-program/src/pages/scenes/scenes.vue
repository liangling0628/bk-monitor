<template>
  <div
    class="page-alert"
  >
    <page-wrapper
      title="观测场景"
      tab-bar-page
    >
      <div class="page-search">
        <div
          class="header-search"
          @click="handleSearchClick"
        >
          <div
            v-if="isSearch"
            class="search-container"
          >
            <van-icon
              name="search"
              class="search-icon"
            />
            <div class="search-input">
              <van-field
                ref="inputRef"
                v-model="search"
                :value="search"
                clearable
                focus
                :border="false"
                @change="handleSearchChange"
              />
            </div>
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
          v-if="isSearch"
          class="search-cancel"
          @click="handleSearchCancel"
        >
          {{ t('取消') }}
        </div>
      </div>

      <div class="page-content">
        <div class="collect">
          <van-icon name="star-o" />
        </div>
        <div class="category-list">
          <!-- 没有搜索 -->
          <template v-if="!search">
            <div
              v-for="category of categoryList"
              :key="category.type"
              class="category-item"
            >
              <p
                class="title"
              >
                {{ t(category.name) }}
                <van-icon name="arrow" />
              </p>
              <div class="children-list">
                <div
                  v-for="(children,i) of category.children"
                  :key="children.name"
                  class="children-item"
                  @click="handleJumpPage(category.type)"
                >
                  <span
                    class="status"
                    :class="[children.status]"
                  />
                  <div
                    class="info"
                    :class="{ last: i ===searchList.length - 1 }"
                  >
                    <p
                      class="name"
                    >
                      {{ children.name }}
                    </p>
                    <span class="desc">
                      {{ children.desc }}
                      <van-icon
                        name="arrow"
                        class="icon"
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <!-- 搜索后 -->
          <template v-else>
            <div
              v-for="item of searchList"
              :key="item.name"
              class="search-item"
              @click="handleJumpPage(item.type)"
            >
              <span
                class="status"
                :class="[item.status]"
              />
              <div
                class="info"
              >
                <div class="content">
                  <p class="name">
                    {{ item.name }}
                  </p>
                  <p class="category-name">
                    {{ item.categoryName }}
                  </p>
                </div>
                <span class="desc">
                  {{ item.desc }}
                  <van-icon
                    name="arrow"
                    class="icon"
                  />
                </span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </page-wrapper>
  </div>
</template>
<script setup lang="ts">
  import { ref, nextTick, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import PageWrapper from '../../components/page-wrapper/page-wrapper.vue';
  import { CategoryList, CategoryListItem } from './typing';
  import './scenes.scss';
  const { t } = useI18n();

  const inputRef = ref();
  const search = ref('');
  const isSearch = ref(false); // 是否是搜索状态
  const handleSearchClick = () => {
    isSearch.value = true;
    // #ifdef H5
    nextTick(() => {
      // 只有h5组件才有focus方法
      inputRef.value?.focus();
    });
    // #endif
  };
  const handleSearchChange = (val: any) => {
    // #ifdef MP-WEIXIN
    search.value = val.detail;
    // #endif
  };
  /** 取消搜索 */
  const handleSearchCancel = () => {
    search.value = '';
    isSearch.value = false;
  };


  const categoryList = ref<CategoryList[]>([
    {
      type: 'host',
      name: '主机监控',
      children: [
        { status: 'success', name: '100.97.144.94', desc: 'VM-87-127-centos' },
        { status: 'warning', name: '100.97.144.95', desc: 'VM-87-127-centos' },
        { status: 'error', name: '100.97.144.96', desc: 'VM-87-127-centos' },
        { status: 'warning', name: '100.97.144.97', desc: 'VM-87-127-centos' },
        { status: 'success', name: '100.97.144.98', desc: 'VM-87-127-centos' },
      ],
    },
    {
      type: 'custom',
      name: '自定义场景',
      children: [
        { status: 'success', name: 'MySQL', desc: 'bkplugin_mysqul' },
        { status: 'warning', name: 'apm调试', desc: 'bkplugin_mysqul' },
      ],
    },
  ]);
  const searchList = computed(() => categoryList.value.reduce<(CategoryListItem & {categoryName: string, type:CategoryList['type'] })[]>(
    (pre, cur) => {
      cur.children.reduce((p, c) => {
        if (c.name.includes(search.value)) {
          pre.push({ ...c, categoryName: cur.name, type: cur.type });
        }
        return p;
      }, pre);
      return pre;
    }, []));

  const handleJumpPage = (type:CategoryList['type'])  => {
    // uni.navigateTo({
    //   url: '',
    // });
  };
</script>
