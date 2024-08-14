import TasksService from "./tasks.service.js";

const list = document.querySelector(".list");
const form = document.querySelector("form");
const input = document.querySelector("form > input");

const todos = [
  {
    text: "faire les courses",
    done: false,
    EditMode: false,
  },
  {
    text: "partire au sport",
    done: true,
    EditMode: false,
  },
];

const tasks = [];

const taskService = TasksService(tasks);

function GetTodo() {
  const NewTodo = todos.map((todo, index) => {
    if (todo.EditMode) {
      return newEditTodo(todo, index);
    } else {
      return NewTodoList(todo, index);
    }
  });
  list.innerHTML = "";
  list.append(...NewTodo);
}
function NewTodoList(todo, index) {
  const tache = document.createElement("li");
  tache.classList.add("tache");
  const emojis = document.createElement("div");
  emojis.classList.add("emojis");

  const btnEdit = document.createElement("div");
  btnEdit.classList.add("edit");
  const btnSupp = document.createElement("div");
  btnSupp.classList.add("trash");

  btnSupp.onclick = () => {
    RemoveTodo(index);
    console.log("supp");
  };
  btnEdit.onclick = () => {
    console.log("edit");
    EditTodo(index);
  };
  btnEdit.innerHTML = `
<svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="0.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>

`;
  btnSupp.innerHTML = `
 <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="0.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>

`;
  tache.innerHTML = `
   <div class="name-tache">
            <span class="todo ${todo.done ? "done" : ""}"></span>
            <h1 class="${todo.done ? "done" : ""}">${todo.text}</h1>
          </div>
  `;
  tache.onclick = () => {
    ToggleTodo(index);
  };
  emojis.append(btnEdit, btnSupp);
  tache.append(emojis);
  return tache;
}
function newEditTodo(todo, index) {
  const tache = document.createElement("li");
  tache.classList.add("tache");
  const emojis = document.createElement("div");
  emojis.classList.add("emojis");
  const input = document.createElement("input");
  input.value = todo.text;
  input.type = "text";
  const btnEdit = document.createElement("div");
  btnEdit.classList.add("edit");
  const btnSave = document.createElement("div");
  btnSave.classList.add("trash");

  btnSave.onclick = () => {
    ToggleTodo(index);
    console.log("supp");
  };
  btnEdit.onclick = () => {
    console.log("edit");
    toggleEditTodo(input, index);
  };
  btnEdit.innerHTML = `
  <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="0.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
  
  `;
  btnSave.innerHTML = `
   <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="0.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
  
  `;

  emojis.append(input, btnEdit, btnSave);
  tache.append(emojis);
  return tache;
}

function RemoveTodo(index) {
  todos.splice(index, 1);
  GetTodo();
}
function ToggleTodo(index) {
  todos[index].done = !todos[index].done;
  GetTodo();
}
form.onsubmit = (e) => {
  e.preventDefault();
  const value = input.value;
  input.value = "";
  console.log(value);
  AddTodo(value);
};

function AddTodo(text) {
  todos.push({
    text,
    done: false,
  });
  GetTodo();
}
function EditTodo(index) {
  todos[index].EditMode = !todos[index].EditMode;
  GetTodo();
}
function toggleEditTodo(input, index) {
  const value = input.value;
  todos[index].text = value;
  todos[index].EditMode = !todos[index].EditMode;
  GetTodo();
}
GetTodo();
