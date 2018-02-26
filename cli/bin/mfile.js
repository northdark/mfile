#!/usr/bin/env node

let pkg = require('../package.json');
require('commander')
    .version(pkg.version)
    .usage('<command> [options]')
    .command('push', 'push a file to remote server')
    .command('list', 'list files from remote server')
    .command('token', 'set auth token to access remote server')
    .parse(process.argv)
