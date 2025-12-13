import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  discount_percentage: number | null;
  stock_quantity: number | null;
  category_id: string | null;
  image_url: string | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  categories?: { name: string } | null;
  likes_count?: number;
  avg_rating?: number;
  user_liked?: boolean;
  user_rating?: number | null;
}

export const useProducts = (categoryId?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['products', categoryId, user?.id],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(`
          *,
          categories(name)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data: products, error } = await query;
      if (error) throw error;

      // Get likes and ratings for each product
      const productsWithStats = await Promise.all(
        (products || []).map(async (product) => {
          const { count: likesCount } = await supabase
            .from('product_likes')
            .select('*', { count: 'exact', head: true })
            .eq('product_id', product.id);

          const { data: ratings } = await supabase
            .from('product_ratings')
            .select('rating')
            .eq('product_id', product.id);

          const avgRating = ratings && ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
            : 0;

          let userLiked = false;
          let userRating = null;

          if (user) {
            const { data: like } = await supabase
              .from('product_likes')
              .select('id')
              .eq('product_id', product.id)
              .eq('user_id', user.id)
              .maybeSingle();

            userLiked = !!like;

            const { data: rating } = await supabase
              .from('product_ratings')
              .select('rating')
              .eq('product_id', product.id)
              .eq('user_id', user.id)
              .maybeSingle();

            userRating = rating?.rating || null;
          }

          return {
            ...product,
            likes_count: likesCount || 0,
            avg_rating: avgRating,
            user_liked: userLiked,
            user_rating: userRating,
          };
        })
      );

      return productsWithStats as Product[];
    },
  });
};

export const useProduct = (id: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['product', id, user?.id],
    queryFn: async () => {
      const { data: product, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(name)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      const { count: likesCount } = await supabase
        .from('product_likes')
        .select('*', { count: 'exact', head: true })
        .eq('product_id', id);

      const { data: ratings } = await supabase
        .from('product_ratings')
        .select('rating, review, created_at, user_id')
        .eq('product_id', id);

      const avgRating = ratings && ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

      let userLiked = false;
      let userRating = null;

      if (user) {
        const { data: like } = await supabase
          .from('product_likes')
          .select('id')
          .eq('product_id', id)
          .eq('user_id', user.id)
          .maybeSingle();

        userLiked = !!like;

        const { data: rating } = await supabase
          .from('product_ratings')
          .select('rating')
          .eq('product_id', id)
          .eq('user_id', user.id)
          .maybeSingle();

        userRating = rating?.rating || null;
      }

      return {
        ...product,
        likes_count: likesCount || 0,
        avg_rating: avgRating,
        ratings: ratings || [],
        user_liked: userLiked,
        user_rating: userRating,
      };
    },
    enabled: !!id,
  });
};

export const useLikeProduct = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ productId, liked }: { productId: string; liked: boolean }) => {
      if (!user) throw new Error('Must be logged in');

      if (liked) {
        const { error } = await supabase
          .from('product_likes')
          .delete()
          .eq('product_id', productId)
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('product_likes')
          .insert({ product_id: productId, user_id: user.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
  });
};

export const useRateProduct = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ productId, rating, review }: { productId: string; rating: number; review?: string }) => {
      if (!user) throw new Error('Must be logged in');

      const { error } = await supabase
        .from('product_ratings')
        .upsert({
          product_id: productId,
          user_id: user.id,
          rating,
          review,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
  });
};