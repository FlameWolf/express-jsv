"use strict";

const Ajv = require("ajv");
const validateSchema = routeSchema => {
	const ajv = new Ajv({ strict: false, coerceTypes: true });
	const validators = {};
	const hasHeaders = Object.hasOwn(routeSchema, "headers");
	const hasParams = Object.hasOwn(routeSchema, "params");
	const hasQuery = Object.hasOwn(routeSchema, "query");
	const hasBody = Object.hasOwn(routeSchema, "body");
	if (hasHeaders) {
		validators.headers = ajv.compile(routeSchema.headers);
	}
	if (hasParams) {
		validators.params = ajv.compile(routeSchema.params);
	}
	if (hasQuery) {
		validators.query = ajv.compile(routeSchema.query);
	}
	if (hasBody) {
		validators.body = ajv.compile(routeSchema.body);
	}
	return (req, res, next) => {
		req.schema = routeSchema;
		if (hasHeaders && !ajv.validate(routeSchema.headers, req.headers)) {
			throw new Error(`Schema validation failed for request headers: ${ajv.errorsText()}`);
		}
		if (hasParams && !ajv.validate(routeSchema.params, req.params)) {
			throw new Error(`Schema validation failed for request URL parameters: ${ajv.errorsText()}`);
		}
		if (hasQuery && !ajv.validate(routeSchema.query, req.query)) {
			throw new Error(`Schema validation failed for request query string: ${ajv.errorsText()}`);
		}
		if (hasBody && !ajv.validate(routeSchema.body, req.body)) {
			throw new Error(`Schema validation failed for request body: ${ajv.errorsText()}`);
		}
		next();
	};
};

module.exports = validateSchema;