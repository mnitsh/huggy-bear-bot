import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MessageDialog } from '@/components/doctors/MessageDialog';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'sonner';

export const AdminConsultations = () => {
  const [selectedConsultation, setSelectedConsultation] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: consultations, isLoading } = useQuery({
    queryKey: ['admin-consultations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('consultations')
        .select('*, doctors(name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('consultations')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-consultations'] });
      toast.success('Consultation status updated!');
    },
    onError: () => {
      toast.error('Failed to update status');
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500';
      case 'confirmed':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-destructive';
      default:
        return 'bg-muted';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consultations Management</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pet</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Symptoms</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Update Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consultations?.map((consultation) => (
                  <TableRow key={consultation.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{consultation.pet_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {consultation.pet_type}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{consultation.doctors?.name || '-'}</TableCell>
                    <TableCell>
                      {consultation.scheduled_at
                        ? format(new Date(consultation.scheduled_at), 'PPp')
                        : '-'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {consultation.symptoms || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(consultation.status || 'pending')} text-white`}>
                        {consultation.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={consultation.status || 'pending'}
                        onValueChange={(value) =>
                          updateStatusMutation.mutate({ id: consultation.id, status: value })
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedConsultation(consultation.id)}
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {selectedConsultation && (
        <MessageDialog
          open={!!selectedConsultation}
          onOpenChange={() => setSelectedConsultation(null)}
          consultationId={selectedConsultation}
        />
      )}
    </Card>
  );
};
