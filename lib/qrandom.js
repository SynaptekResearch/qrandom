const http = require(`http`);

module.exports = function (type, length, blockSize, cb) {
    try {
        parseParams(type, length, blockSize);
        apiURL = `http://qrng.anu.edu.au/API/jsonI.php?type=${type}&length=${length}${type === `hex16` ? `&size=${blockSize}` : ``}`;
        return cb ?
            withCallback(cb) :
            withPromise();
    } catch (error) {
        return cb ?
            cb(`` + error) :
            new Promise((resolve, reject) => { reject(`` + error) });
    }
};

function withCallback(cb) {
    fetchNumbers((data) => cb(null, data));
}

function withPromise() {
    return new Promise((resolve, reject) => {
        fetchNumbers((data) => { resolve(data) });
    })
};

function parseParams(type, length, blockSize) {
    if (!type || !(typeof type === `string`) || (!type.includes(`uint8`) && !type.includes(`uint16`) && !type.includes(`hex16`))) {
        throw new Error(`Type parameter must be 'uint8', 'uint16' or 'hex16'`);
    }
    if (!length || !(typeof length === `number`) || (length < 1 || length > 1024)) {
        throw new Error(`Length parameter must be a number between 1-1024`);
    }
    if (type === `hex16` && (!blockSize || !(typeof blockSize === `number`) || (blockSize < 1 || blockSize > 1024))) {
        throw new Error(`Block Size parameter must be a number between 1-1024`);
    }
}

function fetchNumbers(cb) {
    http.get(apiURL, function (res) {
        var response = ``;
        res.on(`error`, function (error) {
            throw new Error(error);
        });

        res.on(`data`, function (chunk) {
            response += chunk;
        });

        res.on(`end`, function () {
            if (res.statusCode !== 200)
                throw new Error(response);
            response = JSON.parse(response);
            if (!response.success)
                throw new Error(`Request failed`);
            cb(response.data);
        });
    });
}