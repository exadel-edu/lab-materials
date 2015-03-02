function run(){
	var appContainer = document.getElementsByClassName('todos')[0];

	appContainer.addEventListener('click', delegateEvent);
	appContainer.addEventListener('change', delegateEvent);

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

function onAddButtonClick(){
	var todoText = document.getElementById('todoText');

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
	var items = document.getElementsByClassName('items')[0];

	items.appendChild(item);
	updateCounter();
}

function createItem(text){
	var divItem = document.createElement('div');
	var checkbox = document.createElement('input');

	divItem.classList.add('item');
	checkbox.classList.add('todo-toggler');
	checkbox.setAttribute('type', 'checkbox');

	divItem.appendChild(checkbox);
	divItem.appendChild(document.createTextNode(text));

	return divItem;
}

function updateCounter(){
	var count = 0;
	var items = document.getElementsByClassName('items')[0];
	var counter = document.getElementsByClassName('counter-holder')[0];

	for(var i = 0; i < items.childNodes.length; i++) {
		var node = items.childNodes[i];

		if(node.nodeName != '#text' && node.classList.contains('item')){
			count++;
		}
	}

	counter.innerText = count.toString();
}
