const fs = require('fs');
const path = require('path');
const vantUrl = path.resolve(__dirname, '../node_modules/@vant/weapp/lib');
const wxcomponentsUrl = path.resolve(__dirname, '../src/wxcomponents');
const wxComponentVanUrl = path.resolve(__dirname, '../src/wxcomponents/vant');
console.info(wxcomponentsUrl);
console.info(wxComponentVanUrl);
console.info(fs.existsSync(wxcomponentsUrl), fs.existsSync(wxComponentVanUrl));
if (!fs.existsSync(wxcomponentsUrl)) {
  fs.mkdirSync(wxcomponentsUrl);
  fs.symlinkSync(vantUrl, wxComponentVanUrl, 'dir');
} else if (!fs.existsSync(wxComponentVanUrl)) {
  fs.symlinkSync(vantUrl, wxComponentVanUrl, 'dir');
}
