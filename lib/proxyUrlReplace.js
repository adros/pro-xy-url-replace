var logger;

function init(_proxy, _logger) {
	logger = _logger;
}

function exec(config, req, res) {
	var urlReplConfig = config["pro-xy-url-replace"];
	if (!urlReplConfig || urlReplConfig.disabled) {
		logger.trace(`Url replace not enabled (${req.url})`);
		return;
	}

	var replaces = urlReplConfig.replaces;
	if (!replaces || !replaces.length) {
		logger.trace(`No replaces defined (${req.url})`);
		return;
	}

	replaces.forEach(function(replace) {
		if (replace.disabled) {
			return;
		}
		var pattern = new RegExp(replace.pattern);
		if (pattern.test(req.url)) {
			req.origUrl = req.origUrl || req.url;
			req.headers["x-pro-xy-url-replace"] = req.origUrl;
			req.url = req.url.replace(pattern, replace.replacement);
			logger.debug(`Replaced '${req.origUrl}' for '${req.url}'`);
		}
	});
	if (!req.origUrl) {
		logger.trace(`No repalce for ${req.url}`);
		return;
	}

	if (urlReplConfig.replaceBackHeaders && urlReplConfig.replaceBackHeaders.length) {
		//there may be some headers, where we want to replace back changes applied to URI (e.g. location, link)
		var diff = diffStrings(req.origUrl, req.url);

		var oldwriteHead = res.writeHead;
		res.writeHead = function() {
			urlReplConfig.replaceBackHeaders.forEach(headerName => {
				var headerValues = this.getHeader(headerName);
				if (!headerValues) {
					return;
				}
				if (typeof headerValues == "string") {
					headerValues = [
						headerValues
					];
				}
				headerValues = headerValues.map(headerVal => {
					var newVal = headerVal.replace(diff.b, diff.a);
					logger.trace(`Replacing back header ${headerName} val '${headerVal}' for '${newVal}'`);
					return newVal;
				});
				this.setHeader(headerName, headerValues);
			});
			oldwriteHead.apply(this, arguments);
		};
	}
}

function diffStrings(a, b) {
	// abcdef, abxyzf -> cde, xyz
	while (a.length && b.length && a[0] == b[0]) {
		a = a.substring(1);
		b = b.substring(1);
	}
	while (a.length && b.length && a[a.length - 1] == b[b.length - 1]) {
		a = a.substring(0, a.length - 1);
		b = b.substring(0, b.length - 1);
	}
	return {
		a,
		b
	};
}

module.exports = {
	init,
	exec
};
