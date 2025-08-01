/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) available.
 *
 * Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
 *
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) is licensed under the MIT License.
 *
 * License for 蓝鲸智云PaaS平台 (BlueKing PaaS):
 *
 * ---------------------------------------------------
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 * to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of
 * the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */
import { Component, Prop, Watch } from 'vue-property-decorator';
import { Component as tsc } from 'vue-tsx-support';

import dayjs from 'dayjs';
import Viewer from 'fta-solutions/pages/event/event-detail/custom-view';
import WhereDisplay from 'fta-solutions/pages/event/event-detail/where-display';
import TipMsg from 'fta-solutions/pages/setting/components/tip-msg';
// import { getMetricListV2 } from 'monitor-api/modules/strategies';
import { deleteExperience, getExperience, saveExperience } from 'monitor-api/modules/alert';
import { random, transformDataKey } from 'monitor-common/utils/utils';
import Editor from 'monitor-ui/markdown-editor/editor';

import DeleteSubtitle from '../../../pages/strategy-config/strategy-config-common/delete-subtitle';
import ConditionInput, {
  type IConditionItem,
} from '../../../pages/strategy-config/strategy-config-set-new/monitor-data/condition-input';

import type { IMetricDetail } from '../../strategy-config/strategy-config-set-new/typings';
import type { IDetail } from 'fta-solutions/pages/event/event-detail/type';

import './handle-experiences.scss';

enum EType {
  DIMENSION = 'dimension',
  METRIC = 'metric',
}

const bindList = [
  { id: EType.METRIC, name: window.i18n.tc('指标') },
  { id: EType.DIMENSION, name: window.i18n.tc('维度') },
];

interface IHandleExperienceProps {
  show?: boolean;
  detail?: IDetail;
  metricData?: IMetricDetail;
}
interface IExperience {
  type: EType;
  conditions?: IConditionItem[];
  metric?: any[];
  description: string;
  create_user?: string;
  create_time?: string;
  update_user?: string;
  update_time?: string;
  is_match?: boolean; // 是否命中；只作为标识
  id?: string; // 仅用于删除
  alert_name?: string;
}

@Component({
  name: 'HandleExperience',
})
export default class HandleExperience extends tsc<IHandleExperienceProps> {
  @Prop({ type: Boolean, default: false }) show: boolean;
  // @Prop({ type: Object, default: () => ({}) }) detail: IDetail;
  @Prop({ type: Object, default: () => null }) metricData: IMetricDetail;

  isLoading = false;
  // 当前绑定关系
  curBind: EType = EType.METRIC;
  // 条件数据
  conditionList: IConditionItem[] = [];
  // 是否为编辑模式
  mode: 'add' | 'edit' | 'list' = 'list';
  // 当前md文档内容
  curDescription = '';
  // 当前经验列表
  experienceList: IExperience[] = [];
  // 当前指标名
  curMetricName = '';
  // 当前指标标题
  curMetricTitle = window.i18n.tc('指标名');
  // 编辑/新增页时当前更新时间
  curUpdateInfo: IExperience | string = '';
  // 获取变量值的参数
  metricMeta = null;
  // 维度列表
  dimensionList = [];
  // 内容校验
  errMsg = '';
  // 所有变量值(避免重复调用接口)
  allWhereValueMap = new Map();
  // 指标翻译
  metricNameMap = {};
  // 条件校验
  errConditions = '';
  selectKey = random(8);
  /* 默认填充维度维度 */
  defaultDimensionValue: { [propName: string]: string[] } = {};

