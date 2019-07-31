'use strict';

const GET = 'GET';
const POST = 'POST';

const fs = require('fs');
const path = require('path');

const Router = require('koa-router');
const cors = require('koa2-cors');
const _router = new Router();

const config = require('../../config');
const ossPrefix = `${config.ossPublic.domainPrefix}/${config.ossPublic.staticFolder}`;
const staticVersion = config.ossPublic.staticVersion;

//  前端将使用 react ，网站采用 SPA 模式，固定模板页面，设定路由列表
const routeList = [
    '/',
];
const apiMap = {
    /*
    ${apiLink}: {
        type: GET,
        cors: false,
        func: ${apiProcessFunc},
    }
    */
};

async function page(ctx, next) {
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
}

routeList.forEach(routeLink => {
    _router.get(routeLink, page);
});

const apiList = Object.keys(apiMap);

apiList.forEach(apiLink => {
    const apiItem = apiMap[apiLink];

    if (apiItem.cors) {
        switch(apiItem.type) {
        case GET:
            _router.get(apiLink, cors(), apiItem.func);
            break;
        case POST:
            _router.post(apiLink, cors(), apiItem.func);
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
});

module.exports = _router;
