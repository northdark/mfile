/**
 * Created by ximing on 2/26/18.
 */
'use strict';
const chokidar = require('chokidar');
var process = require('child_process');
const config = require('./lib/config');
const watcher = chokidar.watch(config.getLocalPath(), {
    persistent: true
});
watcher.on('change', (path, stats) => {
    let remotePath = config.getLocalPath();
    remotePath = remotePath.split('/');
    remotePath = remotePath.slice(0, path.length - 1).join('/');
    console.log('sync file to ', path, remotePath)
    if (stats) {
        process.exec(`rsync -av ${config.getLocalPath()} -e 'ssh -p ${config.getSSHPort()}' --progress ${config.getRsyncUser()}@${config.getRsyncIp()}:${remotePath}`, function (error, stdout, stderr) {
            if (error !== null) {
                console.log('exec error: ' + error);
            }
            console.log(stdout);
        });
    }
});
