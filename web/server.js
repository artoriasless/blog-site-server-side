'use strict';

const config = require('../config');

const koaBody = require('koa-bodyparser');
const koaSession = require('koa-session');
const koaLogger = require('koa-logger');
const Koa = require('koa');
const app = new Koa();

const koaLoggerTransporter = require('./lib/koa-logger-transporter');

const router = require('./controller/_router');
const globalException = require('./middleware/global-exception');

app.keys = config.sessionKeys;

app.use(koaSession(config.session, app))
    .use(koaBody())
    .use(koaLogger({transporter: koaLoggerTransporter}))
    .use(router.routes())
    .use(router.allowedMethods())
    .use(globalException);

app.listen(config.port);