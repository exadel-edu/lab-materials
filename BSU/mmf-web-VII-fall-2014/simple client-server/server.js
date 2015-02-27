var http = require('http');
var history = [];
var messageamount = 0;
var util = require('util');
var clients = [];

console.log('Server starting 1...');
var server = http.createServer(function (req, res) {
	console.log('request begin');
  var body = '';
  var temphist = [];
  req.on('data', function (chunk) {
    body += chunk.toString();
    //console.log(body);
    
  })

  req.on('end', function () {
    res.write(body);
    if( req.method == 'POST' ) {
	    console.log('message inspect: ' + util.inspect(body, { showHidden: true, depth: null }));
	    messageamount++;
		history.push(body);
		console.log('history inspect: ' + util.inspect(history.toString(), { showHidden: true, depth: null }));
		console.log(messageamount + ' messageamount');
		res.end();
	}
	if ( req.method == 'GET' ) {
		res.writeHead(200, {'Content-Type': 'text/plain'});
	  	console.log(req.method + '\n');
	  	console.log(req.url + 'path\n');
	  	var lastmessage = parseInt(req.url.substr(1, req.url.toString().length));
	  	
	  	if ( lastmessage < messageamount ) {
	  			var temphist = [];
	  			var i;
	  			for ( i = lastmessage ; i < messageamount; i++ ) {
	  				temphist.push(history[i]);
	  			}
	  			
	  			res.end(temphist.toString());
	  	}
	  	
	  	
	  	
	} 	
	res.end();
 
  });


});
console.log('Server starting 2...');


server.listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
	