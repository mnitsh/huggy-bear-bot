import { useState } from 'react';
import { Award, GraduationCap, Stethoscope, Clock, MessageCircle, Calendar } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookingDialog } from '@/components/doctors/BookingDialog';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const DOCTOR_ID = 'single-doctor-id'; // This will be the single doctor's ID from database

const Consultation = () => {
  const [bookingOpen, setBookingOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBook = () => {
    if (!user) {
      toast.error('Please login to book a consultation');
      navigate('/auth');
      return;
    }
    setBookingOpen(true);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Book a Consultation</h1>
          <p className="text-muted-foreground">Get expert veterinary care for your beloved pets</p>
        </div>

        {/* Doctor Profile */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="overflow-hidden border-border/50 shadow-warm">
            <div className="flex flex-col md:flex-row">
              <div className="relative w-full md:w-80 h-80 md:h-auto bg-muted">
                <img
                  src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop"
                  alt="Dr. Rajesh Sharma"
                  className="h-full w-full object-cover"
                />
              </div>
              <CardContent className="flex-1 p-8 space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">Dr. Rajesh Sharma</h2>
                  <p className="text-primary font-medium text-lg">Veterinary Specialist & Surgeon</p>
                  <p className="text-muted-foreground">BVSc & AH, MVSc (Surgery)</p>
                </div>
                
                <p className="text-muted-foreground leading-relaxed">
                  With over 15 years of experience in veterinary medicine, I am dedicated to providing 
                  compassionate and comprehensive care for all types of pets. My expertise includes 
                  general medicine, surgery, dental care, and emergency treatments. I believe every pet 
                  deserves the best care possible.
                </p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Award className="h-5 w-5 text-primary" />
                    <span>15+ Years Experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <span>Certified Specialist</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>30 min Sessions</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    <span>Direct Messaging</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <span className="text-2xl font-bold text-primary">₹500</span>
                    <span className="text-muted-foreground"> / session</span>
                  </div>
                  <Button size="lg" onClick={handleBook}>
                    <Calendar className="h-5 w-5 mr-2" />
                    Book Consultation
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* Services */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-foreground mb-6">Services Offered</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'General Check-up', desc: 'Comprehensive health examination for your pet' },
              { title: 'Vaccination', desc: 'Complete vaccination schedules for dogs and cats' },
              { title: 'Surgery', desc: 'Minor and major surgical procedures' },
              { title: 'Dental Care', desc: 'Dental cleaning and oral health treatment' },
              { title: 'Skin Treatment', desc: 'Diagnosis and treatment of skin conditions' },
              { title: 'Emergency Care', desc: 'Urgent care for critical conditions' },
            ].map((service, index) => (
              <Card key={index} className="border-border/50">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-foreground">{service.title}</h4>
                  <p className="text-sm text-muted-foreground">{service.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <BookingDialog
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        doctorId={DOCTOR_ID}
        doctorName="Dr. Rajesh Sharma"
      />
    </Layout>
  );
};

export default Consultation;