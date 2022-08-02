"use strict";

const express = require("express");
const validateSchema = require("../index");

const postCreateSchema = {
	body: {
		type: "object",
		properties: {
			content: {
				type: "string"
			},
			poll: {
				type: "object",
				properties: {
					first: {
						type: "string"
					},
					second: {
						type: "string"
					}
				},
				required: ["first", "second"]
			}
		}
	}
};
const createRouter = () => {
	const router = express.Router();
	router.post("/body", validateSchema(postCreateSchema), async (req, res, next) => {
		res.status(200).send();
	});
	return router;
};
const setup = () => {
	const app = express();
	app.use(express.json());
	app.use("/", createRouter());
	app.use((err, req, res, next) => {
		res.status(500).send(err);
	});
	return app;
};

module.exports = setup;