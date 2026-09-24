import { type PropType, computed, defineComponent, onMounted, onUnmounted, shallowRef } from 'vue';

import { Select } from 'bkui-vue';
import { deepClone } from 'monitor-common/utils';
import { useI18n } from 'vue-i18n';

import { useProfilingExploreStore } from '../../../../store/modules/profiling-explore';

import type { IProfilingApplication } from '../../typings';

import './application-service-select.scss';

function buildValue(appName: string, serviceName: string) {
  return appName && serviceName ? `${appName}::${serviceName}` : '';
}

function parseValue(value: string) {
  const [appName, serviceName] = (value || '').split('::');
  return { appName, serviceName };
}

export default defineComponent({
  name: 'ApplicationServiceSelect',
  props: {
    applicationList: {
      type: Array as PropType<IProfilingApplication[]>,
      default: () => [],
    },
    thumbtackList: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    shortcutText: {
      type: String,
      default: 'Cmd+O',
    },
  },
  emits: {
    serviceChange: (_appName: string, _serviceName: string) => true,
    thumbtackChange: (_list: string[]) => true,
    showDetail: () => true,
  },
  setup(props, { emit }) {
    const { t } = useI18n();
    const store = useProfilingExploreStore();
    const selectRef = shallowRef<InstanceType<typeof Select>>(null);
    const toggle = shallowRef(false);

    const selectedValue = computed(() => buildValue(store.appName, store.serviceName));
    const displayText = computed(() => {
      if (!store.currentApp || !store.serviceName) return '';
      return `${store.currentApp.app_alias || store.currentApp.app_name} / ${store.serviceName}`;
    });

    const sortedList = computed(() => {
      const pinned: IProfilingApplication[] = [];
      const others: IProfilingApplication[] = [];
      for (const item of props.applicationList) {
        const target = props.thumbtackList.includes(item.app_name) ? pinned : others;
        target.push({ ...item, isTop: target === pinned });
      }
      return [...pinned, ...others];
    });

    function handleSelect(value: string) {
      const { appName, serviceName } = parseValue(value);
      if (!appName || !serviceName) return;
      if (appName === store.appName && serviceName === store.serviceName) return;
      store.appName = appName;
      store.serviceName = serviceName;
      emit('serviceChange', appName, serviceName);
    }

    function handleThumbtack(event: Event, item: IProfilingApplication) {
      event.stopPropagation();
      const list: string[] = deepClone(props.thumbtackList);
      emit('thumbtackChange', item.isTop ? list.filter(name => name !== item.app_name) : [item.app_name, ...list]);
    }

    function handleShortcut(event: KeyboardEvent) {
      if (event.key?.toLowerCase() !== 'o' || !(event.ctrlKey || event.metaKey)) return;
      event.preventDefault();
      selectRef.value?.showPopover();
    }

    onMounted(() => window.addEventListener('keydown', handleShortcut));
    onUnmounted(() => window.removeEventListener('keydown', handleShortcut));

    return {
      t,
      store,
      selectRef,
      toggle,
      selectedValue,
      displayText,
      sortedList,
      handleSelect,
      handleThumbtack,
    };
  },
  render() {
    return (
      <div class='application-service-select-wrap'>
        <Select
          ref='selectRef'
          class='application-service-select'
          clearable={false}
          modelValue={this.selectedValue}
          popoverOptions={{ extCls: 'profiling-explore-application-select-popover' }}
          search-placeholder={this.t('请输入 关键字')}
          filterable
          onSelect={this.handleSelect}
          onToggle={(val: boolean) => {
            this.toggle = val;
          }}
        >
          {{
            trigger: () => (
              <div class='application-select-trigger'>
                <span class='data-prefix'>{this.t('应用服务')}：</span>
                <span
                  class='application-name'
                  v-overflow-tips
                >
                  {this.displayText}
                </span>
                {!this.toggle && <div class='select-shortcut-keys'>{this.shortcutText}</div>}
                <span class={['icon-monitor icon-mc-arrow-down', { expand: this.toggle }]} />
              </div>
            ),
            default: () =>
              this.sortedList.map(app => (
                <Select.Group
                  key={app.app_name}
                  label={`${app.app_alias}(${app.app_name})`}
                >
                  {(app.services || []).map(service => (
                    <Select.Option
                      id={buildValue(app.app_name, service.name)}
                      key={buildValue(app.app_name, service.name)}
                      name={`${app.app_alias} / ${service.name}`}
                    >
                      <div class={['application-item-name', { 'is-top': app.isTop }]}>
                        <i
                          class={[
                            'icon-monitor',
                            'thumbtack',
                            app.isTop ? 'icon-a-pinnedtuding' : 'icon-a-pintuding',
                          ]}
                          onClick={event => this.handleThumbtack(event, app)}
                        />
                        <span class='name-text'>{service.name}</span>
                      </div>
                    </Select.Option>
                  ))}
                </Select.Group>
              )),
          }}
        </Select>
        <div
          class='service-detail-btn'
          v-bk-tooltips={{ content: this.t('服务详情') }}
          onClick={() => this.$emit('showDetail')}
        >
          <i class='icon-monitor icon-mc-file' />
        </div>
      </div>
    );
  },
});
