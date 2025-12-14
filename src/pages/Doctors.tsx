import { useState } from 'react';
import { Search, Stethoscope } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { DoctorCard } from '@/components/doctors/DoctorCard';
import { BookingDialog } from '@/components/doctors/BookingDialog';
import { useDoctors } from '@/hooks/useDoctors';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<{ id: string; name: string } | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  
  const { doctors, isLoading } = useDoctors();
  const { user } = useAuth();
  const navigate = useNavigate();

  const filteredDoctors = doctors?.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBook = (doctorId: string) => {
    if (!user) {
      toast.error('Please login to book a consultation');
      navigate('/auth');
      return;
    }
    const doctor = doctors?.find(d => d.id === doctorId);
    if (doctor) {
      setSelectedDoctor({ id: doctor.id, name: doctor.name });
      setBookingOpen(true);
    }
  };

  const handleMessage = (doctorId: string) => {
    if (!user) {
      toast.error('Please login to message a doctor');
      navigate('/auth');
      return;
    }
    toast.info('Please book a consultation first to message the doctor');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Our Veterinarians</h1>
          <p className="text-muted-foreground">Expert care for your beloved pets</p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search doctors by name or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Doctors List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4 p-4 border rounded-lg">
                <Skeleton className="w-48 h-48 rounded-lg" />
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredDoctors?.length === 0 ? (
          <div className="text-center py-12">
            <Stethoscope className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No doctors found</h3>
            <p className="text-muted-foreground">Try adjusting your search</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDoctors?.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onBook={handleBook}
                onMessage={handleMessage}
              />
            ))}
          </div>
        )}
      </div>

      {selectedDoctor && (
        <BookingDialog
          open={bookingOpen}
          onOpenChange={setBookingOpen}
          doctorId={selectedDoctor.id}
          doctorName={selectedDoctor.name}
        />
      )}
    </Layout>
  );
};

export default Doctors;
