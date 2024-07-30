const c = console.log.bind();

const taskInput = document.getElementById("task-input");
const addButton = document.getElementById("add-button");
const editButton = document.getElementById("edit-button");
const alertMessage = document.getElementById("alert-message");
const todosBody = document.getElementById("todos-container");
const deleteAllButton = document.getElementById("delete-all-button");
const filterButtons = document.querySelectorAll(".filter-todos");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let processTodo = [...todos];
let process = "all";
// localStorage.clear()
c(todos);
const selected = () => {
  filterButtons.forEach((button) => {
    button.className = "filter-todos";
    if (process === button.dataset.filter) {
      button.classList.add("selected");
    }
  });
};
const saveToLocalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};
const generateId = () => {
  return Math.round(Math.random() * Math.pow(10, 5)).toString();
};
const showAlert = (message, type) => {
  alertMessage.innerHTML = "";
  const alert = document.createElement("p");
  alert.innerText = message;
  alert.classList.add("alert");
  alert.classList.add(`${type}`);
  alertMessage.append(alert);

  setTimeout(() => {
    alert.style.display = "none";
  }, 1500);
};

const displayTodos = (data) => {
  const todosList = data || todos;
  todosBody.innerHTML = "";
  c(todosList);
  if (!todosList.length) {
    todosBody.innerHTML = `
      <div class="todo empty">No task found!</div>`;
  }

  todosList.forEach((todo) => {
    let check = todo.completed ? "checked" : "";
    todosBody.innerHTML += `
        <div class="todo">
            <input type="checkbox" onclick="toggleHandler('${todo.id}')" ${check}>
            <p class="${check}">${todo.task}</p>
            <button onclick="editHandler('${todo.id}');">Edit</button>
            <button onclick = "deleteHandler('${todo.id}')" class="disable">Delete</button>
        </div>
    `;
  });
};
const addHandler = () => {
  const task = taskInput.value;
  const todo = {
    id: generateId(),
    task,
    completed: false,
  };
  if (task) {
    todos.push(todo);
    filterHandler(process);
    taskInput.value = "";
    showAlert("Todo added successfully", "success");
    saveToLocalStorage();
  } else {
    showAlert("Please enter a valid input!", "error");
  }
};
const deleteHandler = (id) => {
  const newTodos = todos.filter((todo) => todo.id !== id);
  todos = newTodos;
  saveToLocalStorage();
  filterHandler(process);
  showAlert("Todo deleted successfully", "success");
};
const toggleHandler = (id) => {
  const todo = todos.find((todo) => todo.id === id);
  todo.completed = !todo.completed;
  saveToLocalStorage();
  filterHandler(process);
  showAlert("Todo status changed successfully", "success");
  taskInput.value = "";

  addButton.style.display = "inline-block";
  editButton.style.display = "none";
};
const editHandler = (id) => {
  const todo = todos.find((todo) => todo.id === id);
  c(todo);
  taskInput.value = todo.task;
  addButton.style.display = "none";
  editButton.style.display = "inline-block";
  editButton.dataset.id = id;

  const disableBtns = document.querySelectorAll(".disable");
  disableBtns.forEach((button) => {
    if (todo.task === button.parentElement.children[1].innerText) {
      button.style.display = "none";
    }
  });
};
const applyEditHandler = (e) => {
  const id = e.target.dataset.id;
  const todo = todos.find((todo) => todo.id === id);
  todo.task = taskInput.value;
  saveToLocalStorage();
  displayTodos();
  showAlert("Task edited successfully", "success");
  taskInput.value = "";

  addButton.style.display = "inline-block";
  editButton.style.display = "none";

  const disableBtns = document.querySelectorAll(".disable");
  disableBtns.forEach((button) => {
    button.style.display = "block";
  });
};
const filterHandler = (e) => {
  let filteredTodos = null;
  // c(filter);
  switch (e) {
    case "pending":
      filteredTodos = todos.filter((todo) => todo.completed === false);
      process = "pending";
      break;
    case "completed":
      filteredTodos = todos.filter((todo) => todo.completed === true);
      process = "completed";
      break;
    default:
      filteredTodos = todos;
      process = "all";
      break;
  }
  displayTodos(filteredTodos);
  selected();
};

const deleteAllHandler = () => {
  if (todos.length) {
    todos = [];
    saveToLocalStorage();
    displayTodos();
    showAlert("All tasks cleared successfully", "success");
  } else {
    showAlert("No task to clear", "error");
  }
};
window.addEventListener("load", () => displayTodos());
addButton.addEventListener("click", addHandler);
deleteAllButton.addEventListener("click", deleteAllHandler);
editButton.addEventListener("click", applyEditHandler);
filterButtons.forEach((button) => {
  button.addEventListener("click", (e) =>
    filterHandler(e.target.dataset.filter)
  );
});
