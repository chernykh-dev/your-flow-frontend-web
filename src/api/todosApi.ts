import axios from 'axios';

const API_BASE = 'http://your-flow.online:5206/api/v1/todos';

export type TodoItemModel = {
    title: string;
    description?: string;
    order?: number;
    parentId?: string|null;
}

export type TodoItemModelWithId = {
    id: string;
    title: string;
    description?: string;
    order?: number;
    parentId?: string|null;
}


export const getTodos =
    () => axios.get(`${API_BASE}/sorted`);

export const addTodo =
    (data: TodoItemModel) => axios.post(API_BASE, data);

export const updateTodo =
    (id: string, data: TodoItemModel) => axios.put(`${API_BASE}/${id}`, data);

export const toggleTodo =
    (id: string, isCompleted: boolean) => axios.put(`${API_BASE}/toggle/${id}`, { isCompleted });

export const deleteTodo =
    (id: string) => axios.delete(`${API_BASE}/${id}`);