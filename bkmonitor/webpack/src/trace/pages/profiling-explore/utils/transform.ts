import { ECondition, EMethod } from '../../../components/retrieval-filter/typing';

import type { IFilterField, IWhereItem } from '../../../components/retrieval-filter/typing';
import type { IProfilingQueryParams } from '../typings';
import { EQ_METHOD } from '../constants';

export function requestErrorIsAborted(err: unknown): boolean {
  const message = (err as Error)?.message;
  return message === 'canceled' || message === 'aborted' || (err as Error)?.name === 'AbortError';
}

/** UI 条件转后端 filter_labels。本期只认 eq。 */
export function mergeWhere(...groups: Array<IWhereItem[] | undefined>): IWhereItem[] {
  return groups.flatMap(group => group || []);
}

export function whereToFilterLabels(where: IWhereItem[] = []): Record<string, string | string[]> {
  return where.reduce<Record<string, string | string[]>>((acc, item) => {
    if (!item?.key || !item.value?.length) return acc;
    const method = item.method || item.operator;
    if (method && method !== EMethod.eq && method !== 'eq' && method !== 'equal') return acc;
    acc[item.key] = item.value.length === 1 ? String(item.value[0]) : item.value.map(String);
    return acc;
  }, {});
}

export function labelsToFilterFields(labelKeys: string[]): IFilterField[] {
  return (labelKeys || []).map(key => ({
    name: key,
    alias: key,
    type: 'keyword',
    isEnableOptions: true,
    methods: EQ_METHOD,
  })) as IFilterField[];
}

export function emptyWhere(): IWhereItem[] {
  return [];
}

export function createEqWhere(key: string, value: string): IWhereItem {
  return {
    key,
    method: EMethod.eq,
    condition: ECondition.and,
    value: [value],
  };
}

export function toMicroseconds(seconds: number): number {
  return Math.floor(seconds) * 10 ** 6;
}

export function buildDiagramTypes(mode: 'combine' | 'flame' | 'table' | 'topo'): string[] {
  if (mode === 'combine') return ['table', 'flamegraph'];
  if (mode === 'flame') return ['flamegraph'];
  if (mode === 'topo') return ['callgraph'];
  return ['table'];
}

export function pickQueryBody(params: IProfilingQueryParams): IProfilingQueryParams {
  return { ...params };
}
