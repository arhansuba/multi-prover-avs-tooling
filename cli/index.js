#!/usr/bin/env node

const { program } = require('commander');
const initCommand = require('./commands/init');
const deployCommand = require('./commands/deploy');
const monitorCommand = require('./commands/monitor');

program.version('1.0.0');

program
    .command('init')
    .description('Initialize the TEE environment')
    .action(() => {
        initCommand();
    });

program
    .command('deploy')
    .description('Deploy Multi-Prover AVS contract')
    .action(() => {
        deployCommand();
    });

program
    .command('monitor')
    .description('Monitor TEE and contract status')
    .action(() => {
        monitorCommand();
    });

program.parse(process.argv);
