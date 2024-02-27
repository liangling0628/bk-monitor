const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');

const h5VarsUrl = resolve(__dirname, '../src/styles/variables/h5-var.scss');
const weVarsUrl = resolve(__dirname, '../src/styles/variables/van-weapp-var.scss');
const customVarsUrl = resolve(__dirname, '../src/styles/variables/custom-var.scss');

const h5Chunk = readFileSync(h5VarsUrl, { encoding: 'utf-8' });
const weChunk = readFileSync(weVarsUrl, { encoding: 'utf-8' });
const customChunk = readFileSync(customVarsUrl, { encoding: 'utf-8' });
const h5Vars = {};
const h5NoVanVars = {};
const weVars = {};
h5Chunk.replace(/(--[^:]+):\s+([^;]+);/gmi, (all, a, b) => {
  h5Vars[a] = b;
  h5NoVanVars[a.replace(/--van-/g, '--')] = b.replace(/--van-/g, '--');
  return all;
});
weChunk.replace(/(--[^:]+):\s+([^;]+);/gmi, (all, a, b) => {
  weVars[a] = b;
  return all;
});
customChunk.replace(/(--[^:]+):\s+([^;]+);/gmi, (all, a, b) => {
  h5Vars[a] = b;
  h5NoVanVars[a.replace(/--van-/g, '--')] = b.replace(/--van-/g, '--');
  return all;
});
let h5NoVanVarsString = '';
Object.keys(weVars).forEach((key) => {
  if (!h5NoVanVars[key]) {
    h5NoVanVarsString += `  ${key}: ${weVars[key]};\n`;
  }
});
let weString = 'page {\n';
Object.keys(h5NoVanVars).forEach((key) => {
  weString += ` ${key}: ${h5NoVanVars[key]};\n`;
});
weString += '/* not in h5 vars special */\n';
weString += h5NoVanVarsString;
weString += '}';
writeFileSync(weVarsUrl.replace('van-weapp-var.scss', 'weapp-var.scss'), weString);
let h5String = 'body {\n';
Object.keys(h5Vars).forEach((key) => {
  h5String += ` ${key}: ${h5Vars[key]};\n`;
});
h5String += '}';
writeFileSync(h5VarsUrl, h5String);

