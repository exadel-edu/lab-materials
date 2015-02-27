var http = require('http');
var readline = require('readline');
var util = require('util');
var lastmessage = 0;
var period = 1000;
var options = {
  port: 1337,
  path: '/0',
  method: 'GET'
};
//get request to server. getting whole chat
function get() {
    //console.log('GET NOW');
    options.path = '/' + lastmessage;
    http.get(options, function(res) {
    //console.log("Got response: " + res.statusCode );

    res.on('data', function (chunk) {
      //console.log(util.inspect(chunk.toString(), { showHidden: true, depth: null }));
      chunk = chunk.toString();
      
      //console.log(messageanount + ' messageanount after read and parse');
      //console.log(lastmessage + ' last message number before');

      var history = [];
      history = chunk.substr(0 , chunk.length).split('\r\n#,');
      var messageanount = history.length;

      for (var x in history) {
        history[x] = history[x].toString();
      }
      if ( history[0].indexOf(',') == 0){ history[0] = history[0].substr(1, history[0].length);}
      history[history.length - 1] = history[history.length - 1].substr(0,history[history.length - 1].length - 3);
      //console.log(util.inspect(history, { showHidden: true, depth: null }));
      var i;
      for ( i = 0 ; i < history.length; i++ ) {
        console.log(history[i]);
      } 
      lastmessage += history.length;
      
    });

    res.on('finish', function() {
      console.log('get finished and starting new');
      get();
      console.log('new get started');
    })

    }).on('error', function(e) {
      console.log("Got error: " + e.message);
    });
}

//close to stop client.
function close(){
  process.exit(0);
}



//send message to server function
function send( line ){
  var options = {
    method: 'POST',
    url: 'http://127.0.0.1',
    port: 1337,
    agent: false
  };

  var req = http.request(options, function(response) {
      if(response.statusCode != 200) {
        console.log('Хуета на приеме');
      }
      
  });

  
  req.on('error', function(e) {
        console.log('Server shotdown.');
  });
  var buffer = new Buffer(line + '#');
  req.write(buffer);
  req.end();
  lastmessage++;
}


//command handler
process.stdin.setEncoding('utf8');
var input;
var temp;
function commandHandler(input){
  //console.log('in command handler. input = ' + input + '.');

  switch ( temp ){
      case 'get\r\n':
        get();
       break;

      case 'exit\r\n':
        close();
       break;

       default:
        if ( temp != null && temp.length > 0 )
          send(temp);
    }
}

get();


process.stdin.on('readable', function(){
    var input = process.stdin.read();
    if ( input == null ) {
      return;
    }
    temp = input;
    commandHandler(input);   
  
})

//setInterval(function() {
// get();
//}, period);

