import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface DoctorForm {
  id?: string;
  name: string;
  specialization: string;
  qualification: string;
  bio: string;
  experience_years: number;
  consultation_fee: number;
  image_url: string;
  is_available: boolean;
}

const emptyForm: DoctorForm = {
  name: '',
  specialization: '',
  qualification: '',
  bio: '',
  experience_years: 0,
  consultation_fee: 0,
  image_url: '',
  is_available: true,
};

export const AdminDoctors = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<DoctorForm>(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  
  const queryClient = useQueryClient();

  const { data: doctors, isLoading } = useQuery({
    queryKey: ['admin-doctors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (doctor: DoctorForm) => {
      if (isEditing && doctor.id) {
        const { error } = await supabase
          .from('doctors')
          .update({
            name: doctor.name,
            specialization: doctor.specialization || null,
            qualification: doctor.qualification || null,
            bio: doctor.bio || null,
            experience_years: doctor.experience_years || null,
            consultation_fee: doctor.consultation_fee || null,
            image_url: doctor.image_url || null,
            is_available: doctor.is_available,
          })
          .eq('id', doctor.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('doctors').insert({
          name: doctor.name,
          specialization: doctor.specialization || null,
          qualification: doctor.qualification || null,
          bio: doctor.bio || null,
          experience_years: doctor.experience_years || null,
          consultation_fee: doctor.consultation_fee || null,
          image_url: doctor.image_url || null,
          is_available: doctor.is_available,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-doctors'] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      setDialogOpen(false);
      setForm(emptyForm);
      toast.success(isEditing ? 'Doctor updated!' : 'Doctor added!');
    },
    onError: (error) => {
      toast.error('Failed to save doctor');
      console.error(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('doctors').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-doctors'] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      toast.success('Doctor deleted!');
    },
    onError: () => {
      toast.error('Failed to delete doctor');
    },
  });

  const handleEdit = (doctor: any) => {
    setForm({
      id: doctor.id,
      name: doctor.name,
      specialization: doctor.specialization || '',
      qualification: doctor.qualification || '',
      bio: doctor.bio || '',
      experience_years: doctor.experience_years || 0,
      consultation_fee: doctor.consultation_fee || 0,
      image_url: doctor.image_url || '',
      is_available: doctor.is_available ?? true,
    });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setForm(emptyForm);
    setIsEditing(false);
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Doctors Management</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Add Doctor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Doctor' : 'Add New Doctor'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Doctor Name *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Dr. John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    value={form.specialization}
                    onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                    placeholder="Veterinary Specialist"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="qualification">Qualification</Label>
                <Input
                  id="qualification"
                  value={form.qualification}
                  onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                  placeholder="BVSc & AH, MVSc"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={3}
                  placeholder="Brief description about the doctor..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience (years)</Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    value={form.experience_years}
                    onChange={(e) => setForm({ ...form, experience_years: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fee">Consultation Fee (₹)</Label>
                  <Input
                    id="fee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.consultation_fee}
                    onChange={(e) => setForm({ ...form, consultation_fee: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  placeholder="https://example.com/doctor-image.jpg"
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="available"
                  checked={form.is_available}
                  onCheckedChange={(checked) => setForm({ ...form, is_available: checked })}
                />
                <Label htmlFor="available">Available for Consultations</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctors?.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell className="font-medium">{doctor.name}</TableCell>
                    <TableCell>{doctor.specialization || '-'}</TableCell>
                    <TableCell>{doctor.experience_years ? `${doctor.experience_years} yrs` : '-'}</TableCell>
                    <TableCell>{doctor.consultation_fee ? `₹${doctor.consultation_fee}` : '-'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        doctor.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {doctor.is_available ? 'Available' : 'Unavailable'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(doctor)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteMutation.mutate(doctor.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {doctors?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No doctors found. Add your first doctor!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
