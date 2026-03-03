export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'cliente' | 'freelancer';
  profileCompletion: number;
  rating: number;
  reviewCount: number;
}

export interface ProjectStats {
  published: number;
  inProgress: number;
  completed: number;
  cancelled: number;
}

export interface Goal {
  id: string;
  title: string;
  completed: boolean;
}

export interface NavDropdownItem {
  label: string;
  href: string;
  icon?: string;
}

export interface NavDropdownMenu {
  title: string;
  items: NavDropdownItem[];
}

export interface Project {
  id: string;
  title: string;
  status: 'published' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: Date;
}
