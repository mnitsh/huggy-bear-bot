import { useState } from 'react';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';
import { useProducts } from '@/hooks/useProducts';
import { toast } from 'sonner';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    discount_percentage: number | null;
    image_url: string | null;
    stock_quantity: number | null;
    avg_rating?: number;
    total_likes?: number;
    user_liked?: boolean;
  };
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleLike, rateProduct } = useProducts();
  const [selectedRating, setSelectedRating] = useState(0);
  const [showRating, setShowRating] = useState(false);

  const discountedPrice = product.discount_percentage
    ? product.price * (1 - product.discount_percentage / 100)
    : product.price;

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    addToCart.mutate({ productId: product.id, quantity: 1 });
  };

  const handleLike = () => {
    if (!user) {
      toast.error('Please login to like products');
      return;
    }
    toggleLike.mutate(product.id);
  };

  const handleRate = (rating: number) => {
    if (!user) {
      toast.error('Please login to rate products');
      return;
    }
    rateProduct.mutate({ productId: product.id, rating });
    setShowRating(false);
  };

  return (
    <Card className="group overflow-hidden border-border/50 bg-card hover:shadow-warm transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image_url || '/placeholder.svg'}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.discount_percentage && product.discount_percentage > 0 && (
          <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
            -{product.discount_percentage}%
          </Badge>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background ${
            product.user_liked ? 'text-destructive' : 'text-muted-foreground'
          }`}
          onClick={handleLike}
        >
          <Heart className={`h-5 w-5 ${product.user_liked ? 'fill-current' : ''}`} />
        </Button>
      </div>
      <CardContent className="p-4 space-y-3">
        <h3 className="font-semibold text-foreground line-clamp-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        
        <div className="flex items-center gap-2">
          <div 
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => setShowRating(!showRating)}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= (product.avg_rating || 0)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            ({product.avg_rating?.toFixed(1) || '0'})
          </span>
          <span className="text-sm text-muted-foreground">
            • {product.total_likes || 0} likes
          </span>
        </div>

        {showRating && (
          <div className="flex items-center gap-1 p-2 bg-muted rounded-lg">
            <span className="text-sm mr-2">Rate:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 cursor-pointer transition-colors ${
                  star <= selectedRating
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-muted-foreground hover:text-amber-400'
                }`}
                onMouseEnter={() => setSelectedRating(star)}
                onMouseLeave={() => setSelectedRating(0)}
                onClick={() => handleRate(star)}
              />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              ₹{discountedPrice.toFixed(2)}
            </span>
            {product.discount_percentage && product.discount_percentage > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{product.price.toFixed(2)}
              </span>
            )}
          </div>
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0}
            className="bg-primary hover:bg-primary/90"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        
        {product.stock_quantity !== null && product.stock_quantity <= 5 && product.stock_quantity > 0 && (
          <p className="text-xs text-amber-600">Only {product.stock_quantity} left!</p>
        )}
        {product.stock_quantity === 0 && (
          <p className="text-xs text-destructive">Out of stock</p>
        )}
      </CardContent>
    </Card>
  );
};