  @Watch('show')
  async handleShow(v) {
    if (v) {
      if (this.experienceList.length) return;
      await this.init();
    }
  }
  /* 获取变量接口参数及维度列表 */
  /* 通过指标id获取维度交集 */
  async init() {
    this.isLoading = true;
    if (!Object.keys(this.defaultDimensionValue).length) {
      for (const item of this.metricData.dimensions) {
        if (item.is_dimension) this.defaultDimensionValue[item.id] = [];
      }
    }
    this.metricNameMap[this.metricData.metric_id] = this.metricData.name;
    this.dimensionList = this.metricData.dimensions.filter(item => !!item.is_dimension);
    const dataSourceType = this.metricData.data_source_label;
    const dataTypeLabel = this.metricData.data_type_label;
    const metricField = this.metricData.metric_field;
    const resultTableId = this.metricData.result_table_id;
    this.metricMeta = {
      data_source_label: dataSourceType,
      data_type_label: dataTypeLabel,
      metric_field: metricField,
      result_table_id: resultTableId,
    };
    this.experienceList = await getExperience({
      metric_id: this.metricData.metric_id,
    }).catch(() => []);
    this.isLoading = false;
  }
  /* 点击添加按钮 */
  handleAdd() {
    const hasMetric = this.experienceList.some(item => item.type === EType.METRIC);
    this.curBind = hasMetric ? EType.DIMENSION : EType.METRIC;
    this.curDescription = '';
    if (hasMetric) {
      this.errConditions = '';
      this.conditionList = [];
      this.curUpdateInfo = '';
      this.dimensionDataChange();
    } else {
      this.metricDataChange();
    }
    this.mode = 'add';
    setTimeout(() => {
      this.errMsg = '';
    }, 50);
  }
  /* 切换绑定关系 */
  handleBindSelect(v: EType) {
    const changeInit = () => {
      this.errConditions = '';
      this.errMsg = '';
      if (v === EType.METRIC) {
        this.metricDataChange();
      } else if (v === EType.DIMENSION) {
        this.conditionList = [];
        this.curDescription = '';
        this.curUpdateInfo = '';
        this.dimensionDataChange();
      }
    };
    // 没有更改过切换后的内容则不弹窗
    const hasMetric = this.experienceList.some(item => item.type === EType.METRIC);
    const metricDescription = hasMetric
      ? this.experienceList.find(item => item.type === EType.METRIC)?.description || ''
      : '';
    const description = this.curBind === EType.DIMENSION ? '' : metricDescription;
    if (this.curDescription !== description && this.curDescription) {
      this.$bkInfo({
        type: 'warning',
        title: this.$t('切换将不保存当前内容'),
        maskClose: true,
        escClose: true,
        confirmFn: () => {
          this.curBind = v;
          changeInit();
        },
        cancelFn: () => {
          this.selectKey = random(8);
        },
      });
      return;
    }
    this.curBind = v;
    changeInit();
  }
  getMetricName() {
    const metricName =
      `${this.metricData.data_source_label}_${this.metricData.data_type_label}` === 'log_time_series'
        ? `${this.metricData.related_name}.${this.metricData.metric_field}`
        : this.metricData.result_table_id
          ? `${this.metricData.result_table_id}.${this.metricData.metric_field}`
          : this.metricData.metric_field;
    return metricName;
  }
  /* 切换至指标类型回填数据 */
  metricDataChange() {
    const hasMetric = this.experienceList.some(item => item.type === EType.METRIC);
    this.curMetricTitle = this.$tc('指标名');
    if (hasMetric) {
      const metricItem = this.experienceList.find(item => item.type === EType.METRIC);
      this.curDescription = metricItem.description;
      this.curMetricName = metricItem.alert_name || this.metricData.metric_field_name || this.getMetricName();
      this.curUpdateInfo = metricItem;
    } else {
      this.curMetricName = this.metricData.metric_field_name;
      this.curUpdateInfo = '';
    }
  }
  /* 切换至维度类型回填数据 */
  dimensionDataChange() {
    const index = this.experienceList.findIndex(
      item => this.conditionCompare(item.conditions, this.conditionList) && item.type === EType.DIMENSION
    );
    const confirm = () => {
      this.curDescription = this.experienceList[index].description;
      this.curUpdateInfo = this.experienceList[index];
      this.errMsg = '';
    };
    if (index > -1) {
      this.$bkInfo({
        type: 'warning',
        title: window.i18n.tc('已命中一条已有维度，是否填入其经验'),
        maskClose: true,
        escClose: true,
        confirmFn: () => confirm(),
      });
    }
  }
  /* 判断条件相等的规则 */
  conditionCompare(left: IConditionItem[], right: IConditionItem[]) {
    const leftCodition = JSON.parse(JSON.stringify(left));
    const rightCondition = JSON.parse(JSON.stringify(right));
    const leftStr = JSON.stringify(leftCodition.map(item => ({ ...item, value: item.value.sort() })));
    const rightStr = JSON.stringify(rightCondition.map(item => ({ ...item, value: item.value.sort() })));
    return leftStr === rightStr;
  }
  /* 取消 */
  handleCancel() {
    this.errConditions = '';
    this.errMsg = '';
    this.mode = 'list';
  }
  /* 编辑 */
  handleEdit(v: IExperience) {
    this.curBind = v.type;
    this.curDescription = v.description;
    this.curUpdateInfo = v;
    if (v.type === EType.METRIC) {
      this.curMetricName = v.metric.map(id => this.metricNameMap[id] || id).join(',') || this.getMetricName();
      this.curMetricTitle = this.$tc('指标名');
    } else if (v.type === EType.DIMENSION) {
      this.conditionList = JSON.parse(JSON.stringify(v.conditions));
    }
    this.mode = 'edit';
  }
  /* 删除 */
  handleDelete(v: IExperience, index: number) {
    const titleMap = {
      [EType.METRIC]: this.$tc('指标'),
      [EType.DIMENSION]: this.$tc('维度'),
    };
    this.$bkInfo({
      type: 'warning',
      title: this.$t('确认删除该经验？'),
      subHeader: this.$createElement(
        DeleteSubtitle,
        {
          props: {
            title: titleMap[v.type],
          },
        },
        [
          v.type === EType.METRIC
            ? v.metric?.map(id => this.metricNameMap[id] || id).join(',') || this.getMetricName()
            : this.$createElement(WhereDisplay, {
                props: {
                  value: v.conditions,
                  groupByList: this.dimensionList,
                  metric: this.metricMeta,
                },
              }),
        ]
      ),
      maskClose: true,
      escClose: true,
      confirmFn: async () => {
        const res = await deleteExperience({ id: v.id }).catch(() => false);
        if (res !== false) {
          this.experienceList.splice(index, 1);
          this.$bkMessage({ theme: 'success', message: this.$t('删除成功') });
        }
      },
    });
  }

