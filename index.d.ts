import { RequestHandler } from "express";
import { SchemaObject } from "ajv";

declare const validateSchema: (routeSchema: SchemaObject) => RequestHandler;

export default validateSchema;