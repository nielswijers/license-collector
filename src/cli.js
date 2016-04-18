import program from 'commander';
import pkg from '../package.json';
import { licenseCollector } from './license-collector';

program
  .version(pkg.version)
  .usage('<directory ...> [options]')
  .option('-o, --output [value]', 'Outputfile, use .json or .yml.')
  .option('-n, --no_npm', 'Ignore npm packages')
  .option('-b, --no_bower', 'Ignore bower packages')
  .option('-p, --patterns [value]', 'comma separated list of possibible license files. fg.' +
    ' "*license*,*readme*"')
  .parse(process.argv);

if (!program.args.length) {
  program.outputHelp();
  process.exit();
}

const patterns = program.patterns
  ? program.patterns.split(',')
  : undefined;

console.log(patterns);

licenseCollector(program.args[0], {
  verbose: true,
  output: program.output,
  licensePatterns: patterns,
  ignoreBower: program.no_bower,
  ignoreNpm: program.no_npm,
}).then(
  () => {

  },

  console.warn
);
