import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useAddresses, Address, AddressInsert } from '@/hooks/useAddresses';
import { AddressCard } from '@/components/profile/AddressCard';
import { AddressDialog } from '@/components/profile/AddressDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  User, 
  MapPin, 
  Package, 
  Stethoscope, 
  KeyRound, 
  Plus,
  Mail,
  LogOut
} from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const {
    addresses,
    isLoading: addressesLoading,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    isAdding,
    isUpdating,
  } = useAddresses();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  if (authLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-60 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleOpenAddDialog = () => {
    setEditingAddress(null);
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (address: Address) => {
    setEditingAddress(address);
    setDialogOpen(true);
  };

  const handleSubmit = (data: AddressInsert) => {
    if (editingAddress) {
      updateAddress(
        { id: editingAddress.id, updates: data },
        { onSuccess: () => setDialogOpen(false) }
      );
    } else {
      addAddress(data, { onSuccess: () => setDialogOpen(false) });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card className="overflow-hidden">
            <div className="h-24 gradient-primary" />
            <CardContent className="relative pt-0">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
                <div className="w-24 h-24 rounded-full bg-card border-4 border-card flex items-center justify-center shadow-soft">
                  <User className="w-12 h-12 text-primary" />
                </div>
                <div className="flex-1 pb-2">
                  <h1 className="text-2xl font-bold text-foreground">
                    {user.user_metadata?.full_name || 'User'}
                  </h1>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="self-start sm:self-end"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate('/my-orders')}
            >
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-2">
                  <Package className="w-6 h-6" />
                </div>
                <span className="font-medium text-foreground">My Orders</span>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate('/my-consultations')}
            >
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-accent/10 text-accent mb-2">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <span className="font-medium text-foreground">Consultations</span>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate('/change-password')}
            >
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-secondary text-secondary-foreground mb-2">
                  <KeyRound className="w-6 h-6" />
                </div>
                <span className="font-medium text-foreground">Password</span>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={handleOpenAddDialog}
            >
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-muted text-muted-foreground mb-2">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="font-medium text-foreground">Add Address</span>
              </CardContent>
            </Card>
          </div>

          {/* Addresses Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Your Addresses
              </CardTitle>
              <Button onClick={handleOpenAddDialog} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Address
              </Button>
            </CardHeader>
            <CardContent>
              {addressesLoading ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-48 w-full" />
                  ))}
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No addresses saved
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Add your first delivery address to get started
                  </p>
                  <Button onClick={handleOpenAddDialog}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Address
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {addresses.map((address) => (
                    <AddressCard
                      key={address.id}
                      address={address}
                      onEdit={handleOpenEditDialog}
                      onDelete={deleteAddress}
                      onSetDefault={setDefaultAddress}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AddressDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        address={editingAddress}
        onSubmit={handleSubmit}
        isLoading={isAdding || isUpdating}
      />
    </Layout>
  );
};

export default Profile;
