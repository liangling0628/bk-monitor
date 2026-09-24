import { type PropType, defineComponent } from 'vue';

import FrameGraph from '../../../../plugins/charts/profiling-graph/profiling-flame-graph/flame-graph';

import type { TextDirectionType } from '../../typings';
import type { BaseDataType } from 'monitor-ui/chart-plugins/typings';
import type { ProfileDataUnit } from 'monitor-ui/chart-plugins/plugins/profiling-graph/utils';

import './flame-view.scss';

export default defineComponent({
  name: 'ProfileFlameView',
  props: {
    data: {
      type: Object as PropType<BaseDataType>,
      default: () => ({ name: '', children: undefined, id: '' }),
    },
    unit: {
      type: String as PropType<ProfileDataUnit>,
      default: 'nanoseconds',
    },
    keyword: {
      type: String,
      default: '',
    },
    textDirection: {
      type: String as PropType<TextDirectionType>,
      default: 'ltr',
    },
    isCompared: {
      type: Boolean,
      default: false,
    },
    downloadIndex: {
      type: Number,
      default: 0,
    },
    appName: {
      type: String,
      default: '',
    },
  },
  emits: {
    highlightChange: (_name: string) => true,
  },
  render() {
    return (
      <div class='profile-flame-view'>
        <FrameGraph
          appName={this.appName}
          data={this.data}
          downloadImgIndex={this.downloadIndex}
          filterKeyword={this.keyword}
          isCompared={this.isCompared}
          textDirection={this.textDirection}
          unit={this.unit}
          onUpdate:filterKeyword={name => this.$emit('highlightChange', name || '')}
        />
      </div>
    );
  },
});
