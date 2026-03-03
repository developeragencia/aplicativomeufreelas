import Link from "next/link";
import Image from "next/image";
import StarRating from "./StarRating";

export interface Freelancer {
  id: string;
  name: string;
  avatar: string;
  title: string;
  rating: number;
  reviews: number;
  ranking: number;
  projectsCompleted: number;
  recommendations: number;
  registeredSince: string;
  description: string;
  skills: string[];
  isPremium?: boolean;
  isVerified?: boolean;
  isTopFreelancer?: boolean;
}

interface FreelancerCardProps {
  freelancer: Freelancer;
}

export default function FreelancerCard({ freelancer }: FreelancerCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Link href={`/freelancer/${freelancer.id}`}>
            <div className="relative w-24 h-24 rounded overflow-hidden">
              <Image
                src={freelancer.avatar}
                alt={freelancer.name}
                fill
                className="object-cover"
              />
            </div>
          </Link>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              {/* Name and badges */}
              <div className="flex items-center gap-2 flex-wrap">
                {freelancer.isPremium && (
                  <Image
                    src="https://ext.same-assets.com/2120427335/253051279.png"
                    alt="Premium"
                    width={20}
                    height={20}
                    className="premium-badge"
                  />
                )}
                <Link
                  href={`/freelancer/${freelancer.id}`}
                  className="text-[#1bafe1] font-semibold text-lg hover:underline"
                >
                  {freelancer.name}
                </Link>
                {freelancer.isVerified && (
                  <Image
                    src="https://ext.same-assets.com/2120427335/333311740.png"
                    alt="Verificado"
                    width={16}
                    height={16}
                  />
                )}
              </div>

              {/* Top Freelancer Badge */}
              {freelancer.isTopFreelancer && (
                <div className="flex items-center gap-1 mt-1">
                  <Image
                    src="https://ext.same-assets.com/2120427335/2296782752.svg"
                    alt="Top Freelancer"
                    width={14}
                    height={14}
                  />
                  <span className="text-xs text-[#1bafe1]">Top Freelancer Plus</span>
                </div>
              )}

              {/* Rating */}
              <div className="mt-1">
                <StarRating
                  rating={freelancer.rating}
                  showCount
                  count={freelancer.reviews}
                  size="sm"
                />
              </div>

              {/* Stats */}
              <p className="text-xs text-gray-600 mt-1">
                Ranking: <strong>{freelancer.ranking}</strong> |
                Projetos concluidos: <strong>{freelancer.projectsCompleted}</strong> |
                Recomendacoes: <strong>{freelancer.recommendations}</strong> |
                Registrado(a) desde: <strong>{freelancer.registeredSince}</strong>
              </p>

              {/* Title */}
              <p className="font-medium text-gray-800 mt-2">{freelancer.title}</p>

              {/* Description */}
              <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                {freelancer.description}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mt-3">
                {freelancer.skills.slice(0, 4).map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-200"
                  >
                    {skill}
                  </span>
                ))}
                {freelancer.skills.length > 4 && (
                  <span className="px-3 py-1 text-gray-500 text-xs">...</span>
                )}
              </div>
            </div>

            {/* Invite Button */}
            <Link
              href={`/convidar/${freelancer.id}`}
              className="bg-[#2eadaa] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#259b98] transition-colors flex-shrink-0"
            >
              Convidar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
