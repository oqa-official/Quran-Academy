'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

export default function OurPolicies() {
  return (
    <div className=" mt-10 pb-20  max-md:min-h-[100vh] container px-32">

      <Tabs defaultValue="payment" className="w-full ">
        {/* Tabs */}
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 gap-2 min-h-[50px]">
          <TabsTrigger
            value="payment"
            className="data-[state=active]:bg-primary data-[state=active]:text-white bg-white"
          >
            Payment Policy
          </TabsTrigger>
          <TabsTrigger
            value="attendance"
            className="data-[state=active]:bg-primary data-[state=active]:text-white bg-white"
          >
            Attendance Policy
          </TabsTrigger>
          <TabsTrigger
            value="referral"
            className="data-[state=active]:bg-primary data-[state=active]:text-white bg-white"
          >
            Friend Referral Policy
          </TabsTrigger>
        </TabsList>

        {/* Payment Policy */}
        <TabsContent value="payment" className="min-h-[400px] mt-6 max-md:mt-20">
          <Card>
            <CardContent className="p-6 space-y-3">
              <ul className="list-none pl-6 space-y-4">
                <li><strong className='font-merriweather text-lg'>Advance Payment:<br/></strong> Payment will be charged after the Free Trials in advance, on a monthly basis before the end of the month.</li>
                <li><strong className='font-merriweather text-lg'>Pay by Days/Weeks:<br/></strong> Academy will charge according to the days/week you choose for a month.</li>
                <li><strong className='font-merriweather text-lg'>Pay on Eid Holidays:<br/></strong> Eid Holidays are included in the monthly fees of the students and there is no refund for that.</li>
                <li><strong className='font-merriweather text-lg'>Remaining Hours:<br/></strong> If you have any remaining hours it will be saved for next month.</li>
                <li><strong className='font-merriweather text-lg'>Hold Classes:<br/></strong> If student doesn’t pay till 10th day after the end of the month then a fine ($5.00 extra, may vary) will apply and classes may be held.</li>
                <li><strong className='font-merriweather text-lg'>Left Academy:<br/></strong> If you stop classes and have remaining hours, we will refund them In Shaa Allah at the beginning of next month.</li>
                <li><strong className='font-merriweather text-lg'>Payment Methods:<br/></strong> All Credit/Debit Cards, Western Union, or Bank Transfer.</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Policy */}
        <TabsContent value="attendance" className="min-h-[400px] mt-6 max-md:mt-20">
          <Card>
            <CardContent className="p-6 space-y-3">
              <ul className=" pl-6 space-y-2">
                <li><strong className='font-merriweather text-lg'>On-Time:<br/></strong> Student should be online at the time of class.</li>
                <li><strong className='font-merriweather text-lg'>Postpone Class:<br/></strong> If you cannot attend, give at least 4 hours notice and arrange a make-up with your teacher.</li>
                <li><strong className='font-merriweather text-lg'>Cancel Class:<br/></strong> If you cancel with short notice, it will be counted.</li>
                <li><strong className='font-merriweather text-lg'>Login Late:<br/></strong> If you login late, teacher will give you the remaining time only.</li>
                <li><strong className='font-merriweather text-lg'>Not Attend:<br/></strong> Teacher will wait 15 minutes; session will be counted except for sudden emergencies.</li>
                <li><strong className='font-merriweather text-lg'>Make-Up Class:<br/></strong> No make-up if absent without notice; teachers are still paid for that class.</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Friend Referral Policy */}
        <TabsContent value="referral" className="min-h-[400px] mt-6 max-md:mt-20">
          <Card>
            <CardContent className="p-6 space-y-3">
              <ul className=" pl-6 space-y-2">
                <li><strong className='font-merriweather text-lg'>One Friend:<br/></strong> Refer a friend and get 20% discount for 1 Month if the student starts with us.</li>
                <li><strong className='font-merriweather text-lg'>Five Friends:<br/></strong> Refer 5 friends and get 20% discount for 5 Months if they continue learning with us.</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
