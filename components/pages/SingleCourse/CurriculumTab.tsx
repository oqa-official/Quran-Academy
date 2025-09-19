
"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { FileText, Clock } from "lucide-react";

interface Lesson {
  _id: string;
  lessonNumber?: number;
  lessonName?: string;
  lessonDuration?: string;
  lessonDescription?: string;
}

// helper for truncating only in mobile
const truncateForMobile = (text: string, length: number) => {
  if (typeof window !== "undefined" && window.innerWidth < 768) {
    return text.length > length ? text.slice(0, length) + "…" : text;
  }
  return text;
};

export default function CurriculumTab({ curriculum }: { curriculum: Lesson[] }) {
  if (!curriculum || curriculum.length === 0) {
    return (
      <Card className="p-4 lg:px-10">
        <p className="text-sm text-gray-600">No curriculum available.</p>
      </Card>
    );
  }

  return (
    <Card className="p-4 lg:px-10">
      <h2 className="font-semibold text-lg mb-4">Curriculum</h2>
      <Accordion type="single" collapsible className="w-full">
        {curriculum.map((lesson) => (
          <AccordionItem key={lesson._id} value={`lesson-${lesson._id}`} className="border-b">
            <AccordionTrigger className="flex justify-between items-center py-3">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-yellow-500" />
                <span className="text-xs md:text-sm font-medium">
                  {lesson.lessonNumber ? `Lesson ${lesson.lessonNumber}` : "Lesson"}{" "}
                  {lesson.lessonName && (
                    <span className="ml-2 font-semibold">
                      {truncateForMobile(lesson.lessonName, 15)}
                    </span>
                  )}
                </span>
              </div>
              {lesson.lessonDuration && (
                <div className="flex items-center space-x-2 ms-auto">
                  <Clock className="w-4 h-4 text-gray-500 hidden md:flex" />
                  <span className="text-xs md:text-sm text-gray-600 whitespace-nowrap">
                    {lesson.lessonDuration}
                    {" "}Days
                  </span>
                </div>
              )}
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-gray-600 px-8 py-2">
                {lesson.lessonDescription || "No description provided."}
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
}
