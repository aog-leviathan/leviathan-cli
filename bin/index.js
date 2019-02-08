#!/usr/bin/env node

const init = require('../lib/init');
const deploy = require('../lib/deploy');

const program = require('commander');

// we'll probably add more commands, like options for deploying
// fulfillment alone vs NLU vs NLU & fulfillment

program
  .command('help') // sub-command name
  .alias('h') // alternative sub-command is `h`
  .description('ask for help') // command description
  .action(function () {
    console.log('-- help --');
  });


program
  .command('init') // sub-command name
  .alias('i') // alternative sub-command is `o`
  .description('creates the default configuration file') // command description
  .action(function () {
    init();
  });

program
  .command('deploy')
  .alias('d')
  .description('deploy!')
  .action(() => {
    deploy();
  });

// allow commander to parse `process.argv`
program.parse(process.argv);
