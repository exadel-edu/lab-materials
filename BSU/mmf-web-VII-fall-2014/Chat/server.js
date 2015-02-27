var http = require('http');
var history = [];
var util = require('util');
var toBeResponded = [];
var assert = require('assert');
var url = require('url');
var getIp = require('..\\getIp');

var ip = getIp();
var port = 31337;

var server = http.createServer(function (req, res) {
	if(req.method == 'GET'){
		getHandler(req, res);
		console.log('method: ' + req.method);
		return;
	}
	if(req.method == 'POST'){
		postHandler(req, res);
		console.log('method: ' + req.method);
		return;
	}
});

function getHandler(req, res) {
	console.log('gethandler started');
	var token = getToken(req.url);
	console.log('token: ' + token);
	console.log('history size: ' + history.length);

	if(token > history.length) {
		responseWith(res, 401, token, null);
		return;
	}

	if(token < history.length) {
		var messages = history.slice(token, history.length);
		responseWith(res, 200, history.length, messages);
		return;
	}

	console.log('waiter added.token: ' + token + ' history size: ' + history.length);
	toBeResponded.push({res: res, token: token});
	
}

function postHandler(req, res) {
	console.log('posthandler started');
	onDataComplete(req, function(message){
		history.push(message);
		console.log('history: ' + util.inspect(history, { showHidden: true, depth: null }));
		toBeResponded.forEach(function(waiter){
			var token = waiter.token;
			console.log('responding waiter. token: ' + token + ' history size: ' + history.length);
			responseWith(waiter.res, 200, history.length, history.slice(token, history.length) );
			console.log(history.slice(token, history.length));
			waiter.res.end();
		});
		toBeResponded = [];
		res.writeHeader(200, {'Access-Control-Allow-Origin':'*'});
		res.end();
	});
}

function responseWith(response, statusCode, token, messages){
	response.writeHeader(statusCode, {'Access-Control-Allow-Origin':'*'});
	if ( messages != null ) {
	
		response.write(JSON.stringify({
			token:token,
			messages:messages
			})
		);
	}
	response.end();
}

function getToken(u) {
	var parts = url.parse(u, true);
	console.log(u);
	console.log(parts.query);
	console.log(parts.query.token);
	return parts.query.token;
}

function onDataComplete(req, handler) {
	var message = '';
	req.on('data', function(data){
		message += data.toString();
	});

	req.on('end', function(){
		handler(JSON.parse(message));
	});
}


server.listen(port, ip);
server.setTimeout(0);
console.log('Server running at http://'+ ip + ':'+ port);

	