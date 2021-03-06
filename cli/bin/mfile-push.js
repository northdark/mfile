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
    .usage('<file-path> [remote-file-path]');

program.on('--help', function () {
    log.tips('  Examples:');
    log.tips();
    log.tips(chalk.gray('    # push a file to remote server'));
    log.tips('    $ mfile push ./test.js test/dir/test.js');
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

let localPath = program.args[0];
let remotePath = program.args[1];

runTask();

function runTask() {
    let formData = {
        localPath: localPath,
    };
    if (remotePath) {
        formData.remotePath = remotePath;
    }
    formData.file = fs.createReadStream(localPath);
    //http://10.32.171.169:8410/upload
    //http://127.0.0.1:8410/upload
    request.post(utils.getAuthInfo('http://10.32.171.169:8410/upload', {formData}),
        function optionalCallback(err, httpResponse, body) {
            if (err) {
                return console.error('upload failed:', err);
            }
            console.log('Upload successful!');
            console.log(body);
        }
    );
}
