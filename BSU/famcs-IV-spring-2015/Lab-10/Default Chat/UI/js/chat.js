'use strict';

var uniqueId = function() {
	var date = Date.now();
	var random = Math.random() * Math.random();

	return Math.floor(date * random).toString();
};

var theMessage = function(text) {
	return {
		text:text,
		user: appState.user,
		id: uniqueId()
	};
};

var appState = {
	user: 'User_' + uniqueId(),
	mainUrl : 'http://localhost:999/chat',
	history:[],
	token : 'TE11EN'
};

function run() {
	var sendButton = document.getElementById('sendButton');
	var newMessageBox = document.getElementById('newMessage');

	newMessageBox.addEventListener('keypress', function(e) {
		if(e.keyCode == 13)
			onSendButtonClick();
		return false;
	});
	sendButton.addEventListener('click', onSendButtonClick);
	doPolling();
}

function onSendButtonClick(){
	var newMessageBox = document.getElementById('newMessage');
	var newMessage = theMessage(newMessageBox.value);

	if(newMessageBox.value == '')
		return;

	newMessageBox.value = '';
	sendMessage(newMessage, function() {
		console.log('Message sent ' + newMessage.text);
	});
} 

function sendMessage(message, continueWith) {
	post(appState.mainUrl, JSON.stringify(message), function(){
		continueWith && continueWith();
	});
}

function updateHistory(newMessages) {
	for(var i = 0; i < newMessages.length; i++)
		addMessageInternal(newMessages[i]);
}

function addMessageInternal(message) {
	var historyBox = document.getElementById('history');
	var history = appState.history;

	history.push(message);
	historyBox.innerText = message.user + ' имел сказать:\n' + message.text + '\n\n' + historyBox.innerText;
}

function doPolling() {
	function loop() {
		var url = appState.mainUrl + '?token=' + appState.token;

		get(url, function(responseText) {
			var response = JSON.parse(responseText);

			appState.token = response.token;
			updateHistory(response.messages);
			setTimeout(loop, 1000);
		});
	}

	loop();
}

function defaultErrorHandler(message) {
	console.error(message);
}

function get(url, continueWith, continueWithError) {
	ajax('GET', url, null, continueWith, continueWithError);
}

function post(url, data, continueWith, continueWithError) {
	ajax('POST', url, data, continueWith, continueWithError);	
}

function isError(text) {
	if(text == "")
		return false;
	
	try {
		var obj = JSON.parse(text);
	} catch(ex) {
		return true;
	}

	return !!obj.error;
}

function ajax(method, url, data, continueWith, continueWithError) {
	var xhr = new XMLHttpRequest();

	continueWithError = continueWithError || defaultErrorHandler;
	xhr.open(method || 'GET', url, true);

	xhr.onload = function () {
		if (xhr.readyState !== 4)
			return;

		if(xhr.status != 200) {
			continueWithError('Error on the server side, response ' + xhr.status);
			return;
		}

		if(isError(xhr.responseText)) {
			continueWithError('Error on the server side, response ' + xhr.responseText);
			return;
		}

		continueWith(xhr.responseText);
	};    

	xhr.ontimeout = function () {
		ontinueWithError('Server timed out !');
	}

	xhr.onerror = function (e) {
		var errMsg = 'Server connection error !\n'+
		'\n' +
		'Check if \n'+
		'- server is active\n'+
		'- server sends header "Access-Control-Allow-Origin:*"';

		continueWithError(errMsg);
	};

	xhr.send(data);
}

window.onerror = function(err) {
	console.error(err);
}