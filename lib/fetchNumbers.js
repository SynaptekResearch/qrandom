const http = require(`http`);

module.exports = function(type, length, blockSize, cb) {
	try {
		if (!type || !(typeof type === `string`) || (!type.includes(`uint8`) && !type.includes(`uint16`) && !type.includes(`hex16`))) {
			return cb(new Error(`Type parameter must be 'uint8', 'uint16' or 'hex16'`));
		}
		if (!length || !(typeof length === `number`) || (length < 1 || length > 1024)) {
			return cb(new Error(`Length parameter must be a number between 1-1024`));
		}
		if (type === `hex16` && (!blockSize || !(typeof blockSize === `number`) || (blockSize < 1 || blockSize > 1024))) {
			return cb(new Error(`Block Size parameter must be a number between 1-1024`));
		}

		const apiURL = `http://qrng.anu.edu.au/API/jsonI.php?type=${type}&length=${length}${type === `hex16` ? `&size=${blockSize}` : ``}`;

		http.get(apiURL, function(res) {
			var response = ``;
			res.on(`error`, function(err) {
				return cb(new Error(err));
			});

			res.on(`data`, function(chunk) {
				response += chunk;
			});

			res.on(`end`, function() {
				if (res.statusCode !== 200) return cb(new Error(response));
				response = JSON.parse(response);
				if (!response.success) return cb(new Error(`Request failed`));
				return cb(null, response.data);
			});
		});
	} catch (error) {
		return cb(error);
	}
};