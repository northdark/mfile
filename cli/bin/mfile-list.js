#!/usr/bin/env node

let program = require('commander');
let chalk = require('chalk');
let inquirer = require('inquirer');
let path = require('path');
let fs = require('fs');
let request = require('request');

let log = require('../src/log');
let utils = require('../src/utils');

/**
 * Usage.
 */

program
    .usage('[remote-file-path]');

program.on('--help', function () {
    log.tips('  Examples:');
    log.tips();
    log.tips(chalk.gray('    # List the remote directory and file'));
    log.tips('    $ mfile list ./ ');
    log.tips();
});


function help() {
    program.parse(process.argv);
    if (program.args.length < 1) {
        return program.help();
    }
}

help();


/**
 * Padding.
 */

log.tips();
process.on('exit', () => log.tips());

let remotePath = program.args[0];

runTask();

function runTask() {
    //http://10.32.171.169:8410/upload
    //http://127.0.0.1:8410/upload
    request.post(utils.getAuthInfo('http://10.32.171.169:8410/list', {
            body: JSON.stringify({path: remotePath}, null, 0)
        }, {
            'Content-type': 'application/json'
        }),
        function optionalCallback(err, httpResponse, body) {
            if (err) {
                return console.error('upload failed:', err);
            }
            console.log(body);
        }
    );
}
