/**
 * Created by ximing on 2/26/18.
 */
'use strict';
const chokidar = require('chokidar');
var process = require('child_process');
const config = require('./lib/config');
const watcher = chokidar.watch(config.getLocalPath(), {
    persistent: true,
    ignoreInitial: false,
    followSymlinks: true,
    disableGlobbing: false,
    usePolling: true,
    interval: 100,
    binaryInterval: 300,
    alwaysStat: false,
    depth: 99,
    awaitWriteFinish: {
        stabilityThreshold: 2000,
        pollInterval: 100
    },
    ignorePermissionErrors: false,
    atomic: true
});
watcher.on('change', (path, stats) => {
    if (stats) {
        process.exec(`rsync -av ${config.getLocalPath()} --progress ${config.getRsyncUser()}@${config.getRsyncIp()}:${config.getLocalPath()}`, function (error, stdout, stderr) {
            if (error !== null) {
                console.log('exec error: ' + error);
            }
            console.log(stdout);
        });
    }
});
