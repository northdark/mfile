/**
 * Created by pomy on 16/01/2017.
 * some utils function
 */

'use strict';

let fs = require('fs');
let path = require('path');
let exec = require('child_process').execSync;

let log = require('./log');

module.exports = {
    isExist(tplPath) {
        let p = path.normalize(tplPath);
        try {
            fs.accessSync(p, fs.R_OK & fs.W_OK, (err) => {
                if (err) {
                    log.tips();
                    log.error(`Permission Denied to access ${p}`);
                }
            });
            return true;
        } catch (e) {
            return false;
        }
    },

    isLocalTemplate(tpl) {
        let isLocal = tpl.startsWith('.') || tpl.startsWith('/') || /^\w:/.test(tpl);

        if (isLocal) {
            return isLocal;
        } else {
            return this.isExist(path.normalize(path.join(process.cwd(), tpl)));
        }
    },

    mfileBinPath() {
        try {
            let binPath = exec('which mfile');
            return binPath.toString();
        } catch (e) {
            log.error(`exec which mfile error: ${e.message}`);
        }
    },

    getAuthInfo(url, formData, otherHeader) {
        let config = {
            url: url,
            method: 'post',
            headers: {
                'User-Agent': 'mfile-cli'
            },
            timeout: 10000,
            auth: {},
            formData
        };

        let binPath = this.mfileBinPath();
        let tokenPath = path.normalize(path.join(binPath, '../../', 'lib/node_modules/mfile-cli/src/token.json'));

        if (this.isExist(tokenPath)) {
            let authInfo = require(tokenPath);
            config.auth = authInfo;
        } else {
            delete config['auth'];
        }
        if (otherHeader) {
            config.headers = Object.assign({}, config.headers, otherHeader)
        }
        return config;
    }
};
