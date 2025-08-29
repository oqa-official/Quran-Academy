"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"
import { FileText, Clock } from "lucide-react"

const lessons = [
  { id: 1, title: "Importance of Quran", duration: "2 Days" },
  { id: 2, title: "The Alphabets", duration: "7 Days" },
  { id: 3, title: "Learn Alphabets With Spelling", duration: "7 Days" },
  { id: 4, title: "The Compound Letters", duration: "14 Days" },
  { id: 5, title: "The Mysterious Letters", duration: "14 Days" },
  { id: 6, title: "The Diacritic Signs", duration: "14 Days" },
  { id: 7, title: "The Tanween", duration: "14 Days" },
  { id: 8, title: "Exercise of Tanween and Movement", duration: "21 Days" },
  { id: 9, title: "The Madd Letters", duration: "14 Days" },
  { id: 10, title: "The Maddoleen", duration: "28 Days" },
  { id: 11, title: "Exercise of Previous all Lessons", duration: "28 Days" },
  { id: 12, title: "The Sakoon and Jazm", duration: "14 Days" },
]

// helper for truncating only in mobile
const truncateForMobile = (text: string, length: number) => {
  if (typeof window !== "undefined" && window.innerWidth < 768) {
    return text.length > length ? text.slice(0, length) + "…" : text
  }
  return text
}

export default function CurriculumTab() {
  return (
    <Card className="p-4 lg:px-10">
      <h2 className="font-semibold text-lg mb-4">Learn Quranic Studies for beginner</h2>
      <Accordion type="single" collapsible className="w-full">
        {lessons.map((lesson) => (
          <AccordionItem key={lesson.id} value={`lesson-${lesson.id}`} className="border-b">
            <AccordionTrigger className="flex justify-between items-center py-3">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-yellow-500" />
                <span className="text-xs md:text-sm font-medium">
                  Lesson {lesson.id}{" "}
                  <span className="ml-2 font-semibold">
                    {truncateForMobile(lesson.title, 15)}
                  </span>
                </span>
              </div>
              <div className="flex items-center space-x-2 ms-auto">
                <Clock className="w-4 h-4 text-gray-500 hidden md:flex" />
                <span className="text-xs md:text-sm text-gray-600 whitespace-nowrap">{lesson.duration}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-gray-600 px-8 py-2">
                Lesson content will be shown here (you can add videos, text, or resources).
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  )
}
