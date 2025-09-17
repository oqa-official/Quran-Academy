'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import 'react-international-phone/style.css';
import { PhoneInput } from 'react-international-phone';

interface InstructorEditProfileFormProps {
  open: boolean;
  onClose: () => void;
  instructor: any;
  onSave: (updated: any) => void;
}

export default function InstructorEditProfileForm({
  open,
  onClose,
  instructor,
  onSave,
}: InstructorEditProfileFormProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    number: '',
    emergencyNumber: '',
    qualifications: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (instructor) {
      setForm({
        name: instructor.name || '',
        email: instructor.email || '',
        number: instructor.number || '',
        emergencyNumber: instructor.emergencyNumber || '',
        qualifications: instructor.qualifications?.join('\n') || '',
      });
    }
  }, [instructor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (field: 'number' | 'emergencyNumber', value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);

      const body = {
        ...form,
        qualifications: form.qualifications
          .split('\n')
          .map((q) => q.trim())
          .filter((q) => q),
      };

      const res = await fetch(`/api/db/instructors/${instructor._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Update failed');
      const updated = await res.json();
      onSave(updated);
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to update instructor profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='dark:bg-[#122031]'>
        <DialogHeader>
          <DialogTitle>Edit Instructor Profile</DialogTitle>
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
            <Label>Contact Number</Label>
            <PhoneInput
              defaultCountry="US"
              preferredCountries={['US', 'GB', 'CA', 'AU']}
              value={form.number}
              onChange={(value:any) => handlePhoneChange('number', value || '')}
              inputClassName="w-full border rounded-sm p-2 bg-transparent"
              className="bg-transparent"
            />
          </div>
          <div>
            <Label>Emergency Number</Label>
            <PhoneInput
              defaultCountry="US"
              preferredCountries={['US', 'GB', 'CA', 'AU']}
              value={form.emergencyNumber}
              onChange={(value:any) => handlePhoneChange('emergencyNumber', value || '')}
              inputClassName="w-full border rounded-sm p-2 bg-transparent"
              className="bg-transparent"
            />
          </div>
          <div>
            <Label>Qualifications (one per line)</Label>
            <Textarea name="qualifications" value={form.qualifications} onChange={handleChange} />
          </div>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
