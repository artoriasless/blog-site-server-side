'use strict';

const GET = 'GET';
const POST = 'POST';

const fs = require('fs');
const path = require('path');

const Router = require('koa-router');
const koaCors = require('koa2-cors');
const _router = new Router();

const config = require('../../config');
const api = require('./api');
const ossPrefix = `${config.ossPublic.domainPrefix}/${config.ossPublic.staticFolder}`;
const staticVersion = config.ossPublic.staticVersion;

//  前端将使用 react ，网站采用 SPA 模式，固定模板页面，设定路由列表
const routeList = [
    '/',
    '/catalogue',
    '/catalogue/:filterType/:filterParam',
    '/paper/:paperId',
    '/user/:uuid',
    '/util/activate/:uuid',
    '/admin/add-paper',
    '/admin/edit-paper/:paperId',
];
const cors = config.env === 'development';
const apiMap = {
    '/api/user/default': {
        cors,
        type: GET,
        func: api.user.getUserDefault
    },
    '/api/user/login': {
        cors,
        type: POST,
        func: api.user.login
    },
    '/api/user/logout': {
        cors,
        type: POST,
        func: api.user.logout
    },
    '/api/user/register': {
        cors,
        type: POST,
        func: api.user.register
    }
};

routeList.forEach(routeLink => {
    _router.get(routeLink, async function(ctx, next) {
        const adminReg = /^\/admin/;
        const reqUrl = ctx.request.url;
        const filePath = path.resolve(__dirname, '../template/index.html');
        const cacheTag = (process.env.NODE_ENV === 'production') ? '' : `?${Date.parse(new Date())}`;
        var data = fs.readFileSync(filePath).toString();

        if (adminReg.test(reqUrl)) {
            const user = ctx.session.user || {};
            const isOwner = ctx.session.isOwner;

            if (!isOwner || !user.uuid) {
                ctx.status = 404;
                ctx.message = 'Not Found';

                await next();
            } else {
                data = data.replace(/<cacheTag>/g, cacheTag);
                data = data.replace(/<ossPrefix>/g, ossPrefix);
                ctx.body = data.replace(/<staticVersion>/g, staticVersion);
            }
        } else {
            data = data.replace(/<cacheTag>/g, cacheTag);
            data = data.replace(/<ossPrefix>/g, ossPrefix);
            ctx.body = data.replace(/<staticVersion>/g, staticVersion);
        }
    });
});

for (let apiLink in apiMap) {
    const apiItem = apiMap[apiLink];

    if (apiItem.cors) {
        switch(apiItem.type) {
        case GET:
            _router.get(apiLink, koaCors(), apiItem.func);
            break;
        case POST:
            _router.post(apiLink, koaCors(), apiItem.func);
            break;
        default:
            // do nothing
        }
    } else {
        switch(apiItem.type) {
        case GET:
            _router.get(apiLink, apiItem.func);
            break;
        case POST:
            _router.post(apiLink, apiItem.func);
            break;
        default:
            // do nothing
        }
    }
}

module.exports = _router;