  /* 保存 */
  async handleSave() {
    if (
      !(!!this.conditionList.length && !!this.conditionList[0]?.key && !!this.conditionList[0]?.value?.length) &&
      this.curBind === EType.DIMENSION
    ) {
      this.errConditions = this.$tc('注意: 必填字段不能为空');
      return;
    }
    if (!this.curDescription) {
      this.handleInputContent('');
      return;
    }
    this.isLoading = true;
    const params = {
      metric_id: this.metricData.metric_id,
      description: this.curDescription,
      type: this.curBind,
      conditions: this.curBind === EType.METRIC ? undefined : JSON.parse(JSON.stringify(this.conditionList)),
    };
    const item = await saveExperience(params).catch(() => false);
    if (!item) return;
    const hasMetric = this.experienceList.findIndex(item => item.type === EType.METRIC) > -1;
    const index = this.experienceList.findIndex(item =>
      this.curBind === EType.METRIC
        ? item.type === EType.METRIC
        : this.conditionCompare(item.conditions, this.conditionList) && item.type === EType.DIMENSION
    );
    if (index > -1) {
      this.experienceList.splice(index, 1);
    }
    if (item.type === EType.METRIC || !hasMetric) {
      this.experienceList.unshift(item);
    } else {
      this.experienceList.splice(1, 0, item);
    }
    this.init();
    this.mode = 'list';
    this.isLoading = false;
  }

  /* 条件变更 */
  handleCondition(v: IConditionItem[]) {
    this.errConditions = !!v.length && !!v[0]?.key ? '' : this.$tc('注意: 必填字段不能为空');
    this.conditionList = v;
    this.dimensionDataChange();
  }
  /* 输入md文档 */
  handleInputContent(v: string) {
    this.errMsg = v ? '' : this.$tc('注意: 必填字段不能为空');
    this.curDescription = v;
  }

