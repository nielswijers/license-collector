# [license-collector](https://github.com/nielswijers/license-collector)

[![NPM version](http://img.shields.io/npm/v/license-collector.svg?style=flat-square)](https://www.npmjs.com/package/license-collector)
[![NPM downloads](http://img.shields.io/npm/dm/license-collector.svg?style=flat-square)](https://www.npmjs.com/package/license-collector)
[![Build Status](http://img.shields.io/travis/nielswijers/license-collector/master.svg?style=flat-square)](https://travis-ci.org/nielswijers/license-collector)
[![Coverage Status](https://img.shields.io/coveralls/nielswijers/license-collector.svg?style=flat-square)](https://coveralls.io/nielswijers/license-collector)
[![Dependency Status](http://img.shields.io/david/nielswijers/license-collector.svg?style=flat-square)](https://david-dm.org/nielswijers/license-collector)

> a license collector for npm and bower dependencies

### How to Install

```sh
$ npm install license-collector -g
```

### Getting Started
You can use the license collector in the cli or in code.

## CLI
```sh
Usage: license-collector <directory ...> [options]

Options:

  -h, --help              output usage information
  -V, --version           output the version number
  -o, --output [value]    Outputfile, use .json or .yml.
  -n, --no_npm            Ignore npm packages
  -b, --no_bower          Ignore bower packages
  -p, --patterns [value]  comma separated list of possibible license files. fg. "*license*,*readme*"
```

## Javascript

```javascript
var licenseCollector = require('license-collector').licenseCollector
licenseCollector(__dirname, {
    ignoreNpm: true,
    output: 'licenses.json',
    verbose: true,
    licensePatterns: ['*license*', '*readme*']
}).then(function (result) {
    done()
}, console.log)
```

## Gulp

```javascript
var licenseCollector = require('license-collector').licenseCollector
gulp.task('licenses', function (done) {
    licenseCollector(__dirname, {
        ignoreNpm: true,
        output: 'licenses.json',
        verbose: true,
        licensePatterns: ['*license*', '*readme*']
    }).then(function (result) {
        done()
    }, console.log)
})
```

### How to Test

Run one, or a combination of the following commands to lint and test your code:

```sh
$ npm run lint          # Lint the source code with ESLint
$ npm test              # Run unit tests with Mocha
$ npm run test:watch    # Run unit tests with Mocha, and watch files for changes
$ npm run test:cover    # Run unit tests with code coverage by Istanbul
```

### License

MIT © 2016 niels wijers
