var mw = {};

mw.respondToSave = function (req, res, next) {
	// Just add helper to response.
	res.respondValid = function (err, valid) {
		// Save method returns error object and valid flag.
		res.send(valid ? 204 : 400, err || undefined);
	};
	return next();
}

module.exports = mw;