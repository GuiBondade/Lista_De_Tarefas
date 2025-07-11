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
  changeTaskAmount(1);
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

  // Atualiza o total de tarefas e a cor do modo de exibição a partir do localStorage
  document.getElementById("tasksTotal").textContent = localStorage.getItem("taskAmount") || 0;
  changeExibitionMode(localStorage.getItem("corExibitionMode"));

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
  changeTaskAmount(-1);
  renderTasks();
}

function markAllCompleted() {
  const tasks = getTasks().map(task => ({ ...task, completed: true }));
  saveTasks(tasks);
  renderTasks();
}

function clearAll() {
  localStorage.removeItem("tasks");
  // reseseta o total de tarefas para 0, e remove o item do localStorage
  document.getElementById("tasksTotal").textContent = 0;
  localStorage.removeItem("taskAmount");
  renderTasks();
}

function white_mode() {
  changeExibitionMode("white_mode");
}

function purple_mode() {
  changeExibitionMode("purple_mode");
}

function changeExibitionMode(cor) {
  const body = document.body;
  // salva no localStorage a cor do modo de exibição como a cor do botao clickado
  localStorage.setItem("corExibitionMode", cor);
  // caso a botao clickado seja o da mesma cor do modo atual
  if (body.classList.contains(cor)) {
    // remove a cor atual e deixa preto, salvando no localStorage, que é preto
    body.classList.remove(cor);
    body.classList.add("black_mode");
    localStorage.setItem("corExibitionMode", "black_mode");
    // caso a cor atual seja preto
  } else if (body.classList.contains("black_mode")) {
    // tira o preto e coloca a cor clickada
    body.classList.remove("black_mode");
    body.classList.add(cor);
    // caso a cor do botão clickado não seja nem preta, nem a atual 
  } else {
    // descobre qual a cor atual (cor oposta), e aremove e adiciona a da clickada
    let corOposta = ["white_mode", "purple_mode"].filter(color => color !== cor);
    body.classList.remove(corOposta);
    body.classList.add(cor);
  } 
}

function changeTaskAmount(amount) {
  totalAmount = parseInt(document.getElementById("tasksTotal").textContent) + amount;
  localStorage.setItem("taskAmount", totalAmount);
  document.getElementById("tasksTotal").textContent = localStorage.getItem("taskAmount") || 0;
}

function loadTasks() {
  renderTasks();

  // Adiciona event listener ao botão "Adicionar"
  document.querySelector('.input-section button').addEventListener("click", addTask);

  // Adiciona event listener ao botão "Marcar Todas Concluídas"
  document.querySelector('.controls button:nth-child(1)').addEventListener("click", markAllCompleted);

  // Adiciona event listener ao botão "Remover Todas"
  document.querySelector('.controls button:nth-child(2)').addEventListener("click", clearAll);

  // Adiciona event listener ao botão que troca o modo de exibição para branco
  document.getElementById('whiteModeBtn').addEventListener("click", white_mode);

  // Adiciona event listener ao botão que troca o modo de exibição para roxo
  document.getElementById('purpleModeBtn').addEventListener("click", purple_mode);

  // Adiciona event listener para adicionar tarefa ao pressionar Enter no input
  document.getElementById("taskInput").addEventListener("keydown", function(e) {
    if (e.key === "Enter") addTask();
  });
}
