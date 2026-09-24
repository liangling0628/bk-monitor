import { type PropType, computed, defineComponent } from 'vue';

import { Switcher } from 'bkui-vue';
import { detectOS } from 'monitor-common/utils';
import { random } from 'monitor-common/utils/utils';
import { useI18n } from 'vue-i18n';

import RefreshRate from '../../../../components/refresh-rate/refresh-rate';
import TimeRange from '../../../../components/time-range/time-range';
import { useProfilingExploreStore } from '../../../../store/modules/profiling-explore';
import { PROFILING_TAB_LIST, ProfilingTabEnum } from '../../constants';
import ApplicationServiceSelect from '../application-service-select/application-service-select';

import type { TimeRangeType } from '../../../../components/time-range/utils';
import type { IProfilingApplication, ProfilingTabType } from '../../typings';

import './profiling-explore-header.scss';

export default defineComponent({
  name: 'ProfilingExploreHeader',
  props: {
    applicationList: {
      type: Array as PropType<IProfilingApplication[]>,
      default: () => [],
    },
    favoriteShow: {
      type: Boolean,
      default: false,
    },
    thumbtackList: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },
  emits: {
    favoriteShowChange: (_show: boolean) => true,
    serviceChange: (_appName: string, _serviceName: string) => true,
    tabChange: (_tab: ProfilingTabType) => true,
    thumbtackChange: (_list: string[]) => true,
    showServiceDetail: () => true,
    setUrlParams: () => true,
  },
  setup(props, { emit }) {
    const { t } = useI18n();
    const store = useProfilingExploreStore();
    const shortcutKeyText = computed(() => (detectOS() === 'Windows' ? 'Ctrl+O' : 'Cmd+O'));

    function handleTabChange(tab: ProfilingTabType) {
      if (tab === store.tab) return;
      store.tab = tab;
      emit('tabChange', tab);
    }

    return {
      t,
      store,
      shortcutKeyText,
      handleTabChange,
      handleComparedChange: (val: boolean) => {
        store.setCompared(val);
        emit('setUrlParams');
      },
      handleDateComparedChange: (val: boolean) => {
        store.dateCompared = val;
        emit('setUrlParams');
      },
      handleTimeRangeChange: (val: TimeRangeType) => {
        store.timeRange = val;
        emit('setUrlParams');
      },
      handleTimezoneChange: (val: string) => {
        store.timezone = val;
        emit('setUrlParams');
      },
      handleRefreshChange: (val: number) => {
        store.refreshInterval = val;
        emit('setUrlParams');
      },
      handleImmediateRefresh: () => {
        store.refreshImmediate = random(4);
      },
    };
  },
  render() {
    return (
      <div class='profiling-explore-header'>
        <div class='header-left'>
          <div class='favorite-container'>
            <div
              class={['favorite-btn', { active: this.favoriteShow }]}
              v-bk-tooltips={{ content: this.t(this.favoriteShow ? '收起收藏夹' : '展开收藏夹') }}
              onClick={() => this.$emit('favoriteShowChange', !this.favoriteShow)}
            >
              <i class='icon-monitor icon-shoucangjia' />
            </div>
          </div>
          <div class='header-title'>{this.t('Profiling 检索')}</div>
          <div class='mode-tab'>
            {PROFILING_TAB_LIST.map(item => (
              <div
                key={item.value}
                class={['mode-tab-item', { active: this.store.tab === item.value }]}
                onClick={() => this.handleTabChange(item.value)}
              >
                {item.label}
              </div>
            ))}
          </div>
          {this.store.tab === ProfilingTabEnum.APPLICATION && <div class='header-divider' />}
          {this.store.tab === ProfilingTabEnum.APPLICATION && (
            <ApplicationServiceSelect
              applicationList={this.applicationList}
              shortcutText={this.shortcutKeyText}
              thumbtackList={this.thumbtackList}
              onServiceChange={(appName, serviceName) => this.$emit('serviceChange', appName, serviceName)}
              onShowDetail={() => this.$emit('showServiceDetail')}
              onThumbtackChange={list => this.$emit('thumbtackChange', list)}
            />
          )}
          {this.store.tab === ProfilingTabEnum.APPLICATION && (
            <div class='compare-switch-group'>
              <div class='compare-switch-item'>
                <Switcher
                  modelValue={this.store.isCompared}
                  size='small'
                  theme='primary'
                  onChange={this.handleComparedChange}
                />
                <span class='compare-switch-label'>{this.t('对比模式')}</span>
              </div>
              {this.store.isCompared && (
                <div class='compare-switch-item'>
                  <Switcher
                    modelValue={this.store.dateCompared}
                    size='small'
                    theme='primary'
                    onChange={this.handleDateComparedChange}
                  />
                  <span class='compare-switch-label'>{this.t('时间对比')}</span>
                </div>
              )}
            </div>
          )}
        </div>
        <div class='header-tools'>
          <TimeRange
            modelValue={this.store.timeRange}
            timezone={this.store.timezone}
            onUpdate:modelValue={this.handleTimeRangeChange}
            onUpdate:timezone={this.handleTimezoneChange}
          />
          <RefreshRate
            value={this.store.refreshInterval}
            onImmediate={this.handleImmediateRefresh}
            onSelect={this.handleRefreshChange}
          />
        </div>
      </div>
    );
  },
});
