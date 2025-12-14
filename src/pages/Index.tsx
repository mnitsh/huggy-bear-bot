import { Link } from 'react-router-dom';
import { ArrowRight, Stethoscope, ShoppingBag, MessageCircle, Shield, Truck, Clock } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const features = [
    {
      icon: ShoppingBag,
      title: 'Quality Products',
      description: 'Premium medicines and supplies for all your pet needs',
    },
    {
      icon: Stethoscope,
      title: 'Expert Veterinarians',
      description: 'Consult with experienced doctors for your pet\'s health',
    },
    {
      icon: MessageCircle,
      title: 'Direct Messaging',
      description: 'Chat directly with doctors for quick consultations',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Quick and reliable delivery to your doorstep',
    },
    {
      icon: Shield,
      title: 'Trusted Quality',
      description: '100% genuine products with quality guarantee',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round the clock customer support for your queries',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Caring for Your
                <span className="text-primary block">Furry Friends</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Your trusted partner in pet healthcare. Quality medicines, expert consultations, 
                and everything your beloved pets need for a healthy, happy life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products">
                  <Button size="lg" className="w-full sm:w-auto">
                    Shop Products
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/doctors">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Book Consultation
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl" />
              <div className="relative bg-card rounded-3xl p-8 shadow-warm">
                <div className="text-center">
                  <div className="text-8xl mb-4">🐾</div>
                  <h3 className="text-2xl font-bold text-foreground">PawCare Pharmacy</h3>
                  <p className="text-muted-foreground mt-2">Where pets come first</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Us?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide comprehensive pet care solutions with quality products and expert veterinary services
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-warm transition-all duration-300 border-border/50">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-8 lg:p-12 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
              Need Expert Advice for Your Pet?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Our experienced veterinarians are here to help. Book a consultation today 
              and get personalized care for your beloved pet.
            </p>
            <Link to="/doctors">
              <Button size="lg" variant="secondary">
                Find a Doctor
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
