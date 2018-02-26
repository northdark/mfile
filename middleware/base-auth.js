/**
 * Created by ximing on 2/26/18.
 */
'use strict';
const config = require('../lib/config');

module.exports = function (pathIgnore, pathIgnoreReg) {
    const inIgnorePathFn = function (path) {
        for (let item in pathIgnore) {
            if (pathIgnore[item] === path) {
                return true;
            }
        }
        for (let item in pathIgnoreReg) {
            if (pathIgnoreReg[item].test(path)) {
                return true;
            }
        }
        return false;
    };
    return async function (ctx, next) {
        ctx._rid = `[${ctx.path}]-${Math.random().toString(36).substr(2)}`;
        let requestpath = ctx.request.path;
        if (inIgnorePathFn(requestpath)) {
            await next();
        } else {
            try {
                let auth = ctx.req.headers.authorization;
                if (auth) {
                    let authVal = auth.split(" ");
                    if (authVal.length > 1) {
                        let auth = new Buffer(authVal[1], 'base64').toString('utf-8');
                        if (config.getAuth().includes(auth)) {
                            ctx.state.auth = {
                                u: auth.split(':')[0],
                                token: auth.split(':')[1]
                            };
                            await next();
                            return;
                        }
                    }
                    ctx.body = 'token无效';
                } else {
                    ctx.body = '没有设置token';
                }
            } catch (err) {
                console.error(err);
                ctx.body = '鉴权错误';
            }
        }
    }
};
