'use strict';

var taskList = [];

function run(){
	var appContainer = document.getElementsByClassName('todos')[0];

	appContainer.addEventListener('click', delegateEvent);
	appContainer.addEventListener('change', delegateEvent);
	appContainer.addEventListener('dblclick', delegateEvent);

	taskList = loadTasks() || [
			newTask('Сделать разметку', true),
			newTask('Выучить JavaScript', true),
			newTask('Написать чат !')
		];

	render(taskList);
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

function onItemDoubleClick(element) {
	var index = indexByElement(element, taskList);

	taskList.splice(index, 1);
	saveTasks(taskList);
	
	render(taskList);
}

function onAddButtonClick(){
	var todoText = document.getElementById('todoText');
	var task = newTask(todoText.value);

	if(todoText.value == '')
		return;

	taskList.push(task);
	saveTasks(taskList);

	todoText.value = '';
	render(taskList);
}

function onItemCheckboxChange(element) {
	var index = indexByElement(element, taskList);
	var task = taskList[index];

	task.done = !task.done;
	saveTasks(taskList);

	render(taskList);
}

function indexByElement(element, tasks){
	var id = element.attributes['data-task-id'].value;

	return tasks.findIndex(function(item) {
		return item.id == id;
	});
}

function render(tasks) {
	var items = document.getElementsByClassName('items')[0];
	var tasksMap = tasks.reduce(function(accumulator, task) {
		accumulator[task.id] = task;
	
		return accumulator;
	},{});
	var notFound = updateList(items, tasksMap);

	appendToList(items, tasks, tasksMap);
	removeFromList(items, notFound);
	renderLocalStorage(taskList);
	renderCounter(taskList);
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

function renderLocalStorage(value){
	var output = document.getElementById('output');

	output.innerText = "localStorage:\n" + JSON.stringify(value, null, 2) + ";";
}

function saveTasks(listToSave) {
	if(typeof(Storage) == "undefined") {
		alert('localStorage is not accessible');
		return;
	}

	localStorage.setItem("TODOs taskList", JSON.stringify(listToSave));
}

function loadTasks() {
	if(typeof(Storage) == "undefined") {
		alert('localStorage is not accessible');
		return;
	}

	var item = localStorage.getItem("TODOs taskList");

	return item && JSON.parse(item);
}

function uniqueId() {
	var date = Date.now();
	var random = Math.random() * Math.random();

	return Math.floor(date * random);
}

function newTask(text, done) {
	return {
		description:text,
		done: !!done,
		id: '' + uniqueId()
	};
}
