const fs = require('fs');
const path = require('path');
const vantUrl = path.resolve(__dirname, '../node_modules/vant/es');
const vantVarUrl = path.resolve(__dirname, '../src/styles/variables/h5-var.scss');
const vantRootVarUrl = path.resolve(__dirname, '../node_modules/vant/es/style/css-variables.css');
let chunk = fs.readFileSync(vantRootVarUrl, { encoding: 'utf-8' });
chunk = chunk.replace(/;/gmi, ';\n').replace(':root{', ':root {\n')
  .replace('}', '');
fs.writeFileSync(vantVarUrl, `${chunk};\n`);
const dirList = fs.readdirSync(vantUrl, { encoding: 'utf-8' });
dirList.forEach((url) => {
  const lessUrl = path.resolve(vantUrl, url, './index.css');
  if (fs.existsSync(lessUrl)) {
    const chunk = fs.readFileSync(lessUrl, { encoding: 'utf-8' });
    const data = chunk.match(/:root[^{]*{([^}]+)}/gmi);
    if (data?.length) {
      const varData = data[0].replace(/:root[^{]*{/gmi, '').replace('}', '')
        .replace(/;/gmi, ';\n');
      varData && fs.appendFileSync(vantVarUrl, `\n${varData};\n`, { encoding: 'utf-8' });
    }
  }
});
fs.appendFileSync(vantVarUrl, '\n}');
