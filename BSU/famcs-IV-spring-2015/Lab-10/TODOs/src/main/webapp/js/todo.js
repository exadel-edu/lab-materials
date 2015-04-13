'use strict';

var uniqueId = function() {
	var date = Date.now();
	var random = Math.random() * Math.random();

	return Math.floor(date * random).toString();
};

var theTask = function(text, done) {
	return {
		description:text,
		done: !!done,
		id: uniqueId()
	};
};

var appState = {
	mainUrl : 'todos',
	taskList:[],
	token : 'TE11EN'
};

function run() {
	var appContainer = document.getElementsByClassName('todos')[0];

	appContainer.addEventListener('click', delegateEvent);
	appContainer.addEventListener('change', delegateEvent);
	appContainer.addEventListener('dblclick', delegateEvent);

	restore();
}

function createAllTasks(allTasks) {
	for(var i = 0; i < allTasks.length; i++)
		addTodoInternal(allTasks[i]);
}

function delegateEvent(evtObj) {
	if(evtObj.type === 'click'
		&& evtObj.target.classList.contains('btn-add'))
		onAddButtonClick();
	if(evtObj.type === 'change' 
		&& evtObj.target.nodeName == 'INPUT'
		&& evtObj.target.type == 'checkbox')
		onToggleItem(evtObj.target.parentElement);
}

function onAddButtonClick(){
	var todoText = document.getElementById('todoText');
	var newTask = theTask(todoText.value);

	if(todoText.value == '')
		return;

	todoText.value = '';
	addTodo(newTask, function() {
		updateCounter();
		output(appState);
	});
} 

function onToggleItem(divItem) {
	var id = divItem.attributes['data-task-id'].value;
	var taskList = appState.taskList;

	for(var i = 0; i < taskList.length; i++) {
		if(taskList[i].id != id)
			continue;

		toggle(taskList[i], function() {
			updateItem(divItem, taskList[i]);
			output(taskList);
		});

		return;
	}
}

function toggle(task, continueWith) {
	task.done = !task.done;
	put(appState.mainUrl + '?id=' + task.id, JSON.stringify(task), function() {
		continueWith();
	});
}

function updateItem(divItem, task){
	if(task.done) {
		divItem.classList.add('strikeout');
		divItem.firstChild.checked = true;
	} else {
		divItem.classList.remove('strikeout');
		divItem.firstChild.checked = false;
	}

	divItem.setAttribute('data-task-id', task.id);
	divItem.lastChild.textContent = task.description;
}

function addTodo(task, continueWith) {
	post(appState.mainUrl, JSON.stringify(task), function(){
		restore();
	});
}

function addTodoInternal(task) {
	var item = createItem(task);
	var items = document.getElementsByClassName('items')[0];
	var taskList = appState.taskList;

	taskList.push(task);
	items.appendChild(item);
}

function createItem(task) {
	var temp = document.createElement('div');
	var htmlAsText = '<div class="item strikeout" data-task-id="идентификатор">'+
	'<input type="checkbox">описание задачи</div>';

	temp.innerHTML = htmlAsText;
	updateItem(temp.firstChild, task);

	return temp.firstChild;
}

function updateCounter(){
	var items = document.getElementsByClassName('items')[0];
	var counter = document.getElementsByClassName('counter-holder')[0];

	counter.innerText = items.children.length.toString();
}

function restore(continueWith) {
	var url = appState.mainUrl + '?token=' + appState.token;

	get(url, function(responseText) {
		console.assert(responseText != null);

		var response = JSON.parse(responseText);

		appState.token = response.token;
		createAllTasks(response.tasks);
		output(appState);
		updateCounter();

		continueWith && continueWith();
	});
}

function output(value){
	var output = document.getElementById('output');

	output.innerText = JSON.stringify(value, null, 2);
}

function defaultErrorHandler(message) {
	console.error(message);
	output(message);
}

function get(url, continueWith, continueWithError) {
	ajax('GET', url, null, continueWith, continueWithError);
}

function post(url, data, continueWith, continueWithError) {
	ajax('POST', url, data, continueWith, continueWithError);	
}

function put(url, data, continueWith, continueWithError) {
	ajax('PUT', url, data, continueWith, continueWithError);	
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
	output(err.toString());
}