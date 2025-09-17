'use client';

import { useUser } from '@/context/UserContext';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import InstructorEditProfileForm from './InstructorEditProfileForm';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import InstructorChangePassword from './InstructorChangePasswordForm';

interface Instructor {
  _id: string;
  userId: string;
  name: string;
  designation?: string;
  about?: string;
  qualifications?: string[];
  image?: string;
  email?: string;
  number?: string;
  educationMail: string;
  emergencyNumber?: string;
}

export default function Page() {
  const { userId, loading: userLoading } = useUser();
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openEdit, setOpenEdit] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError('No user ID found');
      return;
    }

    const fetchInstructor = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/db/instructors/${userId}`);
        if (!res.ok) throw new Error(`Failed to fetch instructor: ${res.status}`);
        const data = await res.json();

        if (!data) throw new Error('Instructor data not found');

        setInstructor(data);
      } catch (err: any) {
        console.error('Error fetching instructor:', err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchInstructor();
  }, [userId]);

  if (userLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto mt-10 space-y-6 ">
        <h2 className="text-2xl">Loading Personal Info...</h2>
        <Skeleton className="h-8 w-1/3 bg-primary dark:bg-[#122031]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full bg-primary dark:bg-[#122031]" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-10 text-red-600">{error}</div>;
  }

  if (!instructor) {
    return <div className="text-center mt-10">Instructor not found</div>;
  }

  return (
    <div className="max-w-7xl  mt-10 space-y-6">
      <Card className='dark:bg-[#122031]'>
        <CardHeader>
          <CardTitle className="text-xl">Instructor Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 ">
          <h2 className="text-lg font-semibold">Personal Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Instructor ID</Label>
              <Input value={instructor.userId || 'N/A'} readOnly />
            </div>
            <div>
              <Label>Name</Label>
              <Input value={instructor.name || 'N/A'} readOnly />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={instructor.email || 'N/A'} readOnly />
            </div>
            <div>
              <Label>Educational Email</Label>
              <Input value={instructor.educationMail || 'N/A'} readOnly />
            </div>
            <div>
              <Label>Contact Number</Label>
              <Input value={instructor.number || 'N/A'} readOnly />
            </div>
            <div>
              <Label>Emergency Number</Label>
              <Input value={instructor.emergencyNumber || 'N/A'} readOnly />
            </div>
          </div>

          <div>
            <Label>Qualifications</Label>
            <Textarea
              value={
                instructor.qualifications?.length
                  ? instructor.qualifications.join('\n')
                  : 'N/A'
              }
              readOnly
            />
          </div>

          <div className="pt-4 flex gap-4">
            <Button onClick={() => setOpenEdit(true)}>Edit Profile</Button>
            <Button variant="outline" className='hover:bg-primary hover:text-white' onClick={() => setOpenChangePassword(true)}>
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <InstructorEditProfileForm
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        instructor={instructor}
        onSave={(updated) => setInstructor(updated)}
      />

      {/* Change Password Dialog */}
      <InstructorChangePassword
        open={openChangePassword}
        onClose={() => setOpenChangePassword(false)}
        instructor={instructor}
        onSave={(updated) => setInstructor(updated)}
      />
    </div>
  );
}
