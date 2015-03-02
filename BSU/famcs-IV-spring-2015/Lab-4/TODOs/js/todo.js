var addButton;
var items;
var todoText;
var counter;

function run(){
	var appContainer = document.getElementsByClassName('todos')[0];

	appContainer.addEventListener('click', delegateEvent);
	appContainer.addEventListener('change', delegateEvent);
	todoText = document.getElementById('todoText');
	items = document.getElementsByClassName('items')[0];
	counter = document.getElementsByClassName('counter-holder')[0];

	updateCounter();
}

function delegateEvent(evtObj) {
	if(evtObj.type === 'click' && evtObj.target.classList.contains('btn-add')){
		onAddButtonClick(evtObj);
	}
	if(evtObj.type === 'change' && evtObj.target.classList.contains('todo-toggler')){
		onToggleItem(evtObj);
	}
}

function onAddButtonClick(evtObj){
	addTodo(todoText.value);
	todoText.value = '';
	updateCounter();
} 

function onToggleItem(evtObj) {
	var inputEl = evtObj.target;
	var labelEl = inputEl.parentElement;

	if(labelEl.classList.contains('strikeout')) {
		labelEl.classList.remove('strikeout');
	}
	else {
		labelEl.classList.add('strikeout');
	}
	updateCounter();
}

function addTodo(value) {
	if(!value){
		return;
	}

	var item = createItem(value);

	items.appendChild(item);
	updateCounter();
}

function createItem(text){
	var divItem = document.createElement('div');
	var label = document.createElement('label');
	var checkbox = document.createElement('input');

	divItem.classList.add('item');
	checkbox.classList.add('todo-toggler');
	checkbox.setAttribute('type', 'checkbox');

	divItem.appendChild(label);
	label.appendChild(checkbox);
	label.appendChild(document.createTextNode(text));

	return divItem;
}

function updateCounter(){
	var count = 0;

	for(var i = 0; i < items.childNodes.length; i++) {
		var node = items.childNodes[i];

		if(node.nodeName != '#text' && node.classList.contains('item')){
			count++;
		}
	}

	counter.innerText = count.toString();
}
