'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

interface StudentEditProfileFormProps {
  open: boolean;
  onClose: () => void;
  student: any;
  onSave: (s: any) => void;
}

export default function StudentEditProfileForm({
  open,
  onClose,
  student,
  onSave,
}: StudentEditProfileFormProps) {
  const [form, setForm] = useState({
    ...student,
    dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().slice(0, 10) : '',
    gender: student.gender || '',
    phone: student.phone || '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenderChange = (value: string) => {
    setForm({ ...form, gender: value });
  };

  const handlePhoneChange = (phone: string) => {
    setForm({ ...form, phone });
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const res = await fetch(`/api/db/students/${student._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Update failed');
      const updated = await res.json();
      onSave(updated);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='dark:bg-[#122031]'>
        <DialogHeader>
          <DialogTitle>Edit Student Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          <div>
            <Label>Name</Label>
            <Input name="name" value={form.name} onChange={handleChange} />
          </div>

          <div>
            <Label>Email</Label>
            <Input name="email" value={form.email} onChange={handleChange} />
          </div>

          <div>
            <Label>Phone</Label>
            <PhoneInput
              defaultCountry="us"
              preferredCountries={["us", "gb", "ca", "au"]}
              value={form.phone}
              onChange={handlePhoneChange}
              inputClassName="w-full border rounded-sm p-2 bg-transparent"
              className="bg-transparent"
            />
          </div>

          <div>
            <Label>Date of Birth</Label>
            <Input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
            />
          </div>

          <div className="w-full">
            <Label>Gender</Label>
            <Select value={form.gender} onValueChange={handleGenderChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Timezone</Label>
            <Input name="timezone" value={form.timezone} onChange={handleChange} />
          </div>

          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
