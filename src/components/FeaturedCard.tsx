import React from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeaturedCardProps {
  title?: string;
  subtitle?: string;
  image: string;
  rating?: number;
  promotionTier?: number;
  reviewsCount?: number;
  link: string;
  description: string;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({
  title,
  subtitle,
  image,
  rating,
  promotionTier,
  reviewsCount,
  link,
  description,
}) => {
  return (
    <Link 
      to={link}
      className="group relative block overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:shadow-xl"
    >
      <div className="absolute top-4 right-4 z-10">
        <div className="rounded-full bg-primary-600 px-3 py-1 text-sm font-semibold text-white">
          {promotionTier === 2 ? 'Премиум' : 'В топе'}
        </div>
      </div>
      
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent"></div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h3 className="text-xl font-bold">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-gray-300">{subtitle}</p>}
        {rating && (
          <div className="mt-2 flex items-center">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="ml-1 font-medium">{rating}</span>
            <span className="mx-1">·</span>
            <span className="text-sm">{reviewsCount} отзывов</span>
          </div>
        )}
        <p className="mt-2 text-sm text-gray-300 line-clamp-2">{description}</p>
      </div>
    </Link>
  );
};

export default FeaturedCard;