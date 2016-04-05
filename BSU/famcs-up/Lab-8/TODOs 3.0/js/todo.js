'use strict';

var Application = {
	mainUrl : 'http://localhost:1555/todos',
	taskList:[],
	token : 'TE11EN'
};

function newTask(text, done) {
	return {
		description:text,
		done: !!done,
		id: '' + uniqueId()
	};
}

function run(){
	var appContainer = document.getElementsByClassName('todos')[0];

	appContainer.addEventListener('click', delegateEvent);
	appContainer.addEventListener('change', delegateEvent);
	appContainer.addEventListener('dblclick', delegateEvent);

	loadTasks(function(){
		render(Application);
	});
}

function delegateEvent(evtObj) {
	if(evtObj.type === 'dblclick'
		&& evtObj.target.classList.contains('item'))
		onItemDoubleClick(evtObj.target);
	if(evtObj.type === 'click'
		&& evtObj.target.classList.contains('todo-button'))
		onAddButtonClick();
	if(evtObj.type === 'change' 
		&& evtObj.target.nodeName == 'INPUT'
		&& evtObj.target.type == 'checkbox')
		onItemCheckboxChange(evtObj.target.parentElement);
}

function loadTasks(done) {
	var url = Application.mainUrl + '?token=' + Application.token;

	ajax('GET', url, null, function(responseText){
		var response = JSON.parse(responseText);

		Application.taskList = response.tasks;
		Application.token = response.token;
		done();
	});
}

function deleteTask(id, done) {
	var index = indexById(Application.taskList, id);
	var task = Application.taskList[index];
	var taskToDelete = {
		id:task.id
	};

	ajax('DELETE', Application.mainUrl, JSON.stringify(taskToDelete), function(){
		Application.taskList.splice(index, 1);
		done();
	});	
}

function addTask(text, done) {
	if(text == '' || text == null)
		return;

	var task = newTask(text);

	ajax('POST', Application.mainUrl, JSON.stringify(task), function(){
		Application.taskList.push(task);
		done();
	});
}

function toggleTask(id, done) {
	var index = indexById(Application.taskList, id);
	var task = Application.taskList[index];
	var taskToPut = {
		id:task.id, 
		done: !task.done,
		description:task.description
	};

	ajax('PUT', Application.mainUrl, JSON.stringify(taskToPut), function(){
		task.done = !task.done;
		done();
	});
}

function onItemDoubleClick(element) {
	var id = idFromElement(element);

	deleteTask(id, function() {
		render(Application);
	});
}

function onAddButtonClick(){
	var todoText = textValue();

	addTask(todoText, function() {
		render(Application);
	});
}

function onItemCheckboxChange(element) {
	var id = idFromElement(element);

	toggleTask(id, function() {
		render(Application);
	});
}

function textValue() {
	var todoTextElement = document.getElementById('todoText');
	var todoText = todoTextElement.value;

	todoTextElement.value = '';

	return todoText;
}

function indexById(list, id){
  for(var i = 0; i< list.length; i++) {
    if(list[i].id == id) {
      return i;
    }
  }
  return -1;
}

function idFromElement(element){
	return element.attributes['data-task-id'].value;
}

function render(root) {
	var items = document.getElementsByClassName('items')[0];
	var tasksMap = root.taskList.reduce(function(accumulator, task) {
		accumulator[task.id] = task;
	
		return accumulator;
	},{});
	var notFound = updateList(items, tasksMap);
	removeFromList(items, notFound);
	appendToList(items, root.taskList, tasksMap);

	renderDebug(root);
	renderCounter(root.taskList);
}

function renderTaskState(element, task){
	if(task.done) {
		element.classList.add('strikeout');
		element.firstElementChild.checked = true;
	} else {
		element.classList.remove('strikeout');
		element.firstElementChild.checked = false;
	}

	element.setAttribute('data-task-id', task.id);
	element.lastChild.textContent = task.description;
}

function updateList(element, itemMap) {
	var children = element.children;
	var notFound = [];
	
	for(var i = 0; i < children.length; i++) {
		var child = children[i];
		var id = child.attributes['data-task-id'].value;
		var item = itemMap[id];
		
		if(item == null) {
			notFound.push(child);
			continue;
		}
		
		renderTaskState(child, item);
		itemMap[id] = null;
	}
	
	return notFound;
}

function appendToList(element, items, itemMap) {
	for(var i = 0; i < items.length; i++) {
		var item = items[i];
		
		if(itemMap[item.id] == null) {
			continue;
		}
		itemMap[item.id] = null;
		
		var child = elementFromTemplate();
		
		renderTaskState(child, item);
		element.appendChild(child);
	}
}

function removeFromList(element, children) {
	for(var i = 0; i < children.length; i++) {
		element.removeChild(children[i]);
	}
}

function elementFromTemplate() {
	var template = document.getElementById("task-template");

	return template.firstElementChild.cloneNode(true);
}

function renderCounter(tasks){
	var counter = document.getElementById('counter-holder');

	counter.innerText = tasks.length.toString();
}

function renderDebug(value){
	var output = document.getElementById('output');

	output.innerText = JSON.stringify(value, null, 2) + ";";
}

function uniqueId() {
	var date = Date.now();
	var random = Math.random() * Math.random();

	return Math.floor(date * random);
}

function output(value){
	var output = document.getElementById('output');

	output.innerText = JSON.stringify(value, null, 2);
}

function defaultErrorHandler(message) {
	console.error(message);
	output(message);
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
    };

    xhr.onerror = function (e) {
    	var errMsg = 'Server connection error !\n'+
    	'\n' +
    	'Check if \n'+
    	'- server is active\n'+
    	'- server sends header "Access-Control-Allow-Origin:*"\n'+
    	'- server sends header "Access-Control-Allow-Methods: PUT, DELETE, POST, GET, OPTIONS"\n';

        continueWithError(errMsg);
    };

    xhr.send(data);
}

window.onerror = function(err) {
	output(err.toString());
};
