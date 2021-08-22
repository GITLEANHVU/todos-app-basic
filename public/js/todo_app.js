const todoText = document.querySelector('#todoText');
const todoTextChanged = document.querySelector('#todoTextChanged');
const buttonAddTodo = document.querySelector('#buttonAddTodo');
const buttonSaveChange = document.querySelector('#buttonSaveChange');
const listTodo = document.querySelector('#listTodo');
const formTodo = document.querySelector('#formTodo');
let todoTextValue = '';
let listTodoValue = JSON.parse(localStorage.getItem('listTodoValue')) === null ?
  [] : JSON.parse(localStorage.getItem('listTodoValue'));
  console.log('listTodovalue', listTodoValue);
let idToEdit = '';

// show list
showTodoList(listTodoValue);

// lấy giá trị từ ô input. 
todoText.addEventListener('keyup', ({ target }) => {
  todoTextValue = target.value;
});

// sau khi click thêm mới vào danh sách. 
buttonAddTodo.addEventListener('click', (event) => {
  if (todoTextValue !== '') {
    common();
  }
});

// form submit
formTodo.addEventListener('submit', (event) => {
  event.preventDefault();
  if (todoTextValue !== '') {
    common();
  }
});


// common
function common() {
  const uuid = generateUUID();
  listTodoValue.push({ id: uuid, todoTextValue: todoTextValue, checked: false });
  todoTextValue = '';
  todoText.value = '';
  showTodoList(listTodoValue);
  window.localStorage.setItem('listTodoValue', JSON.stringify(listTodoValue))
}

// hiển thị danh sách todo lên.
function showTodoList(listTodoValue = []) {

  listTodo.innerHTML = '';
  listTodoValue.forEach((value) => {
    
    listTodo.innerHTML += `
      <li class="list-group-item ">
        <label class="${value.checked ? 'text-decoration-line-through' : ''}">
          <input onclick="clickChecked(this)" data-id="${value.id}"  class="form-check-input me-1" type="checkbox" ${value.checked ? 'checked' : ''} />
          ${value.todoTextValue}
        </label>
        <div style="display: inline-block; float: right;">
          <span data-id="${value.id}" onclick="handleEdit(this)" data-bs-toggle="modal"data-bs-target="#exampleModal" class="material-icons editTodo" style="cursor: pointer">
            edit
          </span>
          <span data-id="${value.id}" onclick="handleDelete(this)" class="material-icons deleteTodo" style="cursor: pointer">
            delete
          </span>
        </div>
      </li>
      `
  });
}

// save todo
buttonSaveChange.addEventListener('click', (event) => {
  event.preventDefault();
  const cloneTodoList = listTodoValue;
  const newTodoList = cloneTodoList.map(todo => {
    if (todo.id === idToEdit) {
      return { ...todo, todoTextValue: todoTextChanged.value }
    }
    return todo;
  });
  listTodoValue = newTodoList;
  showTodoList(newTodoList);
  window.localStorage.setItem('listTodoValue', JSON.stringify(listTodoValue))
});

// clickChecked
function clickChecked(thisValue) {
  if (thisValue.checked === true) {
    thisValue.parentNode.classList.add('text-decoration-line-through');
  } else {
    thisValue.parentNode.classList.remove('text-decoration-line-through');
  }
  const id = thisValue.dataset.id;
  const cloneTodoList = listTodoValue;
  const newTodoList = cloneTodoList.map(todo => {
    if (todo.id === id) {
      return { ...todo, checked: true}
    }
    return todo;
  });
  
  listTodoValue = newTodoList;
  window.localStorage.setItem('listTodoValue', JSON.stringify(listTodoValue))
}

// handle edit todo
function handleEdit(thisValue) {
  const id = thisValue.dataset.id;
  idToEdit = id;
  const cloneTodoList = listTodoValue;
  const getTodoByID = cloneTodoList.find(todo => todo.id === id);
  todoTextChanged.value = getTodoByID.todoTextValue;
}

// delete todo
function handleDelete(thisValue) {
  const id = thisValue.dataset.id;
  const cloneTodoList = listTodoValue;
  const newTodoList = cloneTodoList.filter(todo => todo.id !== id);
  listTodoValue = newTodoList;

  showTodoList(newTodoList);
  window.localStorage.setItem('listTodoValue', JSON.stringify(listTodoValue))
}

// uuid
function generateUUID() { // Public Domain/MIT
  var d = new Date().getTime();//Timestamp
  var d2 = (performance && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16;//random number between 0 and 16
    if (d > 0) {//Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {//Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

