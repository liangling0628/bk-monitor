import { ref } from 'vue';

const cacheDirMap = ref<{[key: string]: string} | null>(null);
const modules = ref<Record<string, () => Promise<any>> | null>(null);
/**
 * 获取svg文件和所在目录的映射表
 * @returns svg文件和所在目录的映射表
 */
export default function useIconDirMapHook() {
  function importGlobModules() {
    modules.value = import.meta.glob('../../static/svg/**/*.svg');
    // 格式转化 '../../static/svg/xxxx.svg' ----> xxxx  '../../static/svg/a/b/xxxx.svg'  -----> a-b-xxxx
    const keys = Object.keys(modules.value).map(item => [item.split('.svg')[0].split('/svg/')[1].replace(/\//g, '-'), item]);
    cacheDirMap.value = Object.fromEntries(keys);
  }

  return {
    cacheDirMap,
    modules,
    importGlobModules,
  };
};
