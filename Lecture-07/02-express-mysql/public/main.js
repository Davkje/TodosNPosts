const todosList = document.getElementById("todos");
const postsList = document.getElementById("posts");

const todoSearch = document.getElementById("todoSearch");
const postSearch = document.getElementById("postSearch");

const todoSort = document.getElementById("todoSort");
const postSort = document.getElementById("postSort");

// Get Todos
async function fetchTodos(search = "", sort = "asc") {
  try {
    const res = await fetch(`http://localhost:3000/todos?search=${encodeURIComponent(search)}&sort=${sort}`);
    const todos = await res.json();
    renderTodos(todos); // Rendera todos
  } catch (error) {
    console.error("Fel vid hämtning av todos:", error);
  }
}

// Get posts
async function fetchPosts(search = "", sort = "asc") {
  try {
    const res = await fetch(`http://localhost:3000/posts?search=${encodeURIComponent(search)}&sort=${sort}`);
    const posts = await res.json();
    renderPosts(posts); // Rendera posts
  } catch (error) {
    console.error("Fel vid hämtning av posts:", error);
  }
}

function renderTodos(todos) {
  todosList.innerHTML = "";

  todos.forEach((todo) => {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo-card");

    const status = todo.done === 1 ? "Done" : "Not done"

    todoDiv.innerHTML = `
      <h3>${todo.content}</h3>
      <p>${status}</p>
    `;

    todosList.appendChild(todoDiv);
  });
}

// Ny renderPosts-funktion
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