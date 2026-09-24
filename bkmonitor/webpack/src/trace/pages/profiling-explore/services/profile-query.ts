import { CancelToken } from 'monitor-api/cancel';
import { query, queryProfileBarGraph } from 'monitor-api/modules/apm_profile';

import { requestErrorIsAborted } from '../utils/transform';

import type { IProfilingQueryParams } from '../typings';

const SILENT = { needMessage: false };

export async function fetchTrendSeries(
  params: IProfilingQueryParams,
  source: 'all' | 'trace',
  cancel?: (c: () => void) => void
): Promise<{ data: unknown; isAborted: boolean }> {
  const config = {
    ...SILENT,
    ...(cancel ? { cancelToken: new CancelToken(cancel) } : {}),
  };
  try {
    const data =
      source === 'all'
        ? await query({ ...params, diagram_types: ['tendency'] }, config)
        : await queryProfileBarGraph(params, config);
    return { data, isAborted: false };
  } catch (err) {
    if (requestErrorIsAborted(err)) return { data: null, isAborted: true };
    return { data: null, isAborted: false };
  }
}

export async function fetchProfileSamples(
  params: IProfilingQueryParams,
  cancel?: (c: () => void) => void
): Promise<{ data: Record<string, unknown> | null; isAborted: boolean }> {
  try {
    const data = await query(params, {
      ...SILENT,
      ...(cancel ? { cancelToken: new CancelToken(cancel) } : {}),
    });
    return { data: data || null, isAborted: false };
  } catch (err) {
    if (requestErrorIsAborted(err)) return { data: null, isAborted: true };
    return { data: null, isAborted: false };
  }
}

export function buildExportUrl(params: Record<string, unknown>): string {
  const queryString = Object.keys(params)
    .reduce<string[]>((acc, key) => {
      const value = params[key];
      if (value === undefined || value === null || value === '') return acc;
      const encoded = encodeURIComponent(typeof value === 'object' ? JSON.stringify(value) : String(value));
      acc.push(`${encodeURIComponent(key)}=${encoded}`);
      return acc;
    }, [])
    .join('&');
  return `/apm/profile_api/query/export/?bk_biz_id=${window.bk_biz_id}${queryString ? `&${queryString}` : ''}`;
}
