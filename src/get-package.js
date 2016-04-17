import path from 'path';
import { getJsonFile, getFile, glob, getTypeConfig } from './utils';

export async function getPackage(directory, type, options) {
  const typeConfig = getTypeConfig(type);
  const bowerFile = await getJsonFile(path.resolve(directory, typeConfig.depFile));

  const potentialLicenses = await glob([].concat(options.licensePatterns), {
    nocase: true,
    cwd: directory,
  });

  const licenseText = potentialLicenses.length
    ? await getFile(path.resolve(directory, potentialLicenses[0]))
    : undefined;

  if (!bowerFile) {
    return {};
  }

  return {
    name: bowerFile.name,
    version: bowerFile.version,
    licenseText,
    type,
  };
}
