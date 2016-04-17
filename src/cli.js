import program from 'commander';
import pkg from '../package.json';
import { licenseCollector } from './license-collector';

program
  .version(pkg.version)
  .usage('<directory ...> [options]')
  .option('-o, --output [value]', 'Outputfile, use .json or .yml.')
  .parse(process.argv);

if (!program.args.length) {
  program.outputHelp();
  process.exit();
}

console.log('dasdas',program.output);

licenseCollector(program.args[0], { verbose: true, output: program.output }).then(
  () => {

  },

  console.warn
);
