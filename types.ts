
export type Role = 'user' | 'assistant';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
}

export interface DashboardStats {
  readiness: number;
  marketValue: string;
  activeRoadmap: string;
  skillsProgress: number;
}
