'use client'

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, CalendarDays, BookOpen, DollarSign } from "lucide-react"

function FeeStructureCard({ course }: { course: any }) {
  const [days, setDays] = useState(3) // default
  const [duration, setDuration] = useState(60) // default 60 mins

  // handle days (min 2, max 5)
  const handleDaysChange = (value: number) => {
    if (value >= 2 && value <= 5) {
      setDays(value)
    }
  }

  // toggle duration (only 30 or 60)
  const toggleDuration = () => {
    setDuration(duration === 60 ? 30 : 60)
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-5">
        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-800">Fee Structure</h3>

        {/* Course Duration */}
        <div className="flex items-center gap-3  text-primary p-2 rounded-md">
          <Clock size={18} />
          <span className="font-medium">Course Duration:</span>
          <span className="ml-auto">{course.duration ? course.duration : "2 Years"}</span>
        </div>

        {/* Days/Week */}
        <div className="flex items-center gap-3  text-primary p-2 rounded-md">
          <CalendarDays size={18} />
          <span className="font-medium">Days/Week:</span>
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDaysChange(days - 1)}
              disabled={days <= 2}
            >
              -
            </Button>
            <span>{days}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDaysChange(days + 1)}
              disabled={days >= 5}
            >
              +
            </Button>
          </div>
        </div>

        {/* Duration per class */}
        <div className="flex items-center gap-3  text-primary p-2 rounded-md">
          <BookOpen size={18} />
          <span className="font-medium">Duration/Class:</span>
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleDuration}
            >
              {duration === 60 ? "-" : "+"}
            </Button>
            <span>{duration} Mins</span>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleDuration}
            >
              {duration === 30 ? "+" : "-"}
            </Button>
          </div>
        </div>

        {/* Classes/Month */}
        <div className="flex items-center gap-3  text-primary p-2 rounded-md">
          <CalendarDays size={18} />
          <span className="font-medium">Classes/Month:</span>
          <span className="ml-auto">20 Classes</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-3  text-primary p-2 rounded-md">
          <DollarSign size={18} />
          <span className="font-medium">Price:</span>
          <span className="ml-auto text-xl font-medium text-accent">${course.price ? course.price : "80"} / Month</span>
        </div>

       

        {/* Enroll Button */}
        <Button size={'lg'} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold">
          Enroll Now
        </Button>
      </CardContent>
    </Card>
  )
}

export default FeeStructureCard
