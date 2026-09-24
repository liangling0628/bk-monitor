import { queryLabelValues, queryLabels } from 'monitor-api/modules/apm_profile';

import { requestErrorIsAborted } from '../utils/transform';

const SILENT = { needMessage: false };

export async function fetchLabelKeys(params: Record<string, unknown>): Promise<{
  data: string[];
  isAborted: boolean;
}> {
  try {
    const data = await queryLabels(params, SILENT);
    return { data: data?.label_keys || [], isAborted: false };
  } catch (err) {
    if (requestErrorIsAborted(err)) return { data: [], isAborted: true };
    return { data: [], isAborted: false };
  }
}

export async function fetchLabelValues(params: Record<string, unknown>): Promise<{
  data: { id: string; name: string }[];
  isAborted: boolean;
}> {
  try {
    const data = await queryLabelValues(params, SILENT);
    const values: string[] = data?.label_values || data?.values || [];
    return {
      data: values.map(item => ({ id: String(item), name: String(item) })),
      isAborted: false,
    };
  } catch (err) {
    if (requestErrorIsAborted(err)) return { data: [], isAborted: true };
    return { data: [], isAborted: false };
  }
}
