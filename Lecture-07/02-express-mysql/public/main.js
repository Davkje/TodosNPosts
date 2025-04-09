const todosList = document.getElementById("todos");
const postsList = document.getElementById("posts");

const todoSearch = document.getElementById("todoSearch");
const postSearch = document.getElementById("postSearch");

const todoSort = document.getElementById("todoSort");
const postSort = document.getElementById("postSort");

// GET TODOS
async function fetchTodos(search = "", sort = "asc") {
  try {
    const res = await fetch(`http://localhost:3000/todos?search=${encodeURIComponent(search)}&sort=${sort}`);
    const todos = await res.json();
    renderTodos(todos); // Rendera todos
  } catch (error) {
    console.error("Fel vid hämtning av todos:", error);
  }
}

async function fetchTodoWithSubtasks(id) {
  try {
    const res = await fetch(`http://localhost:3000/todos/${id}`);
    const todo = await res.json();
    renderTodoDetails(todo);
  } catch (error) {
    console.error("Fel vid hämtning av todo med subtasks:", error);
  }
}

// GET POSTS
async function fetchPosts(search = "", sort = "asc") {
  try {
    const res = await fetch(`http://localhost:3000/posts?search=${encodeURIComponent(search)}&sort=${sort}`);
    const posts = await res.json();
    renderPosts(posts); // Rendera posts
  } catch (error) {
    console.error("Fel vid hämtning av posts:", error);
  }
}

// ------------------ RENDER -------------------

// RENDER TODOS
function renderTodos(todos) {
  todosList.innerHTML = "";

  todos.forEach((todo) => {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo-card");
    todoDiv.style.cursor = "pointer";

    const status = todo.done === 1 ? "✅ Done" : "❌ Not done";

    todoDiv.innerHTML = `
      <h3>${todo.content}</h3>
      <p class="todo-status">${status}</p>
    `;

    // Klick-event
    todoDiv.addEventListener("click", () => {
      fetchTodoWithSubtasks(todo.id);
    });

    todosList.appendChild(todoDiv);
  });
}

function renderTodoDetails(todo) {
  const todoDetailContainer = document.createElement("div");
  todoDetailContainer.classList.add("todo-details");

  // Skapa HTML för subtasks om de finns
  let subtasksSection = "";
  if (todo.subtasks && todo.subtasks.length > 0) {
    let subtasksHTML = "<ul>";
    todo.subtasks.forEach(subtask => {
      const status = subtask.done === 1 ? "✅" : "❌";
      subtasksHTML += `<li>${status} ${subtask.content}</li>`;
    });
    subtasksHTML += "</ul>";
    subtasksSection = `<h4>Subtasks</h4>${subtasksHTML}`;
  }

  // Lägg in allt i todo-detaljer
  todoDetailContainer.innerHTML = `
    <h3>${todo.content}</h3>
    <h4>Status</h4> 
    <p class="todo-status">${todo.done === 1 ? "✅ Done" : "❌ Not Done"}</p>
    ${subtasksSection}
  `;

  // Byt ut innehållet i todosList mot den valda todo:n
  todosList.innerHTML = "";
  todosList.appendChild(todoDetailContainer);

  // Lägg till tillbaka-knappen
  const backButton = document.createElement("button");
  backButton.textContent = "Stäng";
  backButton.classList.add("back-button");
  backButton.addEventListener("click", () => {
    fetchTodos(); // hämta alla igen
  });

  todoDetailContainer.appendChild(backButton);
}

// function renderTodoDetails(todo) {
//   const todoDetailContainer = document.createElement("div");
//   todoDetailContainer.classList.add("todo-details");

//   let subtasksHTML = "<ul>";
//   todo.subtasks.forEach(subtask => {
//     const status = subtask.done === 1 ? "✅" : "❌";
//     subtasksHTML += `<li>${status} ${subtask.content}</li>`;
//   });
//   subtasksHTML += "</ul>";

//   todoDetailContainer.innerHTML = `
//     <h3>${todo.content}</h3>
//     <p>Status: ${todo.done === 1 ? "✅ Done" : "❌ Not Done"}</p>
//     <h4>Subtasks</h4>
//     ${subtasksHTML}
//   `;

//   // Byt ut innehållet i todosList mot den valda todo:n
//   todosList.innerHTML = "";
//   todosList.appendChild(todoDetailContainer);

//   // Lägg till en tillbaka-knapp INUTI todoDetailContainer
//   const backButton = document.createElement("button");
//   backButton.textContent = "⬅ Tillbaka till alla todos";
//   backButton.classList.add("back-button");
//   backButton.addEventListener("click", () => {
//     fetchTodos(); // hämta alla igen
//   });

//   todoDetailContainer.appendChild(backButton); // Lägg den sist i detaljvyn
// }


// RENDER POSTS
function renderPosts(posts) {
  postsList.innerHTML = "";

  posts.forEach((post) => {
    const postDiv = document.createElement("div");
    postDiv.classList.add("post-card");

    postDiv.innerHTML = `
      <h3>${post.title}</h3>
      <p class="post-content">${post.content}</p>
      <p class="post-author">${post.author}</p>
    `;

    postsList.appendChild(postDiv);
  });
}

// Lyssna på input för Todo-sökning
todoSearch.addEventListener("input", (e) => {
  const search = e.target.value;
  const order = todoSort.value;
  fetchTodos(search, order);
});

// Lyssna på ändring av sorteringsordning för Todos
todoSort.addEventListener("change", (e) => {
  const order = e.target.value;
  const search = todoSearch.value;
  fetchTodos(search, order);
});

// Lyssna på input för Post-sökning
postSearch.addEventListener("input", (e) => {
  const search = e.target.value;
  const order = postSort.value;
  fetchPosts(search, order);
});

// Lyssna på ändring av sorteringsordning för Posts
postSort.addEventListener("change", (e) => {
  const order = e.target.value;
  const search = postSearch.value;
  fetchPosts(search, order);
});

// Initial fetch
fetchTodos();
fetchPosts();