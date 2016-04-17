import Promise from 'bluebird';
import jsonfile from 'jsonfile';
import yaml from 'js-yaml';
import fs from 'fs';

export const getFile = file => Promise.promisify(fs.readFile)(file, 'utf8')
  .error(() => undefined);
export const setFile = (file, text) =>
  Promise.promisify(fs.writeFile)(file, text, 'utf8')
    .error(() => undefined);
export const getJsonFile = file =>
  Promise.promisify(jsonfile.readFile)(file)
    .error(() => undefined);
export const getYamlFile = file => getFile(file).then(yaml.load);
export const glob = Promise.promisify(require('glob-all'));
export const getTypeConfig = (type) => {
  if (type === 'bower') {
    return {
      file: 'bower.json',
      depFile: '.bower.json',
      config: '.bowerrc',
      directory: 'bower_components',
    };
  }

  return {
    file: 'package.json',
    depFile: 'package.json',
    config: '.npmrc',
    directory: 'node_modules',
  };
};

export const stringify = (obj, type) => {
  if (type === '.json') {
    return JSON.stringify(obj);
  }

  return yaml.dump(obj);
};
