import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Consultation {
  id: string;
  user_id: string;
  doctor_id: string | null;
  pet_name: string | null;
  pet_type: string | null;
  symptoms: string | null;
  status: string | null;
  scheduled_at: string | null;
  created_at: string | null;
  doctors?: { name: string; specialization: string | null } | null;
}

export interface Message {
  id: string;
  consultation_id: string;
  sender_id: string;
  message: string;
  is_read: boolean | null;
  created_at: string | null;
}

export const useConsultations = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['consultations', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('consultations')
        .select(`
          *,
          doctors(name, specialization)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Consultation[];
    },
    enabled: !!user,
  });
};

export const useCreateConsultation = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      doctorId,
      petName,
      petType,
      symptoms,
      scheduledAt,
    }: {
      doctorId: string;
      petName: string;
      petType: string;
      symptoms: string;
      scheduledAt?: string;
    }) => {
      if (!user) throw new Error('Must be logged in');

      const { data, error } = await supabase
        .from('consultations')
        .insert({
          user_id: user.id,
          doctor_id: doctorId,
          pet_name: petName,
          pet_type: petType,
          symptoms,
          scheduled_at: scheduledAt,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultations'] });
    },
  });
};

export const useConsultationMessages = (consultationId: string) => {
  return useQuery({
    queryKey: ['messages', consultationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('consultation_id', consultationId)
        .order('created_at');

      if (error) throw error;
      return data as Message[];
    },
    enabled: !!consultationId,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      consultationId,
      message,
    }: {
      consultationId: string;
      message: string;
    }) => {
      if (!user) throw new Error('Must be logged in');

      const { data, error } = await supabase
        .from('messages')
        .insert({
          consultation_id: consultationId,
          sender_id: user.id,
          message,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.consultationId] });
    },
  });
};