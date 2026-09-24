import { listApplicationServices, queryServicesDetail } from 'monitor-api/modules/apm_profile';

import { requestErrorIsAborted } from '../utils/transform';

import type { IProfilingApplicationList, IProfilingServiceDetail } from '../typings';

const SILENT = { needMessage: false };

export async function fetchApplicationServices(params: { end_time: number; start_time: number }): Promise<{
  data: IProfilingApplicationList;
  isAborted: boolean;
}> {
  try {
    const data = await listApplicationServices(params, SILENT);
    return {
      data: {
        normal: data?.normal || [],
        no_data: data?.no_data || [],
      },
      isAborted: false,
    };
  } catch (err) {
    if (requestErrorIsAborted(err)) return { data: { normal: [], no_data: [] }, isAborted: true };
    return { data: { normal: [], no_data: [] }, isAborted: false };
  }
}

export async function fetchServiceDetail(params: {
  app_name: string;
  end_time: number;
  service_name: string;
  start_time: number;
}): Promise<{ data: IProfilingServiceDetail | null; isAborted: boolean }> {
  try {
    const data = await queryServicesDetail(params, SILENT);
    return { data: data || null, isAborted: false };
  } catch (err) {
    if (requestErrorIsAborted(err)) return { data: null, isAborted: true };
    return { data: null, isAborted: false };
  }
}
