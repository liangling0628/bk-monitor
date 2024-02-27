const fs = require('fs').promises; // 导入fs模块的Promise API，使用async/await语法进行异步操作
const path = require('path');
const mpWxUrl = path.resolve(__dirname, '../node_modules/@dcloudio/uni-mp-weixin/dist/uni.mp.esm.js');

async function fixUniAppMp() {
  const chunk = await fs.readFile(mpWxUrl, 'utf-8');
  if (!chunk.match(/!options\.properties\.name/gmi)) {
    await fs.writeFile(mpWxUrl, chunk
      .replace(/properties\.name\s+=\s+{[^}]+}/gm, ` if(!options.properties || !options.properties.name) {
  properties.name = {
      type: null,
      value: '',
  };
}`)
      .replace(/properties\.value\s+=\s+{[^}]+}/gm, ` if(!options.properties || !options.properties.value) {
properties.value = {
    type: null,
    value: '',
};
}`));
  }
}
fixUniAppMp()
  .then(() => console.log('fix uni-app sucess'))
  .catch(e => console.log('fix uni-app error', e.message));
