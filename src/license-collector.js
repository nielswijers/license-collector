import { getPackages } from './get-packages';
import { getYamlFile, setFile, stringify } from './utils';
import Promise from 'bluebird';
import path from 'path';

const defaults = {
  customLicensesFile: 'custom-licenses.yml',
  licensePatterns: ['*license*'],
  ignoreBower: false,
  ignoreNpm: false,
  verbose: false,
};

export const licenseCollector = async(directory, options = {}) => {
  const settings = {
    customLicensesFile: options.customLicensesFile || defaults.customLicensesFile,
    licensePatterns: options.licensePatterns || defaults.licensePatterns,
    ignoreBower: options.ignoreBower || defaults.ignoreBower,
    ignoreNpm: options.ignoreNpm || defaults.ignoreNpm,
    verbose: options.verbose || defaults.verbose,
    output: options.output,
  };

  const customLicenses = await getYamlFile(`${directory}/${settings.customLicensesFile}`);
  const packages = await Promise.all([
    !settings.ignoreNpm ? getPackages(directory, 'npm', settings) : [],
    !settings.ignoreBower ? getPackages(directory, 'bower', settings) : [],
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

  console.log(settings.output);

  if (!!settings.output) {
    const type = path.extname(settings.output);
    await setFile(`${directory}/${settings.output}`, stringify(packages, type));
  }

  return packages;
};
