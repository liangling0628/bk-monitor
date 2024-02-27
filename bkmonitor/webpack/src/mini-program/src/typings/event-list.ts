import { $t } from '../i18n';
import { TimeOptionsType } from '../components/time-select/typings';
import { ITypeFilterItem } from '../components/type-filter/typings';
export interface ICommonItem {
  name: string;
  id: string
}

export const TIME_LIST: TimeOptionsType[] = [
  {
    label: $t('近5分钟'),
    value: '5m',
  },
  {
    label: $t('近15分钟'),
    value: '15m',
  },
  {
    label: $t('近30分钟'),
    value: '30m',
  },
  {
    label: $t('近1小时'),
    value: '1h',
  },
  {
    label: $t('近3小时'),
    value: '3h',
  },
  {
    label: $t('近6小时'),
    value: '6h',
  },
  {
    label: $t('近12小时'),
    value: '12h',
  },
  {
    label: $t('近1天'),
    value: '1d',
  },
  {
    label: $t('近2天'),
    value: '2d',
  },
  {
    label: $t('近7天'),
    value: '7d',
  },
  {
    label: $t('近30天'),
    value: '30d',
  },
  {
    label: $t('今天'),
    value: 'today',
  },
  {
    label: $t('昨天'),
    value: 'yesterday',
  },
  {
    label: $t('前天'),
    value: 'beforeYesterday',
  },
  {
    label: $t('本周'),
    value: 'thisWeek',
  },
];


export const ALARM_TYPE_LIST: ITypeFilterItem[] = [
  {
    name: $t('致命'),
    value: 0,
    background: '#FDE8E7',
    // icon: 'warn-o',
    iconColor: '#EA3636',
    svg: 'emergency',
  },
  {
    name: $t('预警'),
    value: 1,
    background: '#FCEFD9',
    icon: 'warning',
    iconColor: '#FF9C01',
  },
  {
    name: $t('提醒'),
    value: 2,
    background: '#EDF4FF',
    icon: 'info',
    iconColor: '#3A84FF',
  },
];
