/**
 * Created by ximing on 2/26/18.
 */
'use strict';
let Router = require('koa-router');
let router = new Router();
require('./upload.js').register(router);
module.exports.register = function (app) {
    app
        .use(router.routes())
        .use(router.allowedMethods());
};
