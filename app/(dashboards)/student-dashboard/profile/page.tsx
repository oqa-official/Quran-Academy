'use client';

import { useUser } from '@/context/UserContext';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import StudentEditProfileForm from './StudentEditProfileForm';

interface Student {
  _id: string;
  parentInquiry?: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  timezone: string;
  preferredStartTime?: string;
  classDays: string[];
  course: {
    _id: string;
    title: string;
    price: number;
  } | null;
  price: number;
  status: 'trial' | 'regular';
  trialClasses: {
    assigned: number;
    completed: number;
  };
  feeStatus: {
    paid: boolean;
    lastPaymentDate?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export default function Page() {
  const { userId, loading: userLoading } = useUser();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchStudent = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/db/students/${userId}`);
        if (!res.ok) throw new Error('Failed to fetch student');
        const data = await res.json();
        setStudent(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [userId]);

  if (userLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto mt-10 space-y-6">
        <h2 className='text-2xl'>Laading Personal Info...</h2>
        <Skeleton className="h-8 w-1/3 bg-primary" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full bg-primary" />
          ))}
        </div>
      </div>
    );
  }

  if (!userId) {
    return <div className="text-center mt-10">No student found</div>;
  }

  if (!student) {
    return <div className="text-center mt-10">Student not found</div>;
  }

  const [country, city] = student.timezone.split('/');

  return (
    <div className="max-w-7xl mt-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl"></CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <h2 className="text-lg font-semibold">Personal Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Name</Label>
              <Input value={student.name} readOnly />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={student.email} readOnly />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={student.phone} readOnly />
            </div>
            <div>
              <Label>Age</Label>
              <Input value={student.age} readOnly />
            </div>
            <div>
              <Label>Status</Label>
              <Input value={student.status} readOnly />
            </div>
            <div>
              <Label>Timezone</Label>
              <Input value={`${country} / ${city}`} readOnly />
            </div>
            <div>
              <Label>Course</Label>
              <Input value={student.course?.title ?? 'N/A'} readOnly />
            </div>
            <div>
              <Label>Price</Label>
              <Input value={`$${student.price}`} readOnly />
            </div>
          </div>

          <div className="pt-4">
            <Button onClick={() => setOpenEdit(true)}>Edit Profile</Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <StudentEditProfileForm
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        student={student}
        onSave={(updated) => setStudent(updated)}
      />
    </div>
  );
}
