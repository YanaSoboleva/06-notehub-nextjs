import axios from 'axios';
import { Note } from '@/types/note';

// Отримуємо токен з екологічних змінних (якщо використовується)
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

/**
 * Створюємо інстанс axios з базовими налаштуваннями під актуальний API
 */
const api = axios.create({
  // URL з вашої документації Swagger
  baseURL: 'https://notehub-public.goit.study/api', 
  headers: {
    // Додаємо токен авторизації лише якщо він існує
    ...(TOKEN && { Authorization: `Bearer ${TOKEN}` }),
    'Content-Type': 'application/json',
  },
});

/**
 * Інтерфейси для типізації відповідей та параметрів
 */
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  page: number;
  perPage: number;
}

export interface FetchParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export type CreateNoteData = {
  title: string;
  content: string;
  tag: string;
};

/**
 * Отримання списку нотаток з пагінацією та пошуком
 */
export const fetchNotes = async ({
  page = 1,
  perPage = 10,
  search = '',
}: FetchParams = {}): Promise<FetchNotesResponse> => {
  const response = await api.get<FetchNotesResponse>('/notes', {
    params: { 
      page, 
      perPage, // Використовуємо саме perPage згідно зі Swagger
      search 
    },
  });
  return response.data;
};

/**
 * Отримання однієї нотатки за її ID
 */
export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
};

/**
 * Створення нової нотатки
 */
export const createNote = async (noteData: CreateNoteData): Promise<Note> => {
  const response = await api.post<Note>('/notes', noteData);
  return response.data;
};

/**
 * Видалення нотатки за ID
 */
export const deleteNote = async (id: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
};

// Експортуємо інстанс для використання в інших частинах додатку
export default api;