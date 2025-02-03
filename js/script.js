// Отримуємо списки завдань із localStorage або створюємо початковий список "My workday"
const lists = JSON.parse(localStorage.getItem("todoLists")) || { "My workday": [] };
// Встановлюємо перший список як поточний
let currentList = Object.keys(lists)[0];

// Функція для збереження списків у localStorage
const saveLists = () => localStorage.setItem("todoLists", JSON.stringify(lists));

// Функція для завантаження списків у випадаючий список
const loadLists = () => {
  // Отримуємо елемент селектора списків
  const listSelector = document.getElementById("list-selector");
  // Генеруємо HTML-код для кожного списку за допомогою шаблонних рядків
  listSelector.innerHTML = Object.keys(lists)
    .map(list => `<option value="${list}" ${list === currentList ? "selected" : ""}>${list}</option>`)
    .join("");
  // При зміні вибраного списку оновлюємо currentList та UI
  listSelector.onchange = () => {
    currentList = listSelector.value;
    updateUI();
  };
  // Оновлюємо інтерфейс користувача
  updateUI();
};

// Функція для створення нового списку
const createNewList = () => {
  // Отримуємо введене ім'я нового списку та видаляємо зайві пробіли
  const listName = document.getElementById("new-list-name").value.trim();
  // Якщо ім'я не порожнє і такого списку ще не існує
  if (listName && !lists[listName]) {
    lists[listName] = []; // Створюємо новий список
    currentList = listName; // Встановлюємо його поточним
    saveLists();          // Зберігаємо зміни у localStorage
    loadLists();          // Оновлюємо випадаючий список і UI
  }
  // Очищаємо поле введення
  document.getElementById("new-list-name").value = "";
};

// Функція для видалення поточного списку
const deleteCurrentList = () => {
  // Якщо існує більше одного списку, можна видаляти
  if (Object.keys(lists).length > 1) {
    delete lists[currentList];        // Видаляємо поточний список
    currentList = Object.keys(lists)[0]; // Встановлюємо перший список як поточний
    saveLists();                       // Зберігаємо зміни
    loadLists();                       // Оновлюємо випадаючий список і UI
  } else {
    // Якщо залишився лише один список, показуємо повідомлення
    alert("You must have at least one list.");
  }
};

// Функція для додавання нового завдання до поточного списку
const addTask = () => {
  // Отримуємо елемент введення для завдання
  const taskInput = document.getElementById("new-task");
  // Отримуємо текст завдання і видаляємо зайві пробіли
  const taskName = taskInput.value.trim();
  // Якщо текст не порожній
  if (taskName) {
    // Додаємо завдання у поточний список з початковим станом completed: false
    lists[currentList].push({ name: taskName, completed: false });
    saveLists();  // Зберігаємо зміни
    updateUI();   // Оновлюємо інтерфейс
  }
  // Очищаємо поле введення
  taskInput.value = "";
};

// Функція для перемикання стану завдання (завершене/незавершене)
const toggleTask = index => {
  // Перемикаємо булеве значення поля completed для завдання за індексом
  lists[currentList][index].completed ^= true;
  saveLists();  // Зберігаємо зміни
  updateUI();   // Оновлюємо інтерфейс
};

// Функція для видалення завдання за індексом
const deleteTask = index => {
  // Видаляємо завдання з масиву поточного списку
  lists[currentList].splice(index, 1);
  saveLists();  // Зберігаємо зміни
  updateUI();   // Оновлюємо інтерфейс
};

// Функція для оновлення інтерфейсу користувача
const updateUI = () => {
  // Встановлюємо заголовок списку
  document.getElementById("list-title").textContent = currentList;
  // Генеруємо HTML-код для завдань у поточному списку
  document.getElementById("task-list").innerHTML = lists[currentList]
    .map((task, index) => `
      <li class="${task.completed ? "completed" : ""}">
        <span onclick="toggleTask(${index})">${task.name}</span>
        <button onclick="deleteTask(${index})">-</button>
      </li>`)
    .join("");
};

// Запускаємо додаток, завантажуючи списки
loadLists();
