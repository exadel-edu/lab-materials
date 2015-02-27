(function (global) {

    var Http = {};

    Http.request = function(urlOrOptions, resolve, reject){
        return httpRequest(urlOrOptions, resolve, reject);
    };

    function httpRequest(arg, resolve, reject) {
        if (!arg) {
            reject(new Error("httpRequest requires an argument"));
        }

        var config;

        if (typeof arg == 'string') {
            config = { url: arg };
        } else {
            config = arg;
            config.url = config.url || config.uri;
        } 

        if (!config) {
            reject(Error('httpRequest requires non empty url or request parameters object'));
        }

        config.method = config.method || 'GET';
        config.timeout = config.timeout || 600000;

        requestImpl(config, resolve, reject);
    }

    function assign(to, from) {

        for (var key in from) {
            //copy all the fields
            to[key] = from[key];
        }

        return to;
    }

    function extractHeaders(headers) {
        return headers
            .trim()
            .split('\n')
            .map(function (x) {
                var index = x.indexOf(':');
                var key = x.slice(0, index).trim();
                var value = x.slice(index + 1).trim();
                var y = {};

                y[key] = value;

                return y;
            })
            .reduce(function (acc, item) {
                return assign(acc, item);
            }, {});
    }

    function requestImpl(config, resolve, reject) {
        var xhr = new XMLHttpRequest();

        xhr.open(config.method, config.url, true);

        for(var name in config.headers) {
            var value = config.headers[name];

            xhr.setRequestHeader(value, name);
        }

        xhr.timeout = config.timeout;
        xhr.responseType = config.responseType;

        xhr.onload = function () {
            if (xhr.readyState !== 4) {
                return;
            }

            var result = {
                statusCode: xhr.status,
                statusText: xhr.statusText,
                headers: extractHeaders(xhr.getAllResponseHeaders()),
                options: config
            };

            if(config.responseType in {blob:0, arraybuffer:0}){
                result.responseBlob = xhr.response;
            }
            else {
                result.responseText = xhr.responseText;
            }

            resolve(result);
        };

        xhr.ontimeout = function () {
            reject({ statusCode: 0, statusText: 'timedout', timedout: true, options: config });
        };

        xhr.onerror = function (e) {
            reject({ statusCode: 0, statusText: 'error', error: e, options: config });
        };

        xhr.send(config.data);
    }


    global.Http = Http;
})(typeof self !== 'undefined' ? self : global);