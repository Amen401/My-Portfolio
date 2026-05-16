import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

let MOCK_PROJECTS = [
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

const MOCK_TECH_LOGOS = [
  { id: '1', name: 'React', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { id: '2', name: 'Node.js', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
  { id: '3', name: 'TypeScript', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
  { id: '4', name: 'MongoDB', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
  { id: '5', name: 'Tailwind', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original-wordmark.svg' },
  { id: '6', name: 'Docker', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/projects", (req, res) => {
    const { search } = req.query;
    let projects = [...MOCK_PROJECTS];
    
    if (search && typeof search === 'string') {
      const s = search.toLowerCase();
      projects = projects.filter(p => 
        p.title.toLowerCase().includes(s) || 
        p.description.toLowerCase().includes(s) ||
        p.techStack.some(t => t.toLowerCase().includes(s))
      );
    }
    
    res.json(projects);
  });

  app.post("/api/projects", (req, res) => {
    const newProject = { ...req.body, id: Math.random().toString(36).substr(2, 9) };
    MOCK_PROJECTS.unshift(newProject);
    res.status(201).json(newProject);
  });

  app.put("/api/projects/:id", (req, res) => {
    const { id } = req.params;
    MOCK_PROJECTS = MOCK_PROJECTS.map(p => p.id === id ? { ...p, ...req.body } : p);
    res.json({ message: "Updated" });
  });

  app.delete("/api/projects/:id", (req, res) => {
    const { id } = req.params;
    MOCK_PROJECTS = MOCK_PROJECTS.filter(p => p.id !== id);
    res.status(204).send();
  });

  app.get("/api/tech-logos", (req, res) => {
    const { search } = req.query;
    let logos = [...MOCK_TECH_LOGOS];
    
    if (search && typeof search === 'string') {
      const s = search.toLowerCase();
      logos = logos.filter(l => l.name.toLowerCase().includes(s));
    }
    
    res.json(logos);
  });

  app.get("/api/profile", (req, res) => {
    res.json({
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
    });
  });

  app.get("/api/messages", (req, res) => {
    // In a real app we'd filter from DB, here we simulate backend filtering
    const { search } = req.query;
    let messages = [
      {
        id: '1',
        name: 'Jane Smith',
        email: 'jane@example.com',
        message: 'Hello Pawlos! I am very impressed with your portfolio projects, specifically the E-commerce platform.',
        createdAt: new Date().toISOString(),
        isRead: false,
        isIgnored: false,
      }
    ];

    if (search && typeof search === 'string') {
      const s = search.toLowerCase();
      messages = messages.filter(m => 
        m.name.toLowerCase().includes(s) || 
        m.email.toLowerCase().includes(s) || 
        m.message.toLowerCase().includes(s)
      );
    }

    res.json(messages);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
