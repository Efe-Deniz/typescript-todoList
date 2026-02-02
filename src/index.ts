//todo uygulamasının ana mantığı
//dom manipülasyonu, event handling, state yönetimi
import { Todo, FilterType } from './types';
import {
    generateId, //benzersizz id oluştur
    loadTodos, //localstoragedan todoları yükle
    saveTodos, //localstrogedan todoları kaydet
    calculateStats, //istatislik hesaplama
} from './utils';

let todos: Todo[] = []; //tüm todolar burada tutulacak

//aktif filtre
let currentFilter: FilterType = 'all';

//dom elements(html elementlerini yakala)
const todoInput = document.getElementById('todoInput') as HTMLInputElement;
const addBtn = document.getElementById('addBtn') as HTMLButtonElement;
const todoList = document.getElementById('todoList') as HTMLUListElement;
const totalCount = document.getElementById('totalCount') as HTMLSpanElement;
const completedCount = document.getElementById('completedCount') as HTMLSpanElement;
const remainingCount = document.getElementById('remainingCount') as HTMLSpanElement;

//init function (başlatma)
function init(): void {
    //uygulama ilk açıldığınıda çalışacak fonksiyon

    //1-localstorageden todoları ykle
    todos = loadTodos();
    //2-ekranı render et
    render();

    //3-event listenerları ekle
    setupEventListeners();
}

function setupEventListeners(): void {
    //kullanıcı etkileşimlerini dinle
    //1-ekleme butonuna tıklama
    addBtn.addEventListener('click', handleAddTodo); //handleAddTodo->tıklanınca çalışacak fonksiyon
    //2-inputta enter
    todoInput.addEventListener('keypress', (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddTodo();
        }
    });
}

//Add todo(todo ekleme)
function handleAddTodo(): void {
    //1-inputtan değeri al ve temizle
    const text = todoInput.value.trim();
    //2- boş mu kontrol et
    if (!text) {
        alert('Lütfen bir göreb yazın!');
        return;
    }

    //3- yeni todo objesi oluştur
    const newTodo: Todo = {
        id: generateId(),
        text: text,
        completed: false,
        createdAt: new Date(),
    };
    //4- yeni todo arraye ekle
    todos.push(newTodo);
    //5-localstorage kaydet
    saveTodos(todos);
    //6-input temizle
    todoInput.value = '';
    //7- ekranı güncelle
    render();
}

//todoyu tamamla geri al
function handleToggleTodo(id: string): void {
    //1- todo bul ve completed'ini tesine çevir
    todos = todos.map((todo) => {
        if (todo.id === id) {
            return {
                ...todo,
                completed: !todo.completed,
            };
        }
        return todo;
    });
    saveTodos(todos);
    render();
}
//todoyu sil
function handleDeleteTodo(id: string): void {
    const confirmed = confirm('Bu görevi silmek istediğinize emin misiniz?');

    if (!confirmed) return;

    //todoyu arrayden çıkar
    todos = todos.filter((todo) => todo.id !== id);
    saveTodos(todos);
    render();
}

//render
function render(): void {
    //1-filtrelenmiş todoları al
    const filteredTodos = getFilteredTodos();
    //2-todo listesini render et
    renderTodoList(filteredTodos);
    //3-istatislikleri güncelle
    updateStats();
}
//filtrelenmiş todolar
function getFilteredTodos(): Todo[] {
    switch (currentFilter) {
        case 'all':
            return todos;
        case 'active':
            return todos.filter((todo) => !todo.completed);
        case 'completed':
            return todos.filter((todo) => todo.completed);
        default:
            return todos;
    }
}

//todo listesini çiz
function renderTodoList(todosToRender: Todo[]): void {
    //mevcut listeyi temizle
    todoList.innerHTML = '';

    if (todosToRender.length === 0) {
        const emptyMessage = document.createElement('li');

        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = 'Henüz Görev Yok.Yukarıdan Ekleyin';

        todoList.appendChild(emptyMessage);
        return;
    }

    todosToRender.forEach((todo) => {
        const li = document.createElement('li');
        li.className = 'todo-item';

        if (todo.completed) {
            li.classList.add('completed');
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;

        checkbox.addEventListener('change', () => {
            handleToggleTodo(todo.id);
        });

        const span = document.createElement('span');
        span.className = 'todo-text';
        span.textContent = todo.text;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '🗑️ Sil';

        deleteBtn.addEventListener('click', () => {
            handleDeleteTodo(todo.id);
        });
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);

        todoList.appendChild(li);
    });
}

//istatislikleri güncelle
function updateStats(): void {
    const stats = calculateStats(todos);

    totalCount.textContent = stats.total.toString();
    completedCount.textContent = stats.completed.toString();
    remainingCount.textContent = stats.remaining.toString();
}

//uyhulamayı başlat
document.addEventListener('DOMContentLoaded', () => {
    init();
});
