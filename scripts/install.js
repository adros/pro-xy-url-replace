#!/usr/bin/env node

var fs = require("fs");
var path = require("path");

var CONFIG_LOCATION = path.join(process.env.HOME, ".pro-xyrc.json");

if (!fs.existsSync(CONFIG_LOCATION)) {
	console.log(`Config file '${CONFIG_LOCATION}' not found, no further action.`);
} else {
	var config = require(CONFIG_LOCATION);
	if (config["pro-xy-url-replace"]) {
		console.log(`Section 'pro-xy-url-replace' already exists in config file '${CONFIG_LOCATION}', no further action.`);
		return;
	}
	config["pro-xy-url-replace"] = {
		disabled: false,
		replaces: [],
		replaceBackHeaders: [
			"location",
			"link"
		]
	};
	fs.writeFileSync(CONFIG_LOCATION, JSON.stringify(config, null, "\t"));
	console.log(`Default config for 'pro-xy-url-replace' added to file '${CONFIG_LOCATION}'.`);
}
