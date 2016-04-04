var isConnected = void 0;
var serverUrl = 'http://localhost:1555/todos?token=TN11EN';

function About() {
	alert('Server JSON Viewer\nПоказывает серверный ответ\nExadel @ 2016');
}

function Run() {
	Help();
}

function Help() {
	var help = 'Start server at localhost:1555\nExpected URL is ' + serverUrl;

	setOutput(help);
}

function Connect() {
	if(isConnected)
		return;

	function whileConnected() {
		isConnected = setTimeout(function () {
			ajax('GET', serverUrl, function (serverResponse) {
				if (isConnected) {
					setOutput(serverResponse);
					whileConnected();
				}
			});
		}, seconds(1));
	}

	whileConnected();
}

function tryJSON(text) {
	try{
		var json  = JSON.parse(text);

		return JSON.stringify(json, null, 2);
	}
	catch(ex) {
		return text;
	}
}

function setOutput(text){
	var output = document.getElementById('output');

	output.innerHTML = tryJSON(text);	
}

function Disconnect() {
	if(isConnected) {
		clearInterval(isConnected);
		isConnected = null;
	}

	Help();
}

function ajax(method, url, toReturn) {
	var xhr = new XMLHttpRequest();

	xhr.open(method || 'GET', url, true);

	xhr.onload = function () {
		if (xhr.readyState !== 4) {
			return;
		}

		toReturn(xhr.responseText);
	};    

    xhr.ontimeout = function () {
    	toReturn('Server timed out !');
    };

    xhr.onerror = function (e) {
    	var errMsg = 'Server connection error !\n'+
    	'\n' +
    	'Check if \n'+
    	'- server is active\n'+
    	'- server sends header "Access-Control-Allow-Origin:*"';

        toReturn(errMsg);
    };

    xhr.send();
}

function seconds(value) {
	return Math.round(value * 1000);
}

function Exit(){
	window.close(true);
}
