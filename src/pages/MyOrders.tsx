import { Package, Clock, CheckCircle, Truck } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const MyOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { orders, isLoading } = useOrders();

  if (!user) {
    navigate('/auth');
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500';
      case 'processing':
        return 'bg-blue-500';
      case 'shipped':
        return 'bg-purple-500';
      case 'delivered':
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

  if (!orders || orders.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">No orders yet</h2>
          <p className="text-muted-foreground">Start shopping to see your orders here!</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">My Orders</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(order.created_at!), 'PPP')}
                    </p>
                  </div>
                  <Badge className={`${getStatusColor(order.status || 'pending')} text-white`}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(order.status || 'pending')}
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                    </span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <span className="text-foreground">
                        {item.product_name} × {item.quantity}
                      </span>
                      <span className="text-muted-foreground">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="font-medium">Total</span>
                    <span className="font-bold text-primary">
                      ₹{order.total_amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p><strong>Shipping:</strong> {order.shipping_address}</p>
                    <p><strong>Payment:</strong> {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online'} ({order.payment_status})</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default MyOrders;
