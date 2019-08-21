'use strict';

const service = require('../../service');
const catalogueService = service.catalogue;
const paperService = service.paper;

const genInitData = async (ctx, routeLink) => {
    const initData = {
        data: null,
        success: false,
    };
    const params = ctx.params;
    const query = ctx.request.query;
    let paperId;
    let where;
    let page;

    switch(routeLink) {
    case '/':
        initData.data = {};
        break;
    case '/catalogue':
        page = Number(query.page) || 1;
        try {
            initData.data = {};
            initData.data.catalogue = await catalogueService.page({}, page);
            initData.success = true;
        } catch(err) {} // eslint-disable-line
        break;
    case '/catalogue/:filterType/:filterParam':
        where = ((type, param) => {
            var _where;

            switch(type) {
            case 'tag':
                _where = {
                    tag: param,
                };
                break;
            case 'timeline':
                _where = {
                    year_tag: param,
                };
                break;
            }

            return _where;
        })(params.filterType, params.filterParam);
        page = Number(query.page) || 1;
        try {
            initData.data = {};
            initData.data.catalogue = await catalogueService.page(where, page);
            initData.success = true;
        } catch(err) {} // eslint-disable-line
        break;
    case '/paper/:paperId':
        paperId = Number(params.paperId) || 0;

        if (paperId) {
            try {
                initData.data = {};
                initData.data.paper = await paperService.findById(paperId);
                initData.success = true;
            } catch(err) {} // eslint-disable-line
        }
        break;
    case '/user/:uuid':
        initData.data = {};
        break;
    case '/util/activate/:uuid':
        initData.data = {};
        break;
    case '/admin/add-paper':
        initData.data = {};
        break;
    case '/admin/edit-paper/:paperId':
        initData.data = {};
        break;
    default:
        initData.data = {};
    }

    return initData;
};

const genSeoData = (ctx, routeLink, initData) => {
    const params = ctx.params;
    const defaultOpts = {
        author: 'Stan',
        type: 'blog_site_version_5.0',
        title: 'Stan\'s enhanced blog site',
        keywords: 'blog,koa2,react@functional_component,redux,mysql',
        description: 'enhanced blog site belongs to Stan using koa2/react/redux/mysql',
        follow: true,
        index: true,
        httpImage: 'http://monkingstand.oss-cn-beijing.aliyuncs.com/static/img/logo.jpg',
        httpsImage: 'https://monkingstand.oss-cn-beijing.aliyuncs.com/static/img/logo.jpg',
    };
    const opts = (() => {
        const _opts = Object.assign({}, defaultOpts);
        const _data = initData.data || {};
        let catalogue, paper;

        switch(routeLink) {
        case '/':
            break;
        case '/catalogue':
            if (initData.success) {
                catalogue = _data.catalogue;
                _opts.title = `catalogue list without filter in page ${catalogue.page}`;
                _opts.keywords = `catalogue_list,no_filter,page${catalogue.page}`;
                _opts.description = (rows => {
                    const tagList = [];
                    const subtagList = [];
                    const uniqueMap = {};

                    rows.forEach(row => {
                        if (row.tag && !uniqueMap[row.tag]) {
                            uniqueMap[row.tag] = true;
                            tagList.push(row.tag);
                        }
                        if (row.subtag && !uniqueMap[row.subtag]) {
                            uniqueMap[row.subtag] = true;
                            subtagList.push(row.subtag);
                        }
                    });

                    return `${tagList.join('，')}${subtagList.length ? ('，' + subtagList.join('，')) : ''}`;
                })(catalogue.rows);
            } else {
                _opts.title = 'get catalogue list failed!';
                _opts.description = 'please check that åwhether the internet works as expected!';
            }
            break;
        case '/catalogue/:filterType/:filterParam':
            if (initData.success) {
                catalogue = _data.catalogue;
                _opts.title = `catalogue list with filter param [${params.filterParam}] under [${params.filterType}] in page ${catalogue.page}`;
                _opts.keywords = `catalogue_list,under_${params.filterType},filter_by_${params.filterParam},page${catalogue.page}`;
                _opts.description = (rows => {
                    const tagList = [];
                    const subtagList = [];
                    const uniqueMap = {};

                    rows.forEach(row => {
                        if (row.tag && !uniqueMap[row.tag]) {
                            uniqueMap[row.tag] = true;
                            tagList.push(row.tag);
                        }
                        if (row.subtag && !uniqueMap[row.subtag]) {
                            uniqueMap[row.subtag] = true;
                            subtagList.push(row.subtag);
                        }
                    });

                    return `${tagList.join('，')}${subtagList.length ? ('，' + subtagList.join('，')) : ''}`;
                })(catalogue.rows);
            } else {
                _opts.title = 'get catalogue list failed!';
                _opts.description = 'please check that whether the url is legal, or check that whether the internet works as expected!';
            }
            break;
        case '/paper/:paperId':
            if (initData.success) {
                paper = _data.paper;
                _opts.title = paper.title;
                _opts.keywords = `${paper.tag}，${paper.subtag}`;
                _opts.description = `${paper.brief.slice(0, 250)}${paper.brief.length > 250 ? '......' : ''}`;
            } else {
                _opts.title = 'get paper detail failed!';
                _opts.description = 'please check that whether the paper id in the url is legal, or check that whether the internet works as expected!';
            }
            break;
        case '/user/:uuid':
            _opts.index = false;
            break;
        case '/util/activate/:uuid':
            _opts.index = false;
            break;
        case '/admin/add-paper':
            _opts.index = false;
            break;
        case '/admin/edit-paper/:paperId':
            _opts.index = false;
            break;
        default:
            // do nothing
        }

        return _opts;
    })();
    const seoData = `
        <meta name="author" content="${opts.author}">
        <meta name="keywords" content="${opts.keywords}">
        <meta name="description" content="${opts.description}">
        <meta name="robots" content="${opts.follow ? '' : 'no'}follow,${opts.index ? '' : 'no'}index">
        <meta property="og:type" content="${opts.type}">
        <meta property="og:title" content="${opts.title}">
        <meta property="og:keywords" content="${opts.keywords}">
        <meta property="og:description" content="${opts.description}">
        <meta property="og:image" content="${opts.httpImage}">
        <meta property="og:image:secure_url" content="${opts.httpsImage}">
        <title>${opts.title}</title>
    `;

    return seoData;
};

module.exports = async (ctx, routeLink) => {
    const initDataResult = await genInitData(ctx, routeLink);
    const seoData = genSeoData(ctx, routeLink, initDataResult);
    const result = {
        initData: JSON.stringify(initDataResult.data),
        seoData,
    };

    return result;
};