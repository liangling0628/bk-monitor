import { EMethod } from '../../components/retrieval-filter/typing';

import type { IFilterField } from '../../components/retrieval-filter/typing';

/** 页面三个一级 tab，本期只实现应用服务 */
export const ProfilingTabEnum = {
  APPLICATION: 'application',
  FILE: 'file',
  ACTIVE: 'active',
} as const;

export const PROFILING_TAB_LIST = [
  { value: ProfilingTabEnum.APPLICATION, label: window.i18n.t('应用服务') },
  { value: ProfilingTabEnum.FILE, label: window.i18n.t('文件分析') },
  { value: ProfilingTabEnum.ACTIVE, label: window.i18n.t('主动采集') },
] as const;

/** 可视化视图，取值对齐 query.diagram_types */
export const ProfileViewModeEnum = {
  TABLE: 'table',
  COMBINE: 'combine',
  FLAME: 'flame',
  TOPO: 'topo',
} as const;

export const PROFILE_VIEW_MODE_LIST = [
  { value: ProfileViewModeEnum.TABLE, icon: 'icon-table', label: window.i18n.t('表格') },
  { value: ProfileViewModeEnum.COMBINE, icon: 'icon-mc-fenping', label: window.i18n.t('分屏') },
  { value: ProfileViewModeEnum.FLAME, icon: 'icon-mc-flame', label: window.i18n.t('火焰图') },
  { value: ProfileViewModeEnum.TOPO, icon: 'icon-Component', label: window.i18n.t('拓扑') },
] as const;

export const TextDirectionEnum = {
  LTR: 'ltr',
  RTL: 'rtl',
} as const;

export const AGG_METHOD_LIST = [
  { key: 'AVG', name: 'AVG' },
  { key: 'SUM', name: 'SUM' },
  { key: 'LAST', name: 'LAST' },
] as const;

/** 趋势图数据源：总趋势走 samples tendency，Trace 数据走 bar */
export const TrendSourceEnum = {
  ALL: 'all',
  TRACE: 'trace',
} as const;

export const PROFILING_FAVORITE_TYPE = 'profiling';

export const PROFILING_DEFAULT_APP_KEY = 'PROFILING_EXPLORE_DEFAULT_APPLICATION';
export const PROFILING_THUMBTACK_KEY = 'profiling_explore_application_thumbtack';
export const PROFILING_RESIDENT_KEY = 'profiling_explore_resident_setting';

/** 应用服务检索只开放等值，与后端 filter_labels 契约对齐 */
export const EQ_METHOD: IFilterField['methods'] = [
  {
    alias: '=',
    value: EMethod.eq,
  },
];
