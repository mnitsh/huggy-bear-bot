import { useState } from 'react';
import { Calendar, MessageCircle, Clock, CheckCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageDialog } from '@/components/doctors/MessageDialog';
import { useConsultations } from '@/hooks/useConsultations';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const MyConsultations = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { consultations, isLoading } = useConsultations();
  const [selectedConsultation, setSelectedConsultation] = useState<string | null>(null);

  if (!user) {
    navigate('/auth');
    return null;
  }

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

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-1/4 mb-8" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (!consultations || consultations.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">No consultations yet</h2>
          <p className="text-muted-foreground mb-6">Book a consultation with our expert veterinarians!</p>
          <Button onClick={() => navigate('/doctors')}>Find a Doctor</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">My Consultations</h1>

        <div className="space-y-4">
          {consultations.map((consultation) => (
            <Card key={consultation.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span>{consultation.pet_name}</span>
                      <Badge variant="outline">{consultation.pet_type}</Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      with Dr. {consultation.doctors?.name}
                    </p>
                  </div>
                  <Badge className={`${getStatusColor(consultation.status || 'pending')} text-white`}>
                    {consultation.status?.charAt(0).toUpperCase() + consultation.status?.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(consultation.scheduled_at!), 'PPP')}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {format(new Date(consultation.scheduled_at!), 'p')}
                    </div>
                  </div>
                  
                  {consultation.symptoms && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Symptoms:</strong> {consultation.symptoms}
                    </p>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedConsultation(consultation.id)}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Messages
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedConsultation && (
        <MessageDialog
          open={!!selectedConsultation}
          onOpenChange={() => setSelectedConsultation(null)}
          consultationId={selectedConsultation}
        />
      )}
    </Layout>
  );
};

export default MyConsultations;
