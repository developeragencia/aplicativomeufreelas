import Link from "next/link";
import StarRating from "./StarRating";

export interface Project {
  id: string;
  title: string;
  category: string;
  level: string;
  publishedAt: string;
  timeRemaining: string;
  proposals: number;
  interested: number;
  description: string;
  skills?: string[];
  client: {
    name: string;
    rating: number;
    reviews: number;
  };
  isFeatured?: boolean;
  isUrgent?: boolean;
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow relative">
      {/* Featured Badge */}
      {project.isFeatured && (
        <div className="absolute top-4 right-4">
          <svg className="w-6 h-6 text-[#f1b42a]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
      )}

      {/* Title */}
      <Link
        href={`/projeto/${project.id}`}
        className="text-[#1bafe1] font-semibold text-lg hover:underline block mb-2"
      >
        {project.title}
      </Link>

      {/* Meta Info */}
      <p className="text-sm text-gray-600 mb-3">
        {project.category} | {project.level} | Publicado: <strong>{project.publishedAt}</strong> |
        Tempo restante: <strong>{project.timeRemaining}</strong> |
        Propostas: <strong>{project.proposals}</strong> |
        Interessados: <strong>{project.interested}</strong>
      </p>

      {/* Description */}
      <p className="text-sm text-gray-700 mb-4 line-clamp-3">
        {project.description}
      </p>

      {/* Skills */}
      {project.skills && project.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded border border-gray-200"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Client Info */}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
        <span className="text-sm text-gray-600">Cliente:</span>
        {project.client.name ? (
          <Link href="#" className="text-[#1bafe1] text-sm hover:underline">
            {project.client.name}
          </Link>
        ) : null}
        <StarRating rating={project.client.rating} size="sm" />
        <span className="text-xs text-gray-500">
          {project.client.reviews > 0
            ? `(${project.client.reviews} avaliacoes)`
            : "(Sem feedback)"}
        </span>
      </div>
    </div>
  );
}
