window.addEventListener("load", () => {
  todos = JSON.parse(localStorage.getItem("todos")) || [];
  const nameInput = document.querySelector("#name");
  const newTodoForm = document.querySelector("#new-todo-form");

  const username = localStorage.getItem("username") || "";

  nameInput.value = username;

  nameInput.addEventListener("change", (e) => {
    localStorage.setItem("username", e.target.value);
  });

  newTodoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let currDateTime = currentDateAndTime();
    if (e.target.elements.category.value === "") {
      Swal.fire({
        title: "Please select category..",
        icon: "error",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      }).then(() => {
        // displayTodos;
      });
    } else {
      const todoObj = {
        content: e.target.elements.content.value,
        category: e.target.elements.category.value,
        done: false,
        createdAt: new Date().getTime(),
        createdDateTime: currDateTime,
        updatedDateTime: currDateTime,
      };

      todos.push(todoObj);

      localStorage.setItem("todos", JSON.stringify(todos));

      // * : it will reset form
      e.target.reset();

      displayTodos();
    }
  });
  displayTodos();
});

function displayTodos() {
  const todoList = document.querySelector("#todo-list");

  todoList.innerHTML = ``;

  todos
    .sort((a, b) => b.createdAt - a.createdAt)
    .forEach((todo) => {
      const todoItemContainer = document.createElement("div");
      todoItemContainer.classList.add("todo-item-container");
      const todoItem = document.createElement("div");
      todoItem.classList.add("todo-item");

      const label = document.createElement("label");
      const input = document.createElement("input");
      const span = document.createElement("span");
      const content = document.createElement("div");
      const actions = document.createElement("div");
      const edit = document.createElement("button");
      const deleteButton = document.createElement("button");

      input.type = "checkbox";
      input.checked = todo.done;

      span.classList.add("bubble");

      if (todo.category == "personal") {
        span.classList.add("personal");
      } else {
        span.classList.add("business");
      }

      content.classList.add("todo-content");
      actions.classList.add("actions");
      edit.classList.add("edit");
      deleteButton.classList.add("delete");

      content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;

      edit.innerHTML = "Edit";
      deleteButton.innerHTML = "Delete";

      label.appendChild(input);
      label.appendChild(span);
      actions.appendChild(edit);
      actions.appendChild(deleteButton);
      todoItem.appendChild(label);
      todoItem.appendChild(content);
      todoItem.appendChild(actions);
      todoItemContainer.appendChild(todoItem);

      const timeContainer = document.createElement("div");
      timeContainer.classList.add("time-container");

      const createdAtDateTime = document.createElement("label");
      let currentDate = todo.createdDateTime.split("=>")[0].trim();
      let currentTime = todo.createdDateTime.split("=>")[1].trim();
      createdAtDateTime.innerHTML = `<b>Created At</b> : <b>Date</b> : ${currentDate} <b>Time</b> : ${currentTime}`;

      const updatedAtDateTime = document.createElement("label");
      if (todo.createdDateTime !== todo.updatedDateTime) {
        let updateDate = todo.updatedDateTime.split("=>")[0].trim();
        let updateTime = todo.updatedDateTime.split("=>")[1].trim();
        updatedAtDateTime.innerHTML = `<b>Updated At</b> : <b>Date</b> : ${updateDate} <b>Time</b> : ${updateTime}`;
      } else {
        updatedAtDateTime.innerHTML = "";
      }
      createdAtDateTime.classList.add("time");
      updatedAtDateTime.classList.add("time");

      timeContainer.appendChild(createdAtDateTime);
      timeContainer.appendChild(updatedAtDateTime);

      todoItemContainer.appendChild(timeContainer);

      todoList.appendChild(todoItemContainer);

      if (todo.done) {
        todoItem.classList.add("done");
      }

      input.addEventListener("change", (e) => {
        todo.done = e.target.checked;
        localStorage.setItem("todos", JSON.stringify(todos));

        if (todo.done) {
          todoItem.classList.add("done");
        } else {
          todoItem.classList.remove("done");
        }

        displayTodos();
      });

      edit.addEventListener("click", (e) => {
        const input = content.querySelector("input");
        input.removeAttribute("readonly");
        input.focus();
        input.addEventListener("blur", (e) => {
          input.setAttribute("readonly", true);
          if (todo.content != e.target.value) {
            todo.content = e.target.value;
            todo.createdAt = new Date().getTime();
            todo.updatedDateTime = currentDateAndTime();
            localStorage.setItem("todos", JSON.stringify(todos));
          }
          displayTodos();
        });
      });

      deleteButton.addEventListener("click", (e) => {
        todos = todos.filter((t) => t != todo);
        localStorage.setItem("todos", JSON.stringify(todos));
        displayTodos();
      });
    });
}

function currentDateAndTime() {
  const date = new Date();
  date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const ampm = hours >= 12 ? "PM" : "AM";

  const formattedTime =
    (hours % 12 < 10 ? "0" : "") +
    (hours % 12 || 12) +
    ":" +
    (minutes < 10 ? "0" : "") +
    minutes +
    ":" +
    (seconds < 10 ? "0" : "") +
    seconds +
    " " +
    ampm;

  const options = { month: "long", day: "2-digit", year: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);

  let finalString = `${formattedDate}=>${formattedTime}`;
  return finalString;
}

currentDateAndTime();
