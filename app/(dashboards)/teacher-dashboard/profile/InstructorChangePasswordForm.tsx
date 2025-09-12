'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface InstructorChangePasswordProps {
  open: boolean;
  onClose: () => void;
  instructor: any; // full instructor object
  onSave?: (updated: any) => void; // optional callback to update parent state
}

export default function InstructorChangePassword({
  open,
  onClose,
  instructor,
  onSave,
}: InstructorChangePasswordProps) {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validatePassword = (password: string) => {
    const regex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{10,}$/;
    return regex.test(password);
  };

const handleSubmit = async () => {
  // Check if any field is empty
  if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
    toast.error('Please fill in all fields');
    return;
  }

  // Check current password
  if (form.currentPassword !== instructor.password) {
    toast.error('Current password is incorrect');
    return;
  }

  // Validate new password match
  if (form.newPassword !== form.confirmPassword) {
    toast.error('New passwords do not match');
    return;
  }

  // Validate new password strength
  if (!validatePassword(form.newPassword)) {
    toast.error(
      'Password must be 10+ chars with uppercase, number, special char'
    );
    return;
  }

  try {
    setSaving(true);

    const updatedInstructor = { ...instructor, password: form.newPassword };
    const res = await fetch(`/api/db/instructors/${instructor._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedInstructor),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to change password');

    toast.success('Password changed successfully');
    onSave?.(data);
    onClose();
  } catch (err: any) {
    toast.error(err.message || 'Error changing password');
  } finally {
    setSaving(false);
  }
};


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Current Password</Label>
            <Input
              type="password"
              required
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>New Password</Label>
            <Input
              type="password"
              required
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Confirm New Password</Label>
            <Input
              type="password"
              required
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? 'Changing...' : 'Change Password'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
