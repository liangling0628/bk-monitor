import { type PropType, defineComponent } from 'vue';

import { Form, Loading, Sideslider } from 'bkui-vue';
import { useI18n } from 'vue-i18n';

import { useDocumentLink } from '../../../../hooks';

import type { IProfilingServiceDetail } from '../../typings';

import './service-detail-slider.scss';

export default defineComponent({
  name: 'ServiceDetailSlider',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    detail: {
      type: Object as PropType<IProfilingServiceDetail>,
      default: null,
    },
  },
  emits: {
    showChange: (_show: boolean) => true,
  },
  setup(props, { emit }) {
    const { t } = useI18n();
    const { handleGotoLink } = useDocumentLink();

    function handleViewAppDetail() {
      if (!props.detail?.app_name) return;
      const hash = `#/apm/home?queryString=${props.detail.app_name}`;
      window.open(location.href.replace(location.hash, hash), '_self');
    }

    return { t, handleGotoLink, handleViewAppDetail };
  },
  render() {
    return (
      <Sideslider
        width={400}
        ext-cls='profiling-explore-detail-slider'
        isShow={this.show}
        quick-close
        onUpdate:isShow={(val: boolean) => this.$emit('showChange', val)}
      >
        {{
          header: () => (
            <div class='profiling-explore-detail-header'>
              <span class='title'>{this.t('基础信息')}</span>
              <span
                class='jump-link'
                onClick={() => this.handleGotoLink('profiling_docs')}
              >
                <span class='link'>{this.t('Profile 接入指引')}</span>
                <i class='icon-monitor icon-fenxiang' />
              </span>
            </div>
          ),
          default: () => (
            <Loading loading={!this.detail}>
              <div class='profiling-explore-detail-content'>
                {this.detail && (
                  <Form labelWidth={144}>
                    <Form.FormItem label={`${this.t('模块名称')}:`}>{this.detail.name || '-'}</Form.FormItem>
                    <Form.FormItem label={`${this.t('所属应用')}:`}>
                      {this.detail.app_name}
                      <span
                        class='jump-link'
                        onClick={this.handleViewAppDetail}
                      >
                        {this.t('应用详情')}
                        <i class='icon-monitor icon-fenxiang' />
                      </span>
                    </Form.FormItem>
                    <Form.FormItem label={`${this.t('创建时间')}:`}>{this.detail.create_time || '-'}</Form.FormItem>
                    <Form.FormItem label={`${this.t('最近上报时间')}:`}>
                      {this.detail.last_report_time || '-'}
                    </Form.FormItem>
                  </Form>
                )}
              </div>
            </Loading>
          ),
        }}
      </Sideslider>
    );
  },
});
