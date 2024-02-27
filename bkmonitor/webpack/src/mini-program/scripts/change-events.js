const fs = require('fs').promises; // 导入fs模块的Promise API，使用async/await语法进行异步操作
const path = require('path');
const vantComponentUrl = path.resolve(__dirname, '../node_modules/@vant/weapp/lib');
/**
 * 递归获取指定目录下的所有 wxml 文件路径
 * @param {string} dirPath - 指定目录路径
 * @returns {Promise<string[]>} - 返回 wxml 文件路径数组
 */
async function findWxmlFiles(dirPath) {
  let fileList = [];

  // 读取当前目录下所有文件
  const files = await fs.readdir(dirPath, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(dirPath, file.name);

    if (file.isFile()) {
      // 如果是文件且后缀为 wxml，则将该文件路径添加到数组中
      if (path.extname(filePath) === '.wxml') {
        fileList.push(filePath);
      }
      // else if (filePath.includes('common/component.js')) {
      //   const chunk = await fs.readFile(filePath, 'utf-8');
      //   if (!chunk.match(/options\.properties\.value\.observer/gmi)) {
      //     await fs.writeFile(filePath, chunk.replace('Component(options);', `
      //     // 用于处理被 uni-app 去除的value observer
      //     if (options.properties && options.properties.value && options.properties.value.observer) {
      //         if (!options.observers) {
      //             options.observers = {};
      //         }
      //         const name = options.properties.value.observer;
      //         if (!options.observers.value) {
      //             options.observers['value'] = typeof name === 'string' ? options.methods[name] : name;
      //         } else {
      //             options.observers.value = typeof name === 'string' ? options.methods[name] : name;
      //         }
      //     }
      //     Component(options);
      //     `));
      //   }
      // }
    } else if (file.isDirectory()) {
      // 如果是目录，则递归调用该函数获取子目录下的所有 wxml 文件路径，并将其添加到数组中
      const subFiles = await findWxmlFiles(filePath);
      fileList = fileList.concat(subFiles);
    }
  }

  return fileList;
}

/**
 * 将指定目录下的所有 wxml 文件中的 bind: 字符串替换为 on:
 * @param {string} dirPath - 指定目录路径
 * @returns {Promise<void>}
 */
async function replaceBindToOnInWxmlFiles(dirPath) {
  // 获取指定目录下的所有 wxml 文件路径
  const wxmlFiles = await findWxmlFiles(dirPath);

  for (const filePath of wxmlFiles) {
    // 读取文件内容并替换 bind: 为 on:
    const data = await fs.readFile(filePath, 'utf8');
    const newData = data.replace(/bind:(\w+)(-\w{1,1})/g, (all, r1, r2) => `bind:${r1}${r2.replace('-', '').charAt(0)
      .toLocaleUpperCase()}`);

    // 将修改后的文件内容写回文件
    await fs.writeFile(filePath, newData);
  }
}

replaceBindToOnInWxmlFiles(vantComponentUrl)
  .then(() => console.log('is changed wx bind event to upper event name'))
  .catch(error => console.error(error));
