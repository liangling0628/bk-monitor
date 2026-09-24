import type { EMode, IWhereItem } from '../../../components/retrieval-filter/typing';
import type { TimeRangeType } from '../../../components/time-range/utils';
import type {
  ProfileViewModeEnum,
  ProfilingTabEnum,
  TextDirectionEnum,
  TrendSourceEnum,
} from '../constants';

export type ProfilingTabType = (typeof ProfilingTabEnum)[keyof typeof ProfilingTabEnum];
export type ProfileViewModeType = (typeof ProfileViewModeEnum)[keyof typeof ProfileViewModeEnum];
export type TextDirectionType = (typeof TextDirectionEnum)[keyof typeof TextDirectionEnum];
export type TrendSourceType = (typeof TrendSourceEnum)[keyof typeof TrendSourceEnum];

export interface IProfilingServiceItem {
  has_data: boolean;
  id?: number;
  name: string;
}

/** listApplicationServices 单条应用 */
export interface IProfilingApplication {
  app_alias: string;
  app_name: string;
  application_id?: number;
  bk_biz_id?: number;
  description?: string;
  isTop?: boolean;
  services: IProfilingServiceItem[];
}

export interface IProfilingApplicationList {
  no_data: IProfilingApplication[];
  normal: IProfilingApplication[];
}

export interface IProfilingDataType {
  default_agg_method?: string;
  key: string;
  name: string;
}

/** queryServicesDetail 应用服务详情 */
export interface IProfilingServiceDetail {
  app_name: string;
  create_time: string;
  data_types: IProfilingDataType[];
  last_report_time: string;
  name: string;
  period?: string;
  period_type?: string;
}

export interface IProfilingQueryParams {
  agg_method?: string;
  app_name?: string;
  data_type?: string;
  diagram_types?: string[];
  diff_filter_labels?: Record<string, number | string | string[]>;
  end?: number;
  filter_labels?: Record<string, number | string | string[]>;
  global_query?: boolean;
  is_compared?: boolean;
  service_name?: string;
  start?: number;
}

export interface IDateComparison {
  diffEnd?: number;
  diffStart?: number;
  end?: number;
  start?: number;
}

export interface ITrendSeriesItem {
  alias?: string;
  datapoints?: [number, number][];
  unit?: string;
}

export interface IProfilingFavoriteConfig {
  bk_biz_id: number;
  componentData: {
    aggMethod: string;
    commonWhere: IWhereItem[];
    comparisonCommonWhere: IWhereItem[];
    comparisonWhere: IWhereItem[];
    dataType: string;
    dateCompared: boolean;
    filterMode: EMode;
    isCompared: boolean;
    refreshInterval: number;
    serviceName: string;
    tab: ProfilingTabType;
    timeRange: TimeRangeType;
  };
  queryParams: {
    app_name: string;
    end_time: number;
    filters: IWhereItem[];
    service_name: string;
    start_time: number;
  };
}
