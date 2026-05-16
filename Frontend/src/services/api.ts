import axios from 'axios';
import { IProject, IProfile, IMessage, ITechLogo } from '../types';

const api = axios.create({
  baseURL: '/api',
});

// Mock Data for fallback
export const MOCK_PROJECTS: IProject[] = [
  {
    id: '1',
    title: 'E-commerce Platform',
    description: 'A full-stack e-commerce solution with React and Node.js.',
    techStack: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
    status: 'Completed',
    githubLink: 'https://github.com',
    problem: 'Existing platforms were too slow.',
    solution: 'Built a lightweight custom solution.',
    features: ['Real-time inventory', 'Stripe integration'],
  },
  {
    id: '2',
    title: 'Task Management App',
    description: 'Collaborative task management for teams.',
    techStack: ['React', 'Firebase', 'Framer Motion'],
    status: 'In Progress',
    githubLink: 'https://github.com',
    problem: 'Team communication fragmentation.',
    solution: 'Centralized task tracking.',
    features: ['Kanban boards', 'Team chat'],
  }
];

export const MOCK_PROFILE: IProfile = {
  fullName: 'Pawlos Gelgelo',
  bio: 'Software Engineer dedicated to building impactful digital experiences through clean code and innovative design.',
  cvUrl: '#',
  profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
  linkedin: '#',
  telegram: '#',
  github: '#',
  website: '#',
  address: 'Addis Ababa, Ethiopia',
  phone: '+251 900 000 000',
  yearsOfExperience: '3+',
  profession: 'Software Engineer',
  description: 'A versatile software engineer with a focus on creating scalable, user-centric applications. I thrive on solving complex problems and continually learning new frameworks to deliver high-quality software solutions.',
  username: 'admin',
  password: 'password123',
};

export const MOCK_MESSAGES: IMessage[] = [
  {
    id: '1',
    name: 'Jane Smith',
    email: 'jane@example.com',
    message: 'Hello Pawlos! I am very impressed with your portfolio projects, specifically the E-commerce platform. I would love to discuss a potential partnership for an upcoming fintech project we are starting next month.',
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    isRead: false,
    isIgnored: false,
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael@tech-hub.io',
    message: 'Just wanted to say keep up the great work on your LinkedIn articles. Your insights on Tailwind v4 and React 19 architecture were very helpful for our team.',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    isRead: true,
    isIgnored: false,
    repliedAt: new Date(Date.now() - 43200000).toISOString(),
    replyText: 'Thanks Michael! Glad you found the articles useful. More coming soon!'
  },
  {
    id: '3',
    name: 'Bot Spam',
    email: 'spam@botnet.xyz',
    message: 'BUY BITCOIN NOW FAST EASY MONEY 1000% ROI GUARANTEED CLICK LINK BELOW NO SCAM REAL LEGIT',
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    isRead: false,
    isIgnored: true,
  }
];

export const MOCK_TECH_LOGOS: ITechLogo[] = [
  { id: '1', name: 'React', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { id: '2', name: 'Node.js', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
  { id: '3', name: 'TypeScript', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
  { id: '4', name: 'MongoDB', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
  { id: '5', name: 'Tailwind', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original-wordmark.svg' },
  { id: '6', name: 'Docker', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
];

// Service functions
export const getProjects = async (search?: string): Promise<IProject[]> => {
  try {
    const res = await api.get('/projects', { params: { search } });
    return res.data;
  } catch (err) {
    return MOCK_PROJECTS;
  }
};

export const createProject = async (project: Partial<IProject>): Promise<IProject> => {
  try {
    const res = await api.post('/projects', project);
    return res.data;
  } catch (err) {
    return { ...project, id: Math.random().toString(36).substr(2, 9) } as IProject;
  }
};

export const updateProject = async (id: string, project: Partial<IProject>): Promise<void> => {
  try {
    await api.put(`/projects/${id}`, project);
  } catch (err) {
    // mock success
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  try {
    await api.delete(`/projects/${id}`);
  } catch (err) {
    // mock success
  }
};

export const getProfile = async (): Promise<IProfile> => {
  try {
    const res = await api.get('/profile');
    return res.data;
  } catch (err) {
    return MOCK_PROFILE;
  }
};

export const getMessages = async (search?: string): Promise<IMessage[]> => {
  try {
    const res = await api.get('/messages', { params: { search } });
    return res.data;
  } catch (err) {
    return MOCK_MESSAGES;
  }
};

export const getTechLogos = async (search?: string): Promise<ITechLogo[]> => {
  try {
    const res = await api.get('/tech-logos', { params: { search } });
    return res.data;
  } catch (err) {
    return MOCK_TECH_LOGOS;
  }
};

export default api;
