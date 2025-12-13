import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Doctor {
  id: string;
  name: string;
  specialization: string | null;
  experience_years: number | null;
  qualification: string | null;
  bio: string | null;
  image_url: string | null;
  is_available: boolean | null;
  consultation_fee: number | null;
  created_at: string | null;
}

export const useDoctors = () => {
  return useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('is_available', true)
        .order('name');

      if (error) throw error;
      return data as Doctor[];
    },
  });
};

export const useDoctor = (id: string) => {
  return useQuery({
    queryKey: ['doctor', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Doctor;
    },
    enabled: !!id,
  });
};