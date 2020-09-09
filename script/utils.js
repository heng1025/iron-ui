const fs = require('fs');
const path = require('path');
const less = require('less');
const NpmImportPlugin = require('less-plugin-npm-import');

const { readFileSync } = fs;

function getProjectPath(...filePath) {
  return path.join(process.cwd(), ...filePath);
}

function transformLess(lessFile, config = {}) {
  const { cwd = process.cwd() } = config;
  const resolvedLessFile = path.resolve(cwd, lessFile);

  let data = readFileSync(resolvedLessFile, 'utf-8');
  data = data.replace(/^\uFEFF/, '');

  // Do less compile
  const lessOpts = {
    paths: [path.dirname(resolvedLessFile)],
    filename: resolvedLessFile,
    plugins: [new NpmImportPlugin({ prefix: '~' })],
    javascriptEnabled: true,
  };
  return less.render(data, lessOpts).then((r) => r.css);
}

module.exports = {
  getProjectPath,
  transformLess,
};
