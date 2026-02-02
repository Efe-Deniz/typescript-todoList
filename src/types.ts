//tüm tip tanımlarını yani interface ve typlerı buraya koyuyoruz

//interface->obje şablonu-todo yapısını tanımla
export interface Todo {
    id: string; //Date.now kullanıp stringe çevireceğimiz için strin
    text: string;
    completed: boolean;
    createdAt: Date; //oluşturulma tarihi
}

//filter type-> tüm todoları göster (all), aktif olanları göster(active), tamamlananları göster(completed)

export type FilterType = 'all' | 'active' | 'completed';

//storage key->LocalStorage'de kullanacağımız anahtar
export const STORAGE_KEY = 'typescript-todos';
