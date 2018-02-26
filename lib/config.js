/**
 * Created by ximing on 2/26/18.
 */
'use strict';
const config = require('../config');
module.exports = {
    getConfig: function () {
        return config[this.getEnvironment()];
    },
    getEnvironment: function () {
        return process.env.NODE_ENV || 'development';
    },
    getLocalPath: function () {
        return config[this.getEnvironment()]['localPath']
    },
    getPort: function () {
        return config[this.getEnvironment()]['port']
    },
    getAuth: function () {
        return config[this.getEnvironment()]['auth']
    },
    getRsyncIp: function () {
        return config[this.getEnvironment()]['rsyncIp']
    },
    getRsyncUser: function () {
        return config[this.getEnvironment()]['rsyncUser']
    },
    getSSHPort: function () {
        return config[this.getEnvironment()]['sshPort']
    }
};
