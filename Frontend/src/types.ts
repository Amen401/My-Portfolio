export interface IProject {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  status: 'Completed' | 'In Progress' | 'Planned';
  githubLink: string;
  liveLink?: string;
  problem: string;
  solution: string;
  features: string[];
  imageUrl?: string;
}

export interface IProfile {
  fullName: string;
  bio: string;
  cvUrl: string;
  profilePic: string;
  linkedin: string;
  telegram: string;
  github: string;
  website: string;
  address: string;
  phone: string;
  yearsOfExperience: string;
  profession: string;
  description: string;
  username?: string;
  password?: string;
}

export interface IMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  repliedAt?: string;
  isIgnored: boolean;
  replyText?: string;
}

export interface ITechLogo {
  id: string;
  name: string;
  logoUrl: string;
}
