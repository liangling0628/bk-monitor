import { type PropType, defineComponent } from 'vue';

import { Button } from 'bkui-vue';
import { useI18n } from 'vue-i18n';

import { AGG_METHOD_LIST } from '../../constants';

import type { IProfilingDataType } from '../../typings';

import './data-type-toolbar.scss';

export default defineComponent({
  name: 'DataTypeToolbar',
  props: {
    dataType: {
      type: String,
      default: '',
    },
    dataTypeList: {
      type: Array as PropType<IProfilingDataType[]>,
      default: () => [],
    },
    aggMethod: {
      type: String,
      default: 'AVG',
    },
  },
  emits: {
    'update:dataType': (_value: string) => true,
    'update:aggMethod': (_value: string) => true,
  },
  setup() {
    const { t } = useI18n();
    return { t };
  },
  render() {
    return (
      <div class='profiling-data-type-toolbar'>
        <div class='toolbar-item'>
          <span class='toolbar-label'>{this.t('数据类型')}：</span>
          <Button.ButtonGroup size='small'>
            {this.dataTypeList.map(item => (
              <Button
                key={item.key}
                selected={item.key === this.dataType}
                onClick={() => this.$emit('update:dataType', item.key)}
              >
                {item.name || item.key}
              </Button>
            ))}
          </Button.ButtonGroup>
        </div>
        <div class='toolbar-item'>
          <span class='toolbar-label'>{this.t('汇聚方法')}：</span>
          <Button.ButtonGroup size='small'>
            {AGG_METHOD_LIST.map(item => (
              <Button
                key={item.key}
                selected={item.key === this.aggMethod}
                onClick={() => this.$emit('update:aggMethod', item.key)}
              >
                {item.name}
              </Button>
            ))}
          </Button.ButtonGroup>
        </div>
      </div>
    );
  },
});
