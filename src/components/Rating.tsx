import { useState } from 'react';
import { useRating } from '../hooks/useRating';
import { motion } from 'framer-motion';

interface RatingProps {
  movieId: string;
  size?: 'sm' | 'md' | 'lg';
}

const Rating = ({ movieId, size = 'md' }: RatingProps) => {
  const {
    userRating,
    averageRating,
    ratingsCount,
    isLoading,
    rateMovie
  } = useRating(movieId);

  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  const [hoverRating, setHoverRating] = useState<number | null>(null);

  if (isLoading) return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <div key={star} className={`${sizeClasses[size]} text-gray-300`}>★</div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            type="button"
            className={`${sizeClasses[size]} ${
              star <= (hoverRating || userRating || 0)
                ? 'text-yellow-400'
                : 'text-gray-300'
            }`}
            onClick={() => rateMovie(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(null)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            ★
          </motion.button>
        ))}
      </div>
      <div className="text-sm text-gray-500">
        {ratingsCount > 0 ? (
          <span>
            Average: {averageRating.toFixed(1)} ({ratingsCount} ratings)
          </span>
        ) : (
          <span>No ratings yet</span>
        )}
      </div>
    </div>
  );
};

export default Rating;