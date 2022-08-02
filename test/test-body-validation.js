const tap = require("tap");
const http = require("http");
const setup = require("./setup");

tap.test("pass schema validation", async t => {
	const content = JSON.stringify({
		content: "Test content",
		poll: {
			first: "Option 1",
			second: "Option 2"
		}
	});
	const app = setup();
	const server = http.createServer(app);
	server.on("listening", () => {
		console.log("LISTENING");
		const address = server.address();
		const req = http.request(
			{
				protocol: "http:",
				hostname: "localhost",
				port: address.port,
				path: "/",
				headers: {
					"Content-Type": "application/json",
					"Content-Length": content.length
				},
				method: "POST",
				body: content
			},
			res => {
				res.resume();
				t.equal(res.statusCode, 200);
			}
		);
		req.end();
	});
	server.on("error", err => {
		console.log(err);
	});
	server.listen(+process.env.PORT || 2020);
	server.close(() => {
		t.end();
	});
});
tap.test("fail schema validation", async t => {
	const content = JSON.stringify({
		content: "Test content",
		poll: {
			second: "Option 2"
		}
	});
	const app = setup();
	const server = http.createServer(app);
	server.on("listening", () => {
		console.log("LISTENING");
		const address = server.address();
		const req = http.request(
			{
				protocol: "http:",
				hostname: "localhost",
				port: address.port,
				path: "/body",
				headers: {
					"Content-Type": "application/json",
					"Content-Length": content.length
				},
				method: "POST",
				body: content
			},
			res => {
				res.resume();
				t.equal(res.statusCode, 500);
			}
		);
		req.end();
	});
	server.on("error", err => {
		console.log(err);
	});
	server.listen(+process.env.PORT || 2020);
	server.close(() => {
		t.end();
	});
});