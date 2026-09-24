import { type PropType, defineComponent, shallowRef } from 'vue';

import { Exception } from 'bkui-vue';
import { useI18n } from 'vue-i18n';

import { buildExportUrl } from '../../services/profile-query';
import { ProfileViewModeEnum, TextDirectionEnum } from '../../constants';
import FlameView from './flame-view';
import ProfileViewSkeleton from './profile-view-skeleton';
import TableView from './table-view';
import TopoView from './topo-view';
import VisualizationToolbar from './visualization-toolbar';

import type { UseProfilingVisualizationReturn } from '../../composables/use-profiling-visualization';
import type { IProfilingQueryParams, TextDirectionType } from '../../typings';

import './profile-visualization.scss';

export default defineComponent({
  name: 'ProfileVisualization',
  props: {
    visualization: {
      type: Object as PropType<UseProfilingVisualizationReturn>,
      required: true,
    },
    queryParams: {
      type: Object as PropType<IProfilingQueryParams>,
      default: () => ({}),
    },
  },
  setup(props) {
    const { t } = useI18n();
    const textDirection = shallowRef<TextDirectionType>(TextDirectionEnum.LTR);
    const downloadIndex = shallowRef(0);

    function handleDownload(type: 'png' | 'pprof') {
      if (type === 'png') {
        downloadIndex.value += 1;
        return;
      }
      const url = buildExportUrl({ ...props.queryParams, export_format: 'pprof' });
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    return { t, textDirection, downloadIndex, handleDownload };
  },
  render() {
    const viz = this.visualization;
    const showTable = [ProfileViewModeEnum.TABLE, ProfileViewModeEnum.COMBINE].includes(viz.viewMode.value);
    const showFlame = [ProfileViewModeEnum.FLAME, ProfileViewModeEnum.COMBINE].includes(viz.viewMode.value);
    const showTopo = viz.viewMode.value === ProfileViewModeEnum.TOPO;
    const empty =
      !viz.loading.value &&
      !viz.tableData.value.length &&
      !viz.flameData.value?.children &&
      !(viz.flameData.value as { value?: number })?.value &&
      !viz.topoSrc.value;

    return (
      <div class='profile-visualization'>
        <VisualizationToolbar
          displayModes={viz.displayModes.value}
          keyword={viz.keyword.value}
          textDirection={this.textDirection}
          viewMode={viz.viewMode.value}
          onDownload={this.handleDownload}
          onKeywordChange={viz.handleKeywordChange}
          onModeChange={viz.handleModeChange}
          onTextDirectionChange={val => {
            this.textDirection = val;
          }}
        />
        <div class='visualization-body'>
          {viz.loading.value || !viz.settled.value ? (
            <ProfileViewSkeleton
              isCompared={viz.isCompared.value}
              viewMode={viz.viewMode.value}
            />
          ) : empty ? (
            <Exception
              description={this.t('暂无数据')}
              type='empty'
            />
          ) : (
            <div class={['visualization-content', { 'is-combine': viz.viewMode.value === ProfileViewModeEnum.COMBINE }]}>
              {showTable && (
                <TableView
                  data={viz.tableData.value}
                  dataType={this.queryParams.data_type}
                  highlightName={viz.highlightName.value}
                  isCompared={viz.isCompared.value}
                  keyword={viz.keyword.value}
                  textDirection={this.textDirection}
                  unit={viz.unit.value}
                  onHighlightChange={viz.handleKeywordChange}
                />
              )}
              {showFlame && (
                <FlameView
                  appName={this.queryParams.app_name}
                  data={viz.flameData.value}
                  downloadIndex={this.downloadIndex}
                  isCompared={viz.isCompared.value}
                  keyword={viz.keyword.value}
                  textDirection={this.textDirection}
                  unit={viz.unit.value}
                  onHighlightChange={viz.handleKeywordChange}
                />
              )}
              {showTopo && <TopoView topoSrc={viz.topoSrc.value} />}
            </div>
          )}
        </div>
      </div>
    );
  },
});
