import axios from 'axios';
import { IProject, IProfile, IMessage, ITechLogo } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Ensure this matches your backend PORT
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  // DEBUG: check the console for this
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Service functions
export const getProjects = async (search?: string): Promise<IProject[]> => {
  const res = await api.get('/projects', { params: { search } });
  return res.data;
};

export const createProject = async (project: Partial<IProject>): Promise<IProject> => {
  const res = await api.post('/projects', project);
  return res.data;
};

export const updateProject = async (id: string, project: Partial<IProject>): Promise<void> => {
  await api.put(`/projects/${id}`, project);
};

export const deleteProject = async (id: string): Promise<void> => {
  await api.delete(`/projects/${id}`);
};

export const getProfile = async (): Promise<IProfile> => {
  const res = await api.get('/profile');
  return res.data;
};

export const updateProfile = async (profile: Partial<IProfile>): Promise<void> => {
  await api.put('/profile', profile);
};

export const getMessages = async (search?: string): Promise<IMessage[]> => {
  const res = await api.get('/messages', { params: { search } });
  return res.data;
};

export const updateMessage = async (id: string, message: Partial<IMessage>): Promise<void> => {
  await api.put(`/messages/${id}`, message);
};

export const deleteMessage = async (id: string): Promise<void> => {
  await api.delete(`/messages/${id}`);
};

export const getTechLogos = async (search?: string): Promise<ITechLogo[]> => {
  const res = await api.get('/tech-logos', { params: { search } });
  return res.data;
};

export const createTechLogo = async (logo: Partial<ITechLogo>): Promise<ITechLogo> => {
  const res = await api.post('/tech-logos', logo);
  return res.data;
};

export const updateTechLogo = async (id: string, logo: Partial<ITechLogo>): Promise<void> => {
  await api.put(`/tech-logos/${id}`, logo);
};

export const deleteTechLogo = async (id: string): Promise<void> => {
  await api.delete(`/tech-logos/${id}`);
};

// Add these to src/services/api.ts
export const markMessageAsRead = async (id: string): Promise<void> => {
  await api.put(`/messages/${id}/read`);
};

export const toggleMessageIgnore = async (id: string): Promise<void> => {
  await api.put(`/messages/${id}/ignore`);
};

export const replyToMessage = async (id: string, replyText: string): Promise<void> => {
  await api.post(`/messages/${id}/reply`, { replyText });
};

export default api;
