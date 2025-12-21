import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
  discount_percentage: number | null;
}

interface Order {
  id: string;
  created_at: string | null;
  total_amount: number;
  status: string | null;
  payment_method: string | null;
  payment_status: string | null;
  shipping_address: string | null;
  notes: string | null;
  order_items: OrderItem[];
}

interface OrderDetailsDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OrderDetailsDialog = ({ order, open, onOpenChange }: OrderDetailsDialogProps) => {
  if (!order) return null;

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Order #{order.id.slice(0, 8).toUpperCase()}
            <Badge className={`${getStatusColor(order.status || 'pending')} text-white`}>
              {order.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Date:</span>
              <p className="font-medium">
                {order.created_at ? format(new Date(order.created_at), 'PPp') : 'N/A'}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Payment Method:</span>
              <p className="font-medium">
                {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Payment Status:</span>
              <p className="font-medium capitalize">{order.payment_status || 'N/A'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Total Amount:</span>
              <p className="font-medium text-lg">₹{order.total_amount.toFixed(2)}</p>
            </div>
          </div>

          <Separator />

          {/* Shipping Address */}
          <div>
            <h4 className="font-semibold mb-2">Shipping Address</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {order.shipping_address || 'No address provided'}
            </p>
          </div>

          {order.notes && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Order Notes</h4>
                <p className="text-sm text-muted-foreground">{order.notes}</p>
              </div>
            </>
          )}

          <Separator />

          {/* Order Items */}
          <div>
            <h4 className="font-semibold mb-3">Order Items ({order.order_items?.length || 0})</h4>
            <div className="space-y-3">
              {order.order_items?.map((item) => {
                const discountedPrice = item.discount_percentage
                  ? item.price * (1 - item.discount_percentage / 100)
                  : item.price;
                const itemTotal = discountedPrice * item.quantity;

                return (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-sm text-muted-foreground">
                        ₹{discountedPrice.toFixed(2)} × {item.quantity}
                        {item.discount_percentage ? (
                          <span className="ml-2 text-green-600">
                            ({item.discount_percentage}% off)
                          </span>
                        ) : null}
                      </p>
                    </div>
                    <p className="font-semibold">₹{itemTotal.toFixed(2)}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Total */}
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total</span>
            <span>₹{order.total_amount.toFixed(2)}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
