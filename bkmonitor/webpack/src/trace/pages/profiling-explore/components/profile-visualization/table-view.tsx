import { type PropType, defineComponent } from 'vue';

import TableGraph from '../../../../plugins/charts/profiling-graph/table-graph/table-graph';

import type { TextDirectionType } from '../../typings';
import type { ProfilingTableItem } from 'monitor-ui/chart-plugins/typings';
import type { ProfileDataUnit } from 'monitor-ui/chart-plugins/plugins/profiling-graph/utils';

import './table-view.scss';

export default defineComponent({
  name: 'ProfileTableView',
  props: {
    data: {
      type: Array as PropType<ProfilingTableItem[]>,
      default: () => [],
    },
    unit: {
      type: String as PropType<ProfileDataUnit>,
      default: 'nanoseconds',
    },
    keyword: {
      type: String,
      default: '',
    },
    highlightName: {
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
    dataType: {
      type: String,
      default: '',
    },
  },
  emits: {
    highlightChange: (_name: string) => true,
  },
  render() {
    return (
      <div class='profile-table-view'>
        <TableGraph
          data={this.data}
          dataType={this.dataType}
          filterKeyword={this.keyword}
          highlightName={this.highlightName}
          isCompared={this.isCompared}
          textDirection={this.textDirection}
          unit={this.unit}
          onUpdateHighlightName={name => this.$emit('highlightChange', name || '')}
        />
      </div>
    );
  },
});
