import { type PropType, defineComponent } from 'vue';

import { Dropdown, Input } from 'bkui-vue';
import { useI18n } from 'vue-i18n';

import { PROFILE_VIEW_MODE_LIST, ProfileViewModeEnum, TextDirectionEnum } from '../../constants';

import type { ProfileViewModeType, TextDirectionType } from '../../typings';

import './visualization-toolbar.scss';

export default defineComponent({
  name: 'VisualizationToolbar',
  props: {
    viewMode: {
      type: String as PropType<ProfileViewModeType>,
      default: ProfileViewModeEnum.COMBINE,
    },
    displayModes: {
      type: Array as PropType<ProfileViewModeType[]>,
      default: () => [ProfileViewModeEnum.COMBINE],
    },
    keyword: {
      type: String,
      default: '',
    },
    textDirection: {
      type: String as PropType<TextDirectionType>,
      default: TextDirectionEnum.LTR,
    },
  },
  emits: {
    modeChange: (_mode: ProfileViewModeType) => true,
    keywordChange: (_value: string) => true,
    textDirectionChange: (_value: TextDirectionType) => true,
    download: (_type: 'png' | 'pprof') => true,
  },
  setup() {
    const { t } = useI18n();
    return { t };
  },
  render() {
    return (
      <div class='profiling-visualization-toolbar'>
        <div class='view-mode-group'>
          {PROFILE_VIEW_MODE_LIST.filter(item => this.displayModes.includes(item.value)).map(item => (
            <div
              key={item.value}
              class={['view-mode-item', { active: this.viewMode === item.value }]}
              v-bk-tooltips={{ content: item.label }}
              onClick={() => this.$emit('modeChange', item.value)}
            >
              <i class={['icon-monitor', item.icon]} />
            </div>
          ))}
        </div>
        <Input
          class='keyword-input'
          modelValue={this.keyword}
          placeholder={this.t('搜索')}
          type='search'
          clearable
          onChange={(val: string) => this.$emit('keywordChange', val)}
          onEnter={(val: string) => this.$emit('keywordChange', val)}
        />
        <div class='text-direction-group'>
          {[
            { value: TextDirectionEnum.LTR, label: 'ab' },
            { value: TextDirectionEnum.RTL, label: 'YZ' },
          ].map(item => (
            <div
              key={item.value}
              class={['text-direction-item', { active: this.textDirection === item.value }]}
              onClick={() => this.$emit('textDirectionChange', item.value)}
            >
              {item.label}
            </div>
          ))}
        </div>
        <Dropdown>
          {{
            default: () => (
              <div class='download-btn'>
                <i class='icon-monitor icon-xiazai1' />
              </div>
            ),
            content: () => (
              <Dropdown.DropdownMenu>
                {[ProfileViewModeEnum.FLAME, ProfileViewModeEnum.COMBINE].includes(this.viewMode) && (
                  <Dropdown.DropdownItem onClick={() => this.$emit('download', 'png')}>PNG</Dropdown.DropdownItem>
                )}
                <Dropdown.DropdownItem onClick={() => this.$emit('download', 'pprof')}>pprof</Dropdown.DropdownItem>
              </Dropdown.DropdownMenu>
            ),
          }}
        </Dropdown>
      </div>
    );
  },
});
