import { getJsonFile, getTypeConfig } from './utils';
import Promise from 'bluebird';
import path from 'path';
import { getPackage } from './get-package';

export async function getPackages(directory, type, options) {
  const typeConfig = getTypeConfig(type);
  const bowerFile = await getJsonFile(path.resolve(directory, typeConfig.file));
  const bowerConfig = await getJsonFile(path.resolve(directory, typeConfig.config));
  const bowerDirectory = bowerConfig && bowerConfig.directory
    ? bowerConfig.directory
    : typeConfig.directory;
  const dependencies = bowerFile && bowerFile.dependencies
    ? Object.keys(bowerFile.dependencies)
    : [];
  const bowerPackages = await Promise.all(dependencies
    .map(x => path.resolve(directory, bowerDirectory, x))
    .map(x => getPackage(x, type, options)));

  return bowerPackages;
}
