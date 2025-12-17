import { Link } from 'react-router-dom';
import { ArrowRight, Stethoscope, ShoppingBag, MessageCircle, Shield, Truck, Clock, Award, GraduationCap } from 'lucide-react';
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
      title: 'Expert Consultation',
      description: 'Get personalized advice from Dr. Sharma for your pet\'s health',
    },
    {
      icon: MessageCircle,
      title: 'Direct Messaging',
      description: 'Chat directly with the doctor for quick consultations',
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

  const featuredProducts = [
    {
      name: 'Premium Dog Food',
      price: 1299,
      image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400&h=400&fit=crop',
    },
    {
      name: 'Cat Vitamins',
      price: 599,
      image: 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=400&h=400&fit=crop',
    },
    {
      name: 'Pet Shampoo',
      price: 349,
      image: 'https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=400&h=400&fit=crop',
    },
    {
      name: 'Flea Treatment',
      price: 899,
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop',
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
                Welcome to PawCare Pharmacy - your trusted partner in pet healthcare. 
                Quality medicines, expert consultations, and everything your beloved pets need.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products">
                  <Button size="lg" className="w-full sm:w-auto">
                    Shop Products
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/consultation">
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

      {/* Doctor Section */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Meet Your Veterinarian</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Expert care from an experienced professional dedicated to your pet's wellbeing
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden border-border/50 shadow-warm">
              <div className="flex flex-col md:flex-row">
                <div className="relative w-full md:w-72 h-72 md:h-auto bg-muted">
                  <img
                    src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop"
                    alt="Dr. Sharma"
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardContent className="flex-1 p-8 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">Dr. Rajesh Sharma</h3>
                    <p className="text-primary font-medium text-lg">Veterinary Specialist</p>
                    <p className="text-muted-foreground">BVSc & AH, MVSc (Surgery)</p>
                  </div>
                  
                  <p className="text-muted-foreground">
                    With over 15 years of experience in veterinary medicine, Dr. Sharma has dedicated his career 
                    to providing compassionate care for all types of pets. His expertise spans from routine 
                    check-ups to complex surgical procedures.
                  </p>
                  
                  <div className="flex flex-wrap gap-6 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Award className="h-5 w-5 text-primary" />
                      <span>15+ Years Experience</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      <span>Certified Specialist</span>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Link to="/consultation">
                      <Button size="lg" className="w-full sm:w-auto">
                        <Stethoscope className="h-5 w-5 mr-2" />
                        Book Consultation - ₹500
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Quality medicines and supplies for your beloved pets
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <Card key={index} className="group hover:shadow-warm transition-all duration-300 border-border/50 overflow-hidden">
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground">{product.name}</h3>
                  <p className="text-primary font-bold">₹{product.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/products">
              <Button variant="outline" size="lg">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
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
              Dr. Sharma is here to help. Book a consultation today 
              and get personalized care for your beloved pet.
            </p>
            <Link to="/consultation">
              <Button size="lg" variant="secondary">
                Book Consultation Now
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