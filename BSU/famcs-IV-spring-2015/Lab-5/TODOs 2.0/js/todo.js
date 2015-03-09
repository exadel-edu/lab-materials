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

var taskList = [];

function run(){
	var appContainer = document.getElementsByClassName('todos')[0];

	appContainer.addEventListener('click', delegateEvent);
	appContainer.addEventListener('change', delegateEvent);

	var allTasks = restore() || [ theTask('Сделать разметку', true),
			theTask('Выучить JavaScript', true),
			theTask('Написать чат !')
		];

	createAllTasks(allTasks);
	updateCounter();
}

function createAllTasks(allTasks) {
	for(var i = 0; i < allTasks.length; i++)
		addTodo(allTasks[i]);
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

	addTodo(newTask);
	todoText.value = '';
	updateCounter();
	store(taskList);
} 

function onToggleItem(divItem) {
	var id = divItem.attributes['data-task-id'].value;

	for(var i = 0; i < taskList.length; i++) {
		if(taskList[i].id != id)
			continue;

		toggle(taskList[i]);
		updateItem(divItem, taskList[i]);
		store(taskList);

		return;
	}
}

function toggle(task) {
	task.done = !task.done;
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

function addTodo(task) {
	var item = createItem(task);
	var items = document.getElementsByClassName('items')[0];

	taskList.push(task);
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

function store(listToSave) {
	if(typeof(Storage) == "undefined") {
		alert('localStorage is not accessible');
		return;
	}

	localStorage.setItem("TODOs taskList", JSON.stringify(listToSave));
}

function restore() {
	if(typeof(Storage) == "undefined") {
		alert('localStorage is not accessible');
		return;
	}

	var item = localStorage.getItem("TODOs taskList");

	return item && JSON.parse(item);
}
