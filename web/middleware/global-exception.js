'use strict';

const fs = require('fs');
const path = require('path');

const config = require('../../config');
const ossPrefix = `${config.ossPublic.domainPrefix}/${config.ossPublic.staticFolder}`;
const staticVersion = config.ossPublic.staticVersion;

module.exports = async (ctx, next) => {
    const statusCode = String(ctx.status);

    try {
        await next();

        if (statusCode[0] !== '2' && statusCode !== '3') {
            const error = {
                code: ctx.status,
                message: ctx.message,
            };

            throw(error);
        }
    } catch (err) {
        const apiUrlReg = /^\/{0,1}api\//;
        const requestUrl = ctx.request.url;
        const filePath = path.resolve(__dirname, `../template/status/${statusCode == 404 ? '404' : 'unknown'}.html`);
        const cacheTag = (process.env.NODE_ENV === 'production') ? '' : `?${Date.parse(new Date())}`;
        var data;

        if (apiUrlReg.test(requestUrl)) {
            //  ajax 请求
            data = {
                success: false,
                message: err.message.toString(),
                data: null,
            };
        } else {
            //  页面访问
            data = fs.readFileSync(filePath).toString().replace(/<errorContent>/g, err.message.toString().trim());
            data = data.replace(/<ossPrefix>/g, ossPrefix);
            data = data.replace(/<staticVersion>/g, staticVersion);
            data = data.replace(/<cacheTag>/g, cacheTag);
        }

        ctx.body = data;
    }
};
