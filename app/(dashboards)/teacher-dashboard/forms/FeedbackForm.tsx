'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function FeedbackForm() {
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [explain, setExplain] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1500));
      toast.success('Feedback submitted successfully');
      setTopic('');
      setExplain('');
    } catch {
      toast.error('Failed to submit feedback');
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
    <form onSubmit={handleSubmit} className="space-y-4 mt-4 p-5 bg-white dark:bg-[#122031] rounded-md">
      <div>
        <Label className='mb-1'>Feedback Type</Label>
        <Select value={topic} onValueChange={setTopic}>
          <SelectTrigger className='w-full py-7'>
            <SelectValue placeholder="Select feedback type" className='w-full'/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="timing">Student Timing</SelectItem>
            <SelectItem value="qualification">Student Qualifications</SelectItem>
            <SelectItem value="change-teacher">Change Student</SelectItem>
            <SelectItem value="behaviour">Student Behaviour</SelectItem>
            <SelectItem value="change-time">Change Time</SelectItem>
            <SelectItem value="change-days">Change Days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className='mb-1'>Explain your query</Label>
        <Textarea value={explain} onChange={(e) => setExplain(e.target.value)} required />
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
}
