import { Star } from 'lucide-react';

const Stars = ({ rating }: { rating: number }) => (
  <span className="flex items-center gap-0.5">
    {Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={i < Math.round(rating) ? 'fill-amber-300 text-amber-300' : 'text-neutral-600'}
      />
    ))}
  </span>
);

export default Stars;
