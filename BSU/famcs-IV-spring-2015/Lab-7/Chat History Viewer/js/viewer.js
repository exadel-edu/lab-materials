var interval = null;

function About() {
	alert('Chat History Viewer\nПоказывает серверную историю сообщений\nExadel @ 2015');
}

function Connect() {
	if(interval)
		return;

	interval = setInterval( function() {
		ajax('GET', 'http://localhost:999/chat?token=TN11EN', function (serverResponse){
			interval && setOutput(serverResponse);
		});
	}, seconds(1) );
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
	if(interval) {
		clearInterval(interval);
		interval = null;
	}

	var help = 'Start server at localhost:999\nExpected URL is http://localhost:999/chat?token=TN11EN';

	setOutput(help);
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
    }

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