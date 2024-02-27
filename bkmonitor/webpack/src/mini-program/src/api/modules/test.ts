import { request } from '../request';

export const listMetaEsClusterInfo = request('GET', 'apm/meta/meta_info/list_es_cluster_info/');
export const metaConfigInfo = request('GET', 'apm/meta/meta_info/meta_config_info/');
