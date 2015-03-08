var uniqueId = function() {
	var date = Date.now();

	var random = Math.random() * Math.random();

	return Math.floor(date * random);
};

var theTask = function(text, done) {
	return {
		description:text,
		done:done,
		id: uniqueId()
	};
};

var taskList = null;

function run(){
	taskList = restore() || [ theTask('Сделать разметку', true),
	theTask('Выучить JavaScript', true),
	theTask('Написать чат !', false)
	];

	var appContainer = document.getElementsByClassName('todos')[0];

	appContainer.addEventListener('click', delegateEvent);
	appContainer.addEventListener('change', delegateEvent);

	createAllTasks();
	updateCounter();
}

function createAllTasks() {
	for(var i = 0; i < taskList.length; i++) {
		addTodo(taskList[i]);
	}
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

	if(todoText.value == '')
		return;

	var newTask = theTask(todoText.value, false);

	taskList.push(newTask);
	addTodo(newTask);
	todoText.value = '';
	updateCounter();
	store();
} 

function onToggleItem(divItem) {
	var id = getIdOfTask(divItem);

	for(var i = 0; i < taskList.length; i++) {
		if(taskList[i].id != id)
			continue;

		toggle(divItem, taskList[i]);
		store();
		return;
	}
}

function toggle(divItem, task) {
	task.done = !task.done;
	updateItem(divItem, task);
}

function updateItem(divItem, task){
	if(task.done) {
		divItem.classList.add('strikeout');
		divItem.firstChild.checked = true;
	} else {
		divItem.classList.remove('strikeout');
		divItem.firstChild.checked = false;
	}

	divItem.setAttribute('data-task-id', task.id.toString());
	divItem.lastChild.textContent = task.description;
}

function getIdOfTask(divItem) {
	var dataTaskId = divItem.attributes['data-task-id'].value;

	return parseInt(dataTaskId);
}

function addTodo(task) {
	var item = createItem(task);
	var items = document.getElementsByClassName('items')[0];

	items.appendChild(item);
}

function createItem(task){
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

function store() {
	if(typeof(Storage) == "undefined") {
		alert('localStorage is not accessible');
		return;
	}

	localStorage.setItem("TODOs taskList", JSON.stringify(taskList));
}

function restore() {
	if(typeof(Storage) == "undefined") {
		alert('localStorage is not accessible');
		return;
	}

	var item = localStorage.getItem("TODOs taskList");

	if(item == null)
		return null;

	return JSON.parse(item);
}
