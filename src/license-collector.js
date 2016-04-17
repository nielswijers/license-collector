import { getPackages } from './get-packages';
import { getYamlFile, setFile, stringify } from './utils';
import Promise from 'bluebird';
import path from 'path';

const defaults = {
  customLicensesFile: 'custom-licenses.yml',
  licensePatterns: ['*license*'],
};

export const licenseCollector = async(directory, options) => {
  const settings = {
    ...defaults,
    ...options,
  };

  const customLicenses = await getYamlFile(`${directory}/${settings.customLicensesFile}`);
  const packages = await Promise.all([
    getPackages(directory, 'npm', settings),
    getPackages(directory, 'bower', settings),
  ]).reduce((arr = [], x) => arr.concat(x))
    .map(x => ({
      ...x,
      licenseText: (x.licenseText || customLicenses[x.name]),
    }));
  const missingLicenses = packages.filter(x => !x.licenseText);

  if (missingLicenses.length && settings.verbose) {
    console.warn('\nMissing licenses for the following packages:\n');
    console.warn(missingLicenses
      .map(x => `(${x.type}) ${x.version} - ${x.name}`).join('\n'));
  }

  if (!!settings.output) {
    const type = path.extname(settings.output);
    await setFile(`${directory}/${settings.output}`, stringify(packages, type));
  }

  return packages;
};
