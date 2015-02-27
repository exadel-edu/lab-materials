var http = require('http');
var util = require('util');
var getIp = require('..\\getIp');

var ip = getIp();
var port = 31337;

var token = 0;
var body = '';
var period = 10000;

function get() {
	var optionsGet = {
 		hostname: getIp(),
 		port: port,
  		path: '/',
  		method: 'GET'
	};

	optionsGet.path = setUrl(token);
	var get = http.get(optionsGet, function(response) {
		onDataFromServer(response, function(incoming) {
			incomingObj = JSON.parse(incoming);
			//console.log('client token: ' + token);
			//console.log('incoming token: ' + incomingObj.token);
			if ( token < incomingObj.token ) {
				token = incomingObj.token;
				incomingObj.messages.forEach(function(message) {
					console.log(message);
				}) 	
			}
			
		})
	
	});

	get.on('error', function(e){
		process.exit();
	});
}

function onDataFromServer(response, incomingHandler) {
	response.on('data', function(data) {
		body += data;
		//console.log('data recieved: ' + data);
	})
	response.on('end', function() {
		//console.log('get finished');
		incomingHandler(body);
		body = '';
		get();
		
	})
	response.on('error', function(e) {
		console.log('error getting: ' + e.message);
		get();
	})

}

function setUrl(token) {
	return '/?token=' + token;
}

function send( line ){

	var optionsPost = {
    	hostname: ip,
    	method: 'POST',
    	port: port,
    	agent: false
  	};

  var req = http.request(optionsPost, function(response) {
      if(response.statusCode != 200) {
        console.log('Bad request. error: ' + response.statusCode);
        return;
      }
  });

  req.on('error', function(e) {
        console.log('Server shotdown.');
  });

  req.write(JSON.stringify(line.trim()));
  token++;
  req.end();
}


function close(){
  process.exit(0);
}


process.stdin.setEncoding('utf8');
var input;
var temp;

function commandHandler(input){

  switch ( temp.trim() ){
      case 'exit':
        close();
       break;

       default:
        if ( temp != null && temp.length > 0 )
          send(temp);
    }
}

process.stdin.on('readable', function(){
    var input = process.stdin.read();
    if ( input == null ) {
      return;
    }
    temp = input;
    commandHandler(input); 
}); 



//main.
//starting with get request and listening for input to send or close client instatance.
get();
