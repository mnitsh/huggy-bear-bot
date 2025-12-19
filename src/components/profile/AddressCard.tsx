import { MapPin, Edit2, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Address } from '@/hooks/useAddresses';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export const AddressCard = ({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) => {
  return (
    <Card className={`relative transition-all duration-200 hover:shadow-md ${address.is_default ? 'ring-2 ring-primary' : ''}`}>
      <CardContent className="p-4">
        {address.is_default && (
          <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
            Default
          </Badge>
        )}
        
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            <MapPin className="w-5 h-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground">{address.label}</h3>
            </div>
            
            <p className="font-medium text-foreground">{address.full_name}</p>
            <p className="text-sm text-muted-foreground">{address.phone}</p>
            
            <div className="mt-2 text-sm text-muted-foreground">
              <p>{address.address_line1}</p>
              {address.address_line2 && <p>{address.address_line2}</p>}
              <p>{address.city}, {address.state} {address.postal_code}</p>
              <p>{address.country}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(address)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Edit2 className="w-4 h-4 mr-1" />
            Edit
          </Button>
          
          {!address.is_default && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSetDefault(address.id)}
              className="text-muted-foreground hover:text-primary"
            >
              <Star className="w-4 h-4 mr-1" />
              Set as Default
            </Button>
          )}
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10 ml-auto"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Address</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this address? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(address.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};
