"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
/**
 * used for building swagger docs object
 */
const apiObjects = {};
exports.apiObjects = apiObjects;
const _addToApiObject = (target, name, apiObj, content) => {
    const key = `${target.constructor.name}-${name}`;
    if (!apiObj[key]) {
        apiObj[key] = {};
    }
    Object.assign(apiObj[key], content);
};
const _desc = (type, text) => (target, name, descriptor) => {
    descriptor.value[type] = text;
    _addToApiObject(target, name, apiObjects, { [type]: text });
    return descriptor;
};
const _params = (type, parameters) => (target, name, descriptor) => {
    if (!descriptor.value.parameters) {
        descriptor.value.parameters = {};
    }
    descriptor.value.parameters[type] = parameters;
    // additional wrapper for body
    let swaggerParameters = parameters;
    if (type === 'body') {
        swaggerParameters = [{
                name: 'data',
                description: 'request body',
                schema: {
                    type: 'object',
                    properties: parameters,
                },
            }];
    }
    else {
        swaggerParameters = Object.keys(swaggerParameters).map((key) => {
            return Object.assign({ name: key }, swaggerParameters[key]);
        });
    }
    swaggerParameters.forEach((item) => {
        item.in = type;
    });
    _addToApiObject(target, name, apiObjects, { [type]: swaggerParameters });
    return descriptor;
};
const request = (method, path) => (target, name, descriptor) => {
    method = _.toLower(method);
    descriptor.value.method = method;
    descriptor.value.path = path;
    _addToApiObject(target, name, apiObjects, {
        request: { method, path },
    });
    return descriptor;
};
exports.request = request;
const middlewares = (val) => (target, name, descriptor) => {
    if (!target || !name) {
        throw new Error();
    }
    descriptor.value.middlewares = val;
    return descriptor;
};
exports.middlewares = middlewares;
const responses = (res = { 200: { description: 'success' } }) => (target, name, descriptor) => {
    descriptor.value.responses = res;
    _addToApiObject(target, name, apiObjects, { responses: res });
    return descriptor;
};
exports.responses = responses;
const desc = _.curry(_desc);
exports.desc = desc;
// description and summary
const description = desc('description');
exports.description = description;
const summary = desc('summary');
exports.summary = summary;
const tags = desc('tags');
exports.tags = tags;
const security = desc('security');
exports.security = security;
const params = _.curry(_params);
exports.params = params;
// below are [parameters]
// query params
const query = params('query');
exports.query = query;
// path params
const path = params('path');
exports.path = path;
// body params
const body = params('body');
exports.body = body;
// formData params
const formData = params('formData');
exports.formData = formData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjb3JhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vbGliL2RlY29yYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDRCQUE0QjtBQUc1Qjs7R0FFRztBQUNILE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQztBQWdHcEIsZ0NBQVU7QUE5RlosTUFBTSxlQUFlLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsRUFBRTtJQUN4RCxNQUFNLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxJQUFJLElBQUksRUFBRSxDQUFDO0lBQ2pELElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDaEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztLQUNsQjtJQUNELE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3RDLENBQUMsQ0FBQztBQUVGLE1BQU0sS0FBSyxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxFQUFFO0lBQ3pELFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQzlCLGVBQWUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUM1RCxPQUFPLFVBQVUsQ0FBQztBQUNwQixDQUFDLENBQUM7QUFFRixNQUFNLE9BQU8sR0FBRyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsRUFBRTtJQUNqRSxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUU7UUFDaEMsVUFBVSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0tBQ2xDO0lBQ0QsVUFBVSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsVUFBVSxDQUFDO0lBRS9DLDhCQUE4QjtJQUM5QixJQUFJLGlCQUFpQixHQUFHLFVBQVUsQ0FBQztJQUNuQyxJQUFJLElBQUksS0FBSyxNQUFNLEVBQUU7UUFDbkIsaUJBQWlCLEdBQUcsQ0FBQztnQkFDbkIsSUFBSSxFQUFFLE1BQU07Z0JBQ1osV0FBVyxFQUFFLGNBQWM7Z0JBQzNCLE1BQU0sRUFBRTtvQkFDTixJQUFJLEVBQUUsUUFBUTtvQkFDZCxVQUFVLEVBQUUsVUFBVTtpQkFDdkI7YUFDRixDQUFDLENBQUM7S0FDSjtTQUFNO1FBQ0wsaUJBQWlCLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQzdELE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRSxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzlELENBQUMsQ0FBQyxDQUFDO0tBQ0o7SUFDRCxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUNqQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQztJQUNqQixDQUFDLENBQUMsQ0FBQztJQUVILGVBQWUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO0lBQ3pFLE9BQU8sVUFBVSxDQUFDO0FBQ3BCLENBQUMsQ0FBQztBQUVGLE1BQU0sT0FBTyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxFQUFFO0lBQzdELE1BQU0sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzNCLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUNqQyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDN0IsZUFBZSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO1FBQ3hDLE9BQU8sRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7S0FDMUIsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxVQUFVLENBQUM7QUFDcEIsQ0FBQyxDQUFDO0FBeUNBLDBCQUFPO0FBdkNULE1BQU0sV0FBVyxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLEVBQUU7SUFDeEQsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRTtRQUFFLE1BQU0sSUFBSSxLQUFLLEVBQUUsQ0FBQztLQUFFO0lBQzVDLFVBQVUsQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQztJQUNuQyxPQUFPLFVBQVUsQ0FBQztBQUNwQixDQUFDLENBQUM7QUFvQ1ksa0NBQVc7QUFsQ3pCLE1BQU0sU0FBUyxHQUFHLENBQUMsTUFBZ0IsRUFBRSxHQUFHLEVBQUUsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxFQUFFO0lBQ3RHLFVBQVUsQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztJQUNqQyxlQUFlLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUM5RCxPQUFPLFVBQVUsQ0FBQztBQUNwQixDQUFDLENBQUM7QUE4Qm1DLDhCQUFTO0FBN0I5QyxNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBNEJBLG9CQUFJO0FBMUJoQywwQkFBMEI7QUFDMUIsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBeUJOLGtDQUFXO0FBdkI3QyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUF1QnJCLDBCQUFPO0FBckJsQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFxQndDLG9CQUFJO0FBbkJ0RSxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7QUFvQmUsNEJBQVE7QUFsQnhELE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7QUFpQlosd0JBQU07QUFmMUIseUJBQXlCO0FBRXpCLGVBQWU7QUFDZixNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7QUFZaUIsc0JBQUs7QUFWcEQsY0FBYztBQUNkLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQVMwQixvQkFBSTtBQVAxRCxjQUFjO0FBQ2QsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBTWdDLG9CQUFJO0FBSmhFLGtCQUFrQjtBQUNsQixNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7QUFJVCw0QkFBUSJ9