import type { User, ProjectStats, Goal, NavDropdownItem } from '@/types';

export const currentUser: User = {
  id: '1',
  name: 'Hugo Carvana',
  email: 'hugo@example.com',
  avatar: 'H',
  role: 'cliente',
  profileCompletion: 50,
  rating: 0,
  reviewCount: 0,
};

export const projectStats: ProjectStats = {
  published: 0,
  inProgress: 0,
  completed: 0,
  cancelled: 0,
};

export const goals: Goal[] = [
  { id: '1', title: 'Completar Perfil', completed: false },
  { id: '2', title: 'Publicar Projeto', completed: false },
  { id: '3', title: 'Enviar Feedback', completed: false },
  { id: '4', title: 'Receber Recomendação', completed: false },
  { id: '5', title: 'Convidar Amigos', completed: false },
];

export const projetosDropdownItems: NavDropdownItem[] = [
  { label: 'Publicar projeto', href: '#' },
  { label: 'Meus projetos', href: '#' },
  { label: 'Buscar projetos', href: '#' },
];

export const freelancersDropdownItems: NavDropdownItem[] = [
  { label: 'Buscar freelancers', href: '#' },
  { label: 'Freelancers favoritos', href: '#' },
];

export const perfilDropdownItems: NavDropdownItem[] = [
  { label: 'Editar perfil', href: '#' },
  { label: 'Meu perfil', href: '#' },
];

export const contaDropdownItems: NavDropdownItem[] = [
  { label: 'Cartões de crédito', href: '#' },
  { label: 'Configurações de acesso', href: '#' },
  { label: 'Conta bancária', href: '#' },
  { label: 'Histórico de pagamentos', href: '#' },
  { label: 'Histórico de reembolsos', href: '#' },
  { label: 'Informações de localização', href: '#' },
  { label: 'Notificações e alertas', href: '#' },
  { label: 'Verificações de documentos', href: '#' },
];

export const ferramentasDropdownItems: NavDropdownItem[] = [
  { label: 'Formatação de textos', href: '#' },
];

export const ajudaDropdownItems: NavDropdownItem[] = [
  { label: 'Fluxo de um projeto', href: '#' },
  { label: 'Como funciona', href: '#' },
  { label: 'Central de ajuda', href: '#' },
  { label: 'Blog', href: '#' },
];
