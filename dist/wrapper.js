"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const decorator_1 = require("./decorator");
const oauth2RedirectHTML_1 = require("./oauth2RedirectHTML");
const swaggerHTML_1 = require("./swaggerHTML");
const swaggerJSON_1 = require("./swaggerJSON");
const utils_1 = require("./utils");
const validate_1 = require("./validate");
/**
 * allowed http methods
 */
const reqMethods = ['get', 'post', 'put', 'patch', 'delete'];
const validator = (parameters) => async (ctx, next) => {
    if (!parameters) {
        await next();
        return;
    }
    if (parameters.query) {
        ctx.validatedQuery = validate_1.default(ctx.request.query, parameters.query);
    }
    if (parameters.path) {
        ctx.validatedParams = validate_1.default(ctx.params, parameters.path);
    }
    if (parameters.body) {
        ctx.validatedBody = validate_1.default(ctx.request.body, parameters.body);
    }
    await next();
};
const handleSwagger = (router, options) => {
    const { swaggerJsonEndpoint = '/swagger-json', swaggerHtmlEndpoint = '/swagger-html', oauth2RedirectHtmlEndpoint = '/oauth2-redirect', prefix = '', oauth2RedirectUrl = '/oauth2-redirect', } = options;
    // setup swagger router
    router.get(swaggerJsonEndpoint, async (ctx) => {
        ctx.body = swaggerJSON_1.default(options, decorator_1.apiObjects);
    });
    router.get(swaggerHtmlEndpoint, async (ctx) => {
        ctx.body = swaggerHTML_1.default(utils_1.getPath(prefix, swaggerJsonEndpoint), oauth2RedirectUrl);
    });
    router.get(oauth2RedirectHtmlEndpoint, async (ctx) => {
        ctx.body = oauth2RedirectHTML_1.default();
    });
};
const handleMap = (app, ControllerClass) => {
    const anonymousContext = app.createAnonymousContext();
    const router = app.router;
    const c = new ControllerClass(Object.assign(anonymousContext));
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(c));
    // remove useless field in class object:  constructor, length, name, prototype
    _.pull(methods, 'name', 'constructor', 'length', 'prototype', 'pathName', 'fullPath');
    // map all method in methods
    methods
        // filter methods without @request decorator
        .filter((item) => {
        const { path, method } = c[item];
        if (!path && !method) {
            return false;
        }
        return true;
    })
        // add router
        .forEach((item) => {
        const { path, method } = c[item];
        let { middlewares = [] } = c[item];
        if (typeof middlewares === 'function') {
            middlewares = [middlewares];
        }
        if (!Array.isArray(middlewares)) {
            throw new Error('middlewares params must be an array or function');
        }
        middlewares.forEach((item) => {
            if (typeof item !== 'function') {
                throw new Error('item in middlewares must be a function');
            }
        });
        if (!reqMethods.includes(method)) {
            throw new Error(`illegal API: ${method} ${path} at [${item}]`);
        }
        const chain = [
            `${utils_1.convertPath(path)}`,
            validator(c[item].parameters),
            ...middlewares,
            async (ctx) => {
                const c = new ControllerClass(ctx);
                await c[item]();
            }
        ];
        router[method](...chain);
    });
};
const handleMapDir = (app) => {
    utils_1.loadSwaggerClassesToContext(app);
    const classes = app.swaggerControllerClasses;
    Object.keys(classes).forEach((name) => { handleMap(app, classes[name]); });
};
const wrapper = (app, options) => {
    const opts = {
        title: 'API DOC',
        description: 'API DOC',
        version: 'v1.0.0',
        prefix: '',
        swaggerJsonEndpoint: '/swagger-json',
        swaggerHtmlEndpoint: '/swagger-html',
        oauth2RedirectHtmlEndpoint: '/oauth2-redirect',
        makeSwaggerRouter: false,
    };
    Object.assign(opts, options || {});
    const { router } = app;
    if (makeSwaggerRouter) {
        handleMapDir(app);
    }
    handleSwagger(router, opts);
};
exports.wrapper = wrapper;
const makeSwaggerRouter = (app) => handleMapDir(app);
exports.makeSwaggerRouter = makeSwaggerRouter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3JhcHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi93cmFwcGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsNEJBQTRCO0FBQzVCLDJDQUF5QztBQUN6Qyw2REFBc0Q7QUFDdEQsK0NBQXdDO0FBQ3hDLCtDQUE0RDtBQUM1RCxtQ0FBNEU7QUFDNUUseUNBQWtDO0FBQ2xDOztHQUVHO0FBQ0gsTUFBTSxVQUFVLEdBQUcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFTN0QsTUFBTSxTQUFTLEdBQUcsQ0FBQyxVQUFzQixFQUFFLEVBQUUsQ0FBQyxLQUFLLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFO0lBQy9ELElBQUksQ0FBQyxVQUFVLEVBQUU7UUFDZixNQUFNLElBQUksRUFBRSxDQUFDO1FBQ2IsT0FBTztLQUNSO0lBRUQsSUFBSSxVQUFVLENBQUMsS0FBSyxFQUFFO1FBQ3BCLEdBQUcsQ0FBQyxjQUFjLEdBQUcsa0JBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDcEU7SUFDRCxJQUFJLFVBQVUsQ0FBQyxJQUFJLEVBQUU7UUFDbkIsR0FBRyxDQUFDLGVBQWUsR0FBRyxrQkFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzdEO0lBQ0QsSUFBSSxVQUFVLENBQUMsSUFBSSxFQUFFO1FBQ25CLEdBQUcsQ0FBQyxhQUFhLEdBQUcsa0JBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDakU7SUFDRCxNQUFNLElBQUksRUFBRSxDQUFDO0FBQ2YsQ0FBQyxDQUFDO0FBRUYsTUFBTSxhQUFhLEdBQUcsQ0FBQyxNQUFlLEVBQUUsT0FBdUIsRUFBRSxFQUFF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