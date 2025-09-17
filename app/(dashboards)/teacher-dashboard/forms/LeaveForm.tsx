'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function LeaveForm() {
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // assume API call
      await new Promise((res) => setTimeout(res, 1500));
      toast.success('Leave request submitted successfully');
      setFrom('');
      setTo('');
      setReason('');
    } catch (err) {
      toast.error('Failed to submit leave request');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 mt-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-32" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4 bg-white dark:bg-[#122031] p-5 rounded-md">
      <div>
        <Label className='mb-1'>Leave From</Label>
        <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} required className='py-7'/>
      </div>
      <div>
        <Label className='mb-1'>Leave End</Label>
        <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} required className='py-7'/>
      </div>
      <div>
        <Label className='mb-1'>Reason</Label>
        <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder='Reason' rows={30} required className=''/>
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
}
