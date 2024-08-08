const list = document.querySelector(".list");
const form = document.querySelector("form");
const input = document.querySelector("form > input");

const todos = [
  { text: "faire les courses", done: false, editMode: false },
  { text: "partir au sport", done: true, editMode: false },
];

const getTodo = () => {
  list.innerHTML = "";
  list.append(
    ...todos.map((todo, index) =>
      todo.editMode
        ? createEditTodoItem(todo, index)
        : createTodoItem(todo, index)
    )
  );
};

const createTodoItem = (todo, index) => {
  const li = document.createElement("li");
  li.classList.add("tache");
  li.innerHTML = `
    <div class="name-tache">
      <span class="todo ${todo.done ? "done" : ""}"></span>
      <h1 class="${todo.done ? "done" : ""}">${todo.text}</h1>
    </div>
    <div class="emojis">
      <div class="edit">${editSvg}</div>
      <div class="trash">${trashSvg}</div>
    </div>
  `;
  li.querySelector(".edit").onclick = () => toggleEditMode(index);
  li.querySelector(".trash").onclick = () => removeTodo(index);
  li.onclick = () => toggleDone(index);
  return li;
};

const createEditTodoItem = (todo, index) => {
  const li = document.createElement("li");
  li.classList.add("tache");
  li.innerHTML = `
    <input type="text" value="${todo.text}">
    <div class="emojis">
      <div class="edit">${editSvg}</div>
      <div class="trash">${trashSvg}</div>
    </div>
  `;
  li.querySelector(".edit").onclick = () =>
    saveEdit(index, li.querySelector("input").value);
  li.querySelector(".trash").onclick = () => removeTodo(index);
  return li;
};

const editSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="0.5" stroke="currentColor" class="size-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
  </svg>
`;

const trashSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="0.5" stroke="currentColor" class="size-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
  </svg>
`;

const removeTodo = (index) => {
  todos.splice(index, 1);
  getTodo();
};

const toggleDone = (index) => {
  todos[index].done = !todos[index].done;
  getTodo();
};

const toggleEditMode = (index) => {
  todos[index].editMode = !todos[index].editMode;
  getTodo();
};

const saveEdit = (index, text) => {
  todos[index].text = text;
  toggleEditMode(index);
};

form.onsubmit = (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text) {
    todos.push({ text, done: false, editMode: false });
    input.value = "";
    getTodo();
  }
};

getTodo();
