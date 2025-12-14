import { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, CreditCard, Banknote } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useCart, useUpdateCartItem, useRemoveFromCart, useClearCart } from '@/hooks/useCart';
import { useCreateOrder } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: cartItems, isLoading } = useCart();
  const updateQuantity = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();
  const clearCart = useClearCart();
  const createOrder = useCreateOrder();
  
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [notes, setNotes] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!user) {
    navigate('/auth');
    return null;
  }

  const subtotal = cartItems?.reduce((sum, item) => {
    const price = item.products?.price || 0;
    const discount = item.products?.discount_percentage || 0;
    const discountedPrice = price * (1 - discount / 100);
    return sum + discountedPrice * (item.quantity || 1);
  }, 0) || 0;

  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  const handleQuantityChange = (itemId: string, productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart.mutate(itemId);
    } else {
      updateQuantity.mutate({ itemId, quantity: newQuantity });
    }
  };

  const handleCheckout = async () => {
    if (!shippingAddress.trim()) {
      toast.error('Please enter a shipping address');
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsCheckingOut(true);

    const orderItems = cartItems.map((item) => ({
      productId: item.product_id,
      productName: item.products?.name || 'Unknown Product',
      quantity: item.quantity || 1,
      price: item.products?.price || 0,
      discountPercentage: item.products?.discount_percentage || 0,
    }));

    createOrder.mutate({
      items: orderItems,
      totalAmount: total,
      shippingAddress,
      paymentMethod: paymentMethod as 'cod' | 'online',
      notes,
    }, {
      onSuccess: () => {
        clearCart.mutate();
        setIsCheckingOut(false);
        navigate('/my-orders');
      },
      onError: () => {
        setIsCheckingOut(false);
      }
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add some products to get started!</p>
          <Button onClick={() => navigate('/products')}>Browse Products</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const price = item.products?.price || 0;
              const discount = item.products?.discount_percentage || 0;
              const discountedPrice = price * (1 - discount / 100);

              return (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={item.products?.image_url || '/placeholder.svg'}
                        alt={item.products?.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{item.products?.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-primary font-medium">
                            ₹{discountedPrice.toFixed(2)}
                          </span>
                          {discount > 0 && (
                            <span className="text-sm text-muted-foreground line-through">
                              ₹{price.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center border rounded-lg">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleQuantityChange(item.id, item.product_id, (item.quantity || 1) - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="px-3 text-sm">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleQuantityChange(item.id, item.product_id, (item.quantity || 1) + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => removeFromCart.mutate(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-foreground">
                          ₹{(discountedPrice * (item.quantity || 1)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
                </div>
                {subtotal < 500 && (
                  <p className="text-xs text-muted-foreground">
                    Add ₹{(500 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                )}
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary">₹{total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter your complete shipping address..."
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  rows={3}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Banknote className="h-5 w-5" />
                      Cash on Delivery
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg mt-2">
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5" />
                      Online Payment
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Notes (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Any special instructions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                />
              </CardContent>
            </Card>

            <Button 
              className="w-full" 
              size="lg"
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? 'Processing...' : `Place Order • ₹${total.toFixed(2)}`}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
