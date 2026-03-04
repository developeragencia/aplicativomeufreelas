export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
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
}
