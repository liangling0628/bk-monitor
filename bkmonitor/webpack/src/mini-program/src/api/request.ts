import { useAppStore } from '../store/app';
const BASE_URL = 'https://bkm-stag.woa.com/rest/v2';
const COMMON_HEADER = {};
const defaultConfig = {
  needRes: false,
  needMessage: true,
};
export const request = (
  method: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT',
  url: string,
) => (params: Record<string, any>, config: typeof defaultConfig = defaultConfig) => new Promise((resolve, reject) => {
  let newParams = params;
  if (!('bk_biz_id' in params)) {
    newParams = {
      ...params,
      bk_biz_id: useAppStore().bizName,
    };
  }
  uni.request({
    url: BASE_URL + url,
    method: method || 'GET',
    data: newParams,
    header: COMMON_HEADER,
    success: (res) => {
      if (config.needRes) return resolve(res);
      resolve(res.data);
    },
    fail: (err) => {
      if (config.needMessage) {
        uni.showToast({ title: err.errMsg, mask: true, icon: 'error'  });
      }
      reject(err);
    },
  });
});
