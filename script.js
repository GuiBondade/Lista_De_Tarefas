// Event Listener: executa a função loadTasks() automaticamente quando a página termina de carregar.
// Isso garante que as tarefas salvas no localStorage sejam exibidas assim que o usuário acessar a página.
document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
  const input = document.getElementById("taskInput");
  const taskText = input.value.trim();

  if (taskText === "") return;

  const task = {
    text: taskText,
    completed: false
  };

  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);
  input.value = "";
  renderTasks();
}

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks") || "[]");
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  const tasks = getTasks();
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    // Cria o span da tarefa e adiciona event listener para alternar concluída/não concluída
    const span = document.createElement("span");
    span.textContent = task.text;
    span.style.cursor = "pointer";
    span.addEventListener("click", () => toggleTask(index));

    // Cria o botão de remover e adiciona event listener para remover a tarefa
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remover";
    removeBtn.addEventListener("click", () => removeTask(index));

    li.appendChild(span);
    li.appendChild(removeBtn);
    taskList.appendChild(li);
  });
}

function toggleTask(index) {
  const tasks = getTasks();
  tasks[index].completed = !tasks[index].completed;
  saveTasks(tasks);
  renderTasks();
}

function removeTask(index) {
  const tasks = getTasks();
  tasks.splice(index, 1);
  saveTasks(tasks);
  renderTasks();
}

function markAllCompleted() {
  const tasks = getTasks().map(task => ({ ...task, completed: true }));
  saveTasks(tasks);
  renderTasks();
}

function clearAll() {
  localStorage.removeItem("tasks");
  renderTasks();
}

function loadTasks() {
  renderTasks();

  // Adiciona event listener ao botão "Adicionar"
  document.querySelector('.input-section button').addEventListener("click", addTask);

  // Adiciona event listener ao botão "Marcar Todas Concluídas"
  document.querySelector('.controls button:nth-child(1)').addEventListener("click", markAllCompleted);

  // Adiciona event listener ao botão "Remover Todas"
  document.querySelector('.controls button:nth-child(2)').addEventListener("click", clearAll);

  // Adiciona event listener para adicionar tarefa ao pressionar Enter no input
  document.getElementById("taskInput").addEventListener("keydown", function(e) {
    if (e.key === "Enter") addTask();
  });
}
