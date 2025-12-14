import { Calendar, MessageCircle, Award, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DoctorCardProps {
  doctor: {
    id: string;
    name: string;
    specialization: string | null;
    qualification: string | null;
    experience_years: number | null;
    bio: string | null;
    image_url: string | null;
    consultation_fee: number | null;
    is_available: boolean | null;
  };
  onBook: (doctorId: string) => void;
  onMessage: (doctorId: string) => void;
}

export const DoctorCard = ({ doctor, onBook, onMessage }: DoctorCardProps) => {
  return (
    <Card className="overflow-hidden border-border/50 bg-card hover:shadow-warm transition-all duration-300">
      <div className="flex flex-col md:flex-row">
        <div className="relative w-full md:w-48 h-48 md:h-auto bg-muted">
          <img
            src={doctor.image_url || '/placeholder.svg'}
            alt={doctor.name}
            className="h-full w-full object-cover"
          />
          {doctor.is_available && (
            <Badge className="absolute top-2 left-2 bg-green-500 text-white">
              Available
            </Badge>
          )}
        </div>
        <CardContent className="flex-1 p-6 space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-foreground">{doctor.name}</h3>
            <p className="text-primary font-medium">{doctor.specialization}</p>
            <p className="text-sm text-muted-foreground">{doctor.qualification}</p>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">{doctor.bio}</p>
          
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Award className="h-4 w-4" />
              <span>{doctor.experience_years} years exp.</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>30 min session</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <span className="text-lg font-bold text-primary">
                ₹{doctor.consultation_fee?.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground"> / session</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMessage(doctor.id)}
                disabled={!doctor.is_available}
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                Message
              </Button>
              <Button
                size="sm"
                onClick={() => onBook(doctor.id)}
                disabled={!doctor.is_available}
                className="bg-primary hover:bg-primary/90"
              >
                <Calendar className="h-4 w-4 mr-1" />
                Book Now
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
