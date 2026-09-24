import { defineComponent } from 'vue';

import TopoGraph from '../../../../plugins/charts/profiling-graph/topo-graph/topo-graph';

import './topo-view.scss';

export default defineComponent({
  name: 'ProfileTopoView',
  props: {
    topoSrc: {
      type: String,
      default: '',
    },
  },
  render() {
    return (
      <div class='profile-topo-view'>
        <TopoGraph topoSrc={this.topoSrc} />
      </div>
    );
  },
});
