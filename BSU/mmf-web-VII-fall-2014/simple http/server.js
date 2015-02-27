var http = require('http');
var getIp = require('../getip');

var ip = getIp();
var port = 1337;

http.createServer(function (req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin':'*'
  });
  res.end('Hello World\n');
}).listen(port, 'ip);

console.log('Server running at http://' + ip + ':' + port);