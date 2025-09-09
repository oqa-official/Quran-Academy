"use client";

import { useEffect, useState } from "react";
import StudentForm from "./StudentForm";
import FormWrapper from "../FormWrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function StepTwo({ formData, setFormData, goBack, handleSubmit, loading }: any) {
  const emptyStudent = () => ({
    name: "",
    email: "",
    phone: "",
    age: "",
    frequency: "",
    classDays: [],
    timezone: "",
    preferredStartDate: "",
    preferredStartTime: "",
    price: "",
  });

  // ✅ Initialize students immediately to avoid empty first render
  const [students, setStudents] = useState<any[]>(
    formData.forWhom === "myself"
      ? [formData.students?.[0] || emptyStudent()]
      : formData.students.length > 0
      ? formData.students
      : Array.from({ length: formData.studentCount }, () => emptyStudent())
  );

  // 🟢 Sync when switching between "myself" and "children"
  useEffect(() => {
    if (formData.forWhom === "myself") {
      setStudents([formData.students?.[0] || emptyStudent()]);
    } else {
      if (!formData.students || formData.students.length === 0) {
        const initialized = Array.from({ length: formData.studentCount }, () => emptyStudent());
        setStudents(initialized);
      } else {
        setStudents(formData.students);
      }
    }
  }, [formData.forWhom, formData.studentCount]);

  const handleStudentChange = (index: number, updated: any) => {
    const newStudents = [...students];
    newStudents[index] = updated;
    setStudents(newStudents);
  };

  const addStudent = () => setStudents([...students, emptyStudent()]);

  const removeStudent = (index: number) => {
    if (students.length > 1) {
      const newStudents = students.filter((_, i) => i !== index);
      setStudents(newStudents);
    }
  };

  // ✅ Validation
  const isFormValid =
    students.length > 0 &&
    students.every(
      (s: any) =>
        s?.name &&
        s?.email &&
        s?.phone &&
        s?.age &&
        s?.frequency &&
        (s?.classDays?.length || 0) > 0 &&
        s?.timezone &&
        s?.preferredStartDate &&
        s?.preferredStartTime
    );

 const saveAndSubmit = () => {
    const updatedForm = {
      ...formData,
      students,
      studentCount: students.length,
    };

    setFormData(updatedForm); // update local state (for consistency)
    handleSubmit(updatedForm); // ✅ pass directly so API always gets latest
  };

  return (
    <FormWrapper classname="max-w-5xl" title="Fill Student Details" step={2} totalSteps={2} hideProgress>
      <div className="space-y-6">
        {formData.forWhom === "myself" ? (
          // ✅ Render only if students[0] exists
          students[0] && (
            <StudentForm
              basePrice={20}
              index={0}
              data={students[0]}
              onChange={(updated: any) => handleStudentChange(0, updated)}
            />
          )
        ) : (
          <>
            <Accordion type="single" collapsible className="w-full space-y-3">
              {students.map((student, i) => (
                <AccordionItem key={i} value={`student-${i}`}>
                  <AccordionTrigger className="no-underline hover:no-underline focus:no-underline">
                    <div className="flex justify-between w-full">
                      <span>Student {i + 1}</span>
                      {students.length > 1 && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Remove
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Student {i + 1}?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action will permanently remove this student from the form.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => removeStudent(i)} className="bg-red-600 hover:bg-red-700">
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <StudentForm
                      basePrice={20}
                      index={i}
                      data={student}
                      onChange={(updated: any) => handleStudentChange(i, updated)}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Add Student button */}
            <div className="flex justify-end">
              <Button onClick={addStudent} variant="outline">
                + Add Student
              </Button>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={goBack} className="px-4 py-2 bg-gray-200 rounded-md">
          Back
        </button>
        <button
          onClick={saveAndSubmit}
          disabled={!isFormValid && loading}
          className={`px-4 py-2 rounded-md text-white ${
            isFormValid ? "bg-primary hover:bg-accent" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Submit
        </button>
      </div>
    </FormWrapper>
  );
}
