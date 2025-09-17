'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function QuitForm() {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1500));
      toast.success('Quit request submitted');
      setReason('');
      setDetails('');
    } catch {
      toast.error('Failed to submit quit form');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 mt-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-32" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4 p-5 bg-white rounded-md dark:bg-[#122031]">
      <div>
        <Label className='mb-1'>Reason to Quit</Label>
        <Select value={reason} onValueChange={setReason} >
          <SelectTrigger className='w-full py-7'>
            <SelectValue placeholder="Select reason" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="personal">Personal Reasons</SelectItem>
            <SelectItem value="schedule">Schedule Conflict</SelectItem>
            <SelectItem value="teacher">Student Related</SelectItem>
            <SelectItem value="financial">Financial Reasons</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className='mb-1'>Explain</Label>
        <Textarea value={details} onChange={(e) => setDetails(e.target.value)} required />
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
}
