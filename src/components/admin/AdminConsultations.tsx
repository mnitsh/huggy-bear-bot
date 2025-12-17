import { useState } from 'react';
import { MessageCircle, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MessageDialog } from '@/components/doctors/MessageDialog';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'sonner';

export const AdminConsultations = () => {
  const [selectedConsultation, setSelectedConsultation] = useState<string | null>(null);
  const [scheduleDialog, setScheduleDialog] = useState<{ open: boolean; consultation: any | null }>({
    open: false,
    consultation: null,
  });
  const [scheduleDate, setScheduleDate] = useState('');
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

  const scheduleMutation = useMutation({
    mutationFn: async ({ id, scheduled_at }: { id: string; scheduled_at: string }) => {
      const { error } = await supabase
        .from('consultations')
        .update({ scheduled_at, status: 'confirmed' })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-consultations'] });
      toast.success('Consultation scheduled!');
      setScheduleDialog({ open: false, consultation: null });
      setScheduleDate('');
    },
    onError: () => {
      toast.error('Failed to schedule consultation');
    },
  });

  const handleSchedule = (consultation: any) => {
    setScheduleDialog({ open: true, consultation });
    setScheduleDate(consultation.scheduled_at ? consultation.scheduled_at.slice(0, 16) : '');
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (scheduleDialog.consultation && scheduleDate) {
      scheduleMutation.mutate({
        id: scheduleDialog.consultation.id,
        scheduled_at: new Date(scheduleDate).toISOString(),
      });
    }
  };

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
                    <TableCell>
                      {consultation.scheduled_at
                        ? format(new Date(consultation.scheduled_at), 'PPp')
                        : <span className="text-muted-foreground">Not scheduled</span>}
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
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleSchedule(consultation)}
                          title="Schedule"
                        >
                          <Calendar className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedConsultation(consultation.id)}
                          title="Messages"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Schedule Dialog */}
      <Dialog open={scheduleDialog.open} onOpenChange={(open) => setScheduleDialog({ open, consultation: open ? scheduleDialog.consultation : null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Consultation</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleScheduleSubmit} className="space-y-4">
            {scheduleDialog.consultation && (
              <div className="text-sm text-muted-foreground">
                <p><strong>Pet:</strong> {scheduleDialog.consultation.pet_name} ({scheduleDialog.consultation.pet_type})</p>
                <p><strong>Symptoms:</strong> {scheduleDialog.consultation.symptoms || 'Not specified'}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="schedule-date">Date & Time</Label>
              <Input
                id="schedule-date"
                type="datetime-local"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setScheduleDialog({ open: false, consultation: null })}>
                Cancel
              </Button>
              <Button type="submit" disabled={scheduleMutation.isPending}>
                {scheduleMutation.isPending ? 'Scheduling...' : 'Schedule'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

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
