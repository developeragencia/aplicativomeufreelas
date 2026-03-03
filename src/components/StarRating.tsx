import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  showCount?: boolean;
  count?: number;
  size?: "sm" | "md" | "lg";
}

export default function StarRating({
  rating,
  maxRating = 5,
  showCount = false,
  count = 0,
  size = "md",
}: StarRatingProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: maxRating }).map((_, index) => {
          const fillPercentage = Math.min(Math.max(rating - index, 0), 1) * 100;

          return (
            <div key={index} className="relative">
              <Star
                className={`${sizeClasses[size]} text-gray-300`}
                fill="currentColor"
              />
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPercentage}%` }}
              >
                <Star
                  className={`${sizeClasses[size]} text-[#f1b42a]`}
                  fill="currentColor"
                />
              </div>
            </div>
          );
        })}
      </div>
      {showCount && (
        <span className="text-xs text-gray-500 ml-1">
          ({rating.toFixed(2)} - {count} avaliacoes)
        </span>
      )}
    </div>
  );
}
