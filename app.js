/**
 * Created by ximing on 2/26/18.
 */
'use strict';
const koa = require('koa');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const http = require('http');

const config = require('./lib/config');
const controller = require('./router');
const baseAuth = require('./middleware/base-auth');

const app = new koa();
app.use(bodyParser());
app.use(baseAuth([], []));
controller.register(app);
app.use(logger());
const port = config.getPort();
const httpServer = http.createServer(app.callback());
httpServer.listen(port, () => {
    console.log(`---- server started. listen : ${port} ----`);
});