  getUpdataInfo(item: IExperience) {
    if (!item) return null;
    if (item.update_user) {
      return (
        <div>
          <bk-user-display-name user-id={item.update_user} />
          {this.$t(' 于 {0} 更新', [dayjs.tz(item.update_time).format('YYYY-MM-DD HH:mm:ss')])},
        </div>
      );
    }
    return (
      <div>
        <bk-user-display-name user-id={item.create_user} />,
        {this.$t(' 于 {0} 创建', [dayjs.tz(item.create_time).format('YYYY-MM-DD HH:mm:ss')])}
      </div>
    );
  }
  render() {
    return (
      <div
        class={['event-detail-handleexperiences', { displaynone: !this.show }]}
        v-bkloading={{ isLoading: this.isLoading }}
      >
        <TipMsg msg={this.$tc('处理经验可以与指标和维度进行绑定，可以追加多种处理经验方便经验的共享。')} />
        {/* 添加按钮 */}
        {this.mode === 'list' && (
          <div
            class='big-add-btn'
            onClick={this.handleAdd}
          >
            <div class='center-text'>
              <span class='icon-monitor icon-mc-add' />
              <span class='text'>{this.$t('新增处理建议')}</span>
            </div>
          </div>
        )}
        {/* 空样式 */}
        {!this.experienceList.length && this.mode === 'list' && (
          <div>
            <bk-exception
              class='empty-bg'
              type='empty'
            >
              <span>{this.$t('当前暂无处理经验')}</span>
            </bk-exception>
          </div>
        )}
        {/* 经验列表 */}
        {this.mode === 'list' && (
          <div class='experience-list'>
            {this.experienceList.map((item, index) => (
              <div
                key={index}
                class='experience-item'
              >
                <div class='item-header'>
                  {item.type === EType.METRIC && (
                    <div class='metric-title'>
                      <div class='bookmarks' />
                      {`${this.$t('指标')} - ${item.metric.map(id => this.metricNameMap[id] || id).join(',')}`}
                    </div>
                  )}
                  {item.type === EType.DIMENSION && (
                    <div class='dimsion-title'>
                      <span>{`${this.$t('维度')} -`}</span>
                      {Boolean(this.metricMeta) && (
                        <WhereDisplay
                          class='condition-readonly'
                          allWhereValueMap={this.allWhereValueMap}
                          groupByList={this.dimensionList}
                          metric={this.metricMeta as any}
                          value={item.conditions as any}
                          onValueMapChange={v => (this.allWhereValueMap = v)}
                        />
                      )}
                    </div>
                  )}
                  {item.is_match && item.type === EType.DIMENSION && <div class='status'>{this.$t('已命中')}</div>}
                  <div class='update-time'>{this.getUpdataInfo(item)}</div>
                  <div class='operate-options'>
                    <span
                      class='icon-monitor icon-bianji'
                      onClick={() => this.handleEdit(item)}
                    />
                    <span
                      class='icon-monitor icon-mc-delete-line'
                      onClick={() => this.handleDelete(item, index)}
                    />
                  </div>
                </div>
                <div class='item-content'>
                  {item.description ? (
                    <Viewer
                      key={item.description.length}
                      value={item.description}
                    />
                  ) : undefined}
                </div>
              </div>
            ))}
          </div>
        )}
        {/* 编辑/新建内容 */}
        {this.mode !== 'list' && (
          <div class='edit-content'>
            <div class='content-header'>
              <div class='bind-relation'>
                <div class='title'>{this.$t('绑定关系')}</div>
                <div class='red'>*</div>
                <div
                  v-bk-tooltips={{
                    content: this.mode === 'edit' && this.$t('编辑模式不能切换'),
                    placements: ['top'],
                    boundary: 'window',
                    disabled: this.mode !== 'edit',
                  }}
                >
                  <bk-select
                    key={this.selectKey}
                    class='bind-select'
                    clearable={false}
                    readonly={this.mode === 'edit'}
                    value={this.curBind}
                    onSelected={this.handleBindSelect}
                  >
                    {bindList.map(item => (
                      <bk-option
                        id={item.id}
                        key={item.id}
                        name={item.name}
                      />
                    ))}
                  </bk-select>
                </div>
              </div>
              <div class='bind-condition'>
                {this.curBind === EType.METRIC && (
                  <span class='metric-name'>{`${this.curMetricTitle}：${this.curMetricName}`}</span>
                )}
                {this.curBind === EType.DIMENSION &&
                  (this.mode === 'edit' ? (
                    <WhereDisplay
                      class='condition-readonly'
                      groupByList={this.dimensionList}
                      metric={this.metricMeta as any}
                      value={this.conditionList as any}
                    />
                  ) : (
                    <ConditionInput
                      conditionList={this.conditionList}
                      defaultValue={this.defaultDimensionValue}
                      dimensionsList={this.dimensionList}
                      metricMeta={transformDataKey(this.metricMeta)}
                      on-change={this.handleCondition}
                    />
                  ))}
                {!!this.errConditions && this.mode === 'add' ? (
                  <div class='err-red'>{this.errConditions}</div>
                ) : undefined}
              </div>
              <div class='updata-time'>
                {this.curUpdateInfo ? this.getUpdataInfo(this.curUpdateInfo as IExperience) : ''}
              </div>
            </div>
            <div class='content-md'>
              <Editor
                value={this.curDescription}
                on-input={(v: string) => this.handleInputContent(v)}
              />
              {this.errMsg ? <div class='err-red'>{this.errMsg}</div> : undefined}
            </div>
            <div class='content-bottom'>
              <bk-button
                class='save'
                theme='primary'
                onClick={this.handleSave}
              >
                {this.$t('保存')}
              </bk-button>
              <bk-button
                class='cancel'
                onClick={this.handleCancel}
              >
                {this.$t('取消')}
              </bk-button>
            </div>
          </div>
        )}
      </div>
    );
  }
}
