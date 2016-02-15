function run(){
	var appContainer = document.getElementsByClassName('todos')[0];

	appContainer.addEventListener('click', delegateEvent);
	appContainer.addEventListener('change', delegateEvent);

	updateCounter();
}

function delegateEvent(evtObj) {
	if(evtObj.type === 'click' && evtObj.target.classList.contains('todo-button')){
		onAddButtonClick(evtObj);
	}
	if(evtObj.type === 'change' && evtObj.target.nodeName == 'INPUT'){
		var labelEl = evtObj.target.parentElement;

		onToggleItem(labelEl);
	}
}

function onAddButtonClick(){
	var todoText = document.getElementById('todoText');

	addTodo(todoText.value);
	todoText.value = '';
	updateCounter();
} 

function onToggleItem(labelEl) {
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
	var divItem = document.createElement('li');
	var checkbox = document.createElement('input');
	checkbox.classList.add('item-check');

	divItem.classList.add('item');
	checkbox.setAttribute('type', 'checkbox');

	divItem.appendChild(checkbox);
	divItem.appendChild(document.createTextNode(text));

	return divItem;
}

function updateCounter(){
	var items = document.getElementsByClassName('items')[0];
	var counter = document.getElementsByClassName('counter-holder')[0];

    counter.innerText = items.children.length.toString();
}