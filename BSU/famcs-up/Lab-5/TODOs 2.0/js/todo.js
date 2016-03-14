'use strict';

var taskList = [];

function run(){
	var appContainer = document.getElementsByClassName('todos')[0];

	appContainer.addEventListener('click', delegateEvent);
	appContainer.addEventListener('change', delegateEvent);
	appContainer.addEventListener('dblclick', delegateEvent);

	taskList = loadTasks() || [ newTask('Сделать разметку', true),
			newTask('Выучить JavaScript', true),
			newTask('Написать чат !')
		];

	render(taskList);
}

function render(tasks) {
	for(var i = 0; i < tasks.length; i++) {
		renderTask(tasks[i]);
	}

	renderLocalStorage(taskList);
	renderCounter(taskList);
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
	element.parentElement.removeChild(element);
	renderCounter(taskList);
	renderLocalStorage(taskList);
	saveTasks(taskList);
}

function onAddButtonClick(){
	var todoText = document.getElementById('todoText');
	var task = newTask(todoText.value);

	if(todoText.value == '')
		return;

	taskList.push(task);
	todoText.value = '';
	render([task]);
	saveTasks(taskList);
}

function onItemCheckboxChange(element) {
	var index = indexByElement(element, taskList);
	var task = taskList[index];

	task.done = !task.done;
	renderTaskState(element, task);
	renderLocalStorage(taskList);
	saveTasks(taskList);
}

function indexByElement(element, tasks){
	var id = element.attributes['data-task-id'].value;

	return tasks.findIndex(function(item) {
		return item.id == id;
	});
}

function renderTaskState(element, task){
	if(task.done) {
		element.classList.add('strikeout');
		element.firstChild.checked = true;
	} else {
		element.classList.remove('strikeout');
		element.firstChild.checked = false;
	}

	element.setAttribute('data-task-id', task.id);
	element.lastChild.textContent = task.description;
}

function renderTask(task){
	var items = document.getElementsByClassName('items')[0];
	var element = elementFromTemplate();

	renderTaskState(element, task);
	items.appendChild(element);
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

	return Math.floor(date * random).toString();
}

function newTask(text, done) {
	return {
		description:text,
		done: !!done,
		id: uniqueId()
	};
}
