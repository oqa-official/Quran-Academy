'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LeaveForm from './LeaveForm';
import FeedbackForm from './FeedbackForm';
import QuitForm from './QuitForm';

export default function StudentForms() {
  return (
    <div className="mx-auto mt-10 px-6 md:px-10 max-md:min-h-[100vh]">
      <h2 className="text-xl font-semibold mb-6">Teacher Forms</h2>

      <Tabs defaultValue="leave" className="w-full ">
        {/* Responsive Tab Buttons */}
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 gap-2 min-h-[50px]">
          <TabsTrigger
            value="leave"
            className="data-[state=active]:bg-primary data-[state=active]:text-white bg-white"
          >
            Leave Form
          </TabsTrigger>
          <TabsTrigger
            value="feedback"
            className="data-[state=active]:bg-primary data-[state=active]:text-white bg-white"
          >
            Feedback Form
          </TabsTrigger>
          <TabsTrigger
            value="quit"
            className="data-[state=active]:bg-primary data-[state=active]:text-white bg-white"
          >
            Quit Form
          </TabsTrigger>
        </TabsList>

        {/* Tab Contents */}
        <TabsContent value="leave" className="min-h-[400px] mt-6 max-md:mt-20">
          <LeaveForm />
        </TabsContent>

        <TabsContent value="feedback" className="min-h-[400px] mt-6 max-md:mt-20">
          <FeedbackForm />
        </TabsContent>

        <TabsContent value="quit" className="min-h-[400px] mt-6 max-md:mt-20">
          <QuitForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
