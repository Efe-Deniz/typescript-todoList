//yardımcı fonksiyonları buraya ekliyoruz
//her fonksiyon tek bir iş yapmalı
import { STORAGE_KEY } from './types.js';
//benzersiz idler oluşturma
export function generateId() {
    //şuan ki zamanı milisaniye cinsinden al ve stringe çevir
    return Date.now().toString();
    //Neden Date.now() her çağrıda benzersiz bir değer döner
}
//LocalStorage'den todoları yükle
export function loadTodos() {
    //LocalStorage todoları al, parse et ve array olarak döndür
    try {
        //1-LocalStorage veri al
        const todosJSON = localStorage.getItem(STORAGE_KEY); //localStorage.getItem()->string veya null döner
        //2-veri yoksa boş array  döndür
        if (!todosJSON)
            return [];
        //3-JSON stringi js objesine çevir
        const todos = JSON.parse(todosJSON);
        //4-createdAt' Date objesine çevir
        return todos.map((todo) => ({
            ...todo, //tüm propertyleri kopyala
            createdAt: new Date(todo.createdAt),
            //map->her todo için işlem yap
        }));
    }
    catch (error) {
        console.error('Todo yükleme hatası: ', error);
        return [];
    }
}
//LocalStorage totoları kaydet
export function saveTodos(todos) {
    //todos: Todo[] → Kaydedilecek todo'lar
    try {
        //1-todo arrayini JSON stringe çevir
        const todosJSON = JSON.stringify(todos);
        //2.localstorage'a kaydet
        localStorage.setItem(STORAGE_KEY, todosJSON);
    }
    catch (error) {
        console.error('Todo kaydetme hatası:', error);
    }
}
//tarih formatlama kısmı
export function formatDate(date) {
    return date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}
//istatistik hesaplama
export function calculateStats(todos) {
    //toplam todo sayısı
    const total = todos.length;
    //tamamlanan todo sayısı
    const completed = todos.filter((todo) => todo.completed).length;
    //kalan todo sayısı
    const remaining = total - completed;
    //obje döndür
    return {
        total,
        completed,
        remaining,
    };
}
