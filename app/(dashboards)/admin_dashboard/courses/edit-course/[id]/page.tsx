"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { UploadCloud, Loader, ArrowBigLeft, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Course, CurriculumItem } from "@/lib/types/courses";
import { Instructor } from "@/lib/types/instructor";
import ReviewListAdmin from "@/components/pages/(dashboards)/Admin-Dashboard/courses/ReviewListAdmin";
import Link from "next/link";
import { useDirtyForm } from "@/context/DirtyFormContext"; // ✅ import
import { Skeleton } from "@/components/ui/skeleton";

// ✅ Local override type
interface CourseWithPopulatedInstructor extends Omit<Course, "instructor"> {
  instructor: Instructor;
}

// ✅ Curriculum Editor Component
function CurriculumEditor({
  curriculum,
  setCurriculum,
}: {
  curriculum: CurriculumItem[];
  setCurriculum: (c: CurriculumItem[]) => void;
}) {
  const [newItem, setNewItem] = useState<CurriculumItem>({
    lessonNumber: 1,
    lessonName: "",
    lessonDuration: "",
    lessonDescription: "",
  });

  const handleAdd = () => {
    if (!newItem.lessonName.trim()) return;

    const nextNumber =
      curriculum.length > 0
        ? Math.max(...curriculum.map((c) => c.lessonNumber)) + 1
        : 1;

    const updated = [
      ...curriculum,
      { ...newItem, lessonNumber: nextNumber },
    ];

    setCurriculum(updated);
    setNewItem({
      lessonNumber: nextNumber + 1,
      lessonName: "",
      lessonDuration: "",
      lessonDescription: "",
    });
  };

  const handleChange = (
    index: number,
    field: keyof CurriculumItem,
    value: string | number
  ) => {
    const updated = [...curriculum];
    updated[index] = { ...updated[index], [field]: value };
    setCurriculum(updated.sort((a, b) => a.lessonNumber - b.lessonNumber));
  };

  const handleRemove = (index: number) => {
    const updated = curriculum.filter((_, i) => i !== index);
    setCurriculum(updated);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Curriculum</h3>

      <div className="space-y-3">
        {curriculum
          .sort((a, b) => a.lessonNumber - b.lessonNumber)
          .map((item, index) => (
            <div
              key={index}
              className="p-3 border rounded space-y-2 grid grid-cols-1 md:grid-cols-2 gap-1"
            >
              <p className="text-sm font-semibold md:col-span-2">
                Lesson {item.lessonNumber}
              </p>

              <div>
                <label className="text-xs text-gray-500">Lesson Name</label>
                <Input
                  value={item.lessonName}
                  onChange={(e) =>
                    handleChange(index, "lessonName", e.target.value)
                  }
                  placeholder="Lesson Name"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">
                  Duration (Days)
                </label>
                <Input
                  type="number"
                  min={1}
                  value={item.lessonDuration}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "lessonDuration",
                      String(Math.max(1, Number(e.target.value)))
                    )
                  }
                  placeholder="Duration"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs text-gray-500">
                  Lesson Description
                </label>
                <Input
                  value={item.lessonDescription}
                  onChange={(e) =>
                    handleChange(index, "lessonDescription", e.target.value)
                  }
                  placeholder="Description"
                />
              </div>

              <Button
                variant="destructive"
                size="sm"
                className="mt-2 max-w-[100px]"
                onClick={() => handleRemove(index)}
              >
                Remove
              </Button>
            </div>
          ))}
      </div>

      <div className="mt-4 p-3 border rounded">
        <h4 className="font-medium mb-2">Add Curriculum Item</h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-500">Lesson Name</label>
            <Input
              value={newItem.lessonName}
              onChange={(e) =>
                setNewItem({ ...newItem, lessonName: e.target.value })
              }
              placeholder="Lesson Name"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">Lesson Duration</label>
            <Input
              type="number"
              min={1}
              value={newItem.lessonDuration}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  lessonDuration: String(
                    Math.max(1, Number(e.target.value))
                  ),
                })
              }
              placeholder="Duration (Days)"
            />
          </div>

          <div className="col-span-2">
            <label className="text-xs text-gray-500">
              Lesson Description
            </label>
            <Input
              value={newItem.lessonDescription}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  lessonDescription: e.target.value,
                })
              }
              placeholder="Description"
            />
          </div>
        </div>
        <Button className="mt-3" onClick={handleAdd}>
          Add Lesson
        </Button>
      </div>
    </div>
  );
}

// ✅ Main Edit Course Form
export default function EditCourseForm() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [course, setCourse] = useState<CourseWithPopulatedInstructor | null>(
    null
  );
  const [initialCourse, setInitialCourse] =
    useState<CourseWithPopulatedInstructor | null>(null); // ✅ store initial snapshot
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { setDirty } = useDirtyForm(); // ✅ hook

  // ✅ Cloudinary upload
  const uploadToCloudinary = async (file: File) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "Quran_Academy");
    data.append("folder", "course");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: data,
      }
    );

    if (!res.ok) throw new Error("Image upload failed");
    return res.json();
  };

  // ✅ Fetch course + instructors
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, instructorsRes] = await Promise.all([
          axios.get(`/api/db/courses/${id}`),
          axios.get(`/api/db/instructors`, {
             headers: {
            "x-internal-key": process.env.NEXT_PUBLIC_INTERNAL_API_KEY!,
          }
          }),
        ]);
        setCourse(courseRes.data);
        setInitialCourse(courseRes.data); // ✅ save initial copy
        setInstructors(instructorsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // ✅ Dirty check effect
  useEffect(() => {
    if (!course || !initialCourse) return;

    const isDirty =
      JSON.stringify({ ...course, instructor: course.instructor._id }) !==
        JSON.stringify({
          ...initialCourse,
          instructor: initialCourse.instructor._id,
        }) || selectedImage !== null;

    setDirty(isDirty);
  }, [course, initialCourse, selectedImage, setDirty]);

  const handleSave = async () => {
    if (!course) return;
    setSaving(true);
    try {
      let imageUrl = course.image;
      let cloudinaryId = course.cloudinaryImageId;

      if (selectedImage) {
        const uploadRes = await uploadToCloudinary(selectedImage);
        imageUrl = uploadRes.secure_url;
        cloudinaryId = uploadRes.public_id;
      }

      const payload = {
        ...course,
        image: imageUrl,
        cloudinaryImageId: cloudinaryId,
        instructor: course.instructor._id,
      };

      await axios.put(`/api/db/courses/${id}`, payload);

      setInitialCourse({ ...course, image: imageUrl }); // ✅ reset snapshot
      setSelectedImage(null);
      setDirty(false);

      toast.success("Course Updated successfully");
      router.push("/admin_dashboard/courses");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`/api/db/courses/${id}`);
      toast.success("Course deleted successfully");
      router.push("/admin_dashboard/courses");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setDeleting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  if (loading) {
    return (
      <div className="w-full p-10 grid grid-cols-2 gap-3">
       <Skeleton className="w-full h-[200px] bg-white dark:bg-[#122031] col-span-2"/>
       <Skeleton className="w-full h-[120px] bg-white dark:bg-[#122031] col-span-2"/>
       <Skeleton className="w-full h-[80px] bg-white dark:bg-[#122031]"/>
       <Skeleton className="w-full h-[80px] bg-white dark:bg-[#122031]"/>
       <Skeleton className="w-full h-[50px] bg-white dark:bg-[#122031] col-span-2"/>
       <Skeleton className="w-full h-[50px] bg-white dark:bg-[#122031] col-span-2"/>
      </div>
    );
  }

  if (!course) return <p>Course not found</p>;

  return (
    <div className=" p-6 bg-white rounded-lg dark:bg-[#122031]">
      <div className="flex flex-row justify-between mb-4">
        <h2 className="text-2xl font-bold">Edit Course</h2>

        <Link
          href="/admin_dashboard/courses"
          className="flex gap-2 items-center justify-start"
        >
          <ArrowBigLeft />
          <p className="text-lg">Go Back</p>
        </Link>
      </div>

      {/* Title / Duration / Price */}
      <label className="text-xs text-gray-500">Course Title</label>
      <Input
        value={course.title}
        onChange={(e) => setCourse({ ...course, title: e.target.value })}
        placeholder="Course Title"
        className="mb-3"
      />

      <label className="text-xs text-gray-500">Course duration</label>
      <Input
        type="number"
        min={1}
        value={course.duration}
        onChange={(e) =>
          setCourse({
            ...course,
            duration: String(Math.max(1, Number(e.target.value))),
          })
        }
        placeholder="Duration (hours)"
        className="mb-3"
      />

      {/* Course Status */}
      <div className="mb-3">
        <label className="text-xs text-gray-500">Course Status</label>
        <Select
          value={course.status || ""}
          onValueChange={(val) => setCourse({ ...course, status: val })}
        >
          <SelectTrigger className="border rounded-md h-10 w-full">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="active">Active</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <label className="text-xs text-gray-500">
        Course Price for 2 Days/week
      </label>
      <Input
        type="number"
        value={course.price}
        onChange={(e) =>
          setCourse({ ...course, price: Number(e.target.value) })
        }
        placeholder="Price"
        className="mb-3"
      />

      {/* Instructor */}
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium">
          Instructor (Current: {course?.instructor?.name || "None"})
        </label>
        <Select
          value={course.instructor?._id || ""}
          onValueChange={(val) =>
            setCourse({
              ...course,
              instructor: instructors.find((i) => i._id === val)!,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Instructor">
              {course.instructor?.name}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {instructors.map((inst) => (
              <SelectItem key={inst._id} value={inst._id}>
                {inst.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Image Upload */}
      <label className="text-xs text-gray-500">
        Change Course Banner Image
      </label>
      <div className="flex items-center gap-2 w-full p-2 border rounded mb-3">
        <UploadCloud />
        <input
          type="file"
          placeholder="Upload Image"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
      {previewUrl ? (
        <img src={previewUrl} alt="Preview" className="h-32 mt-2 rounded" />
      ) : (
        course.image && (
          <img src={course.image} alt="Current" className="h-32 mt-2 rounded" />
        )
      )}

      {/* Overview Fields */}
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="w-full text-base bg-gray-100 dark:bg-[#020D1A] my-3 p-3 shadow-md">
            Course Overview
          </AccordionTrigger>
          <AccordionContent>
            <div className="bg-gray-100 dark:bg-[#020D1A] rounded-md p-5 mt-4">
              <label className="text-xs text-gray-500">Course Summary</label>
              <textarea
                name="summary"
                placeholder="Course Summary"
                className="border p-2 w-full mb-2"
                value={course.overview?.summary || ""}
                onChange={(e) =>
                  setCourse({
                    ...course,
                    overview: { ...course.overview, summary: e.target.value },
                  })
                }
              />

              <label className="text-xs text-gray-500">What You Learn</label>
              <textarea
                name="whatYouLearn"
                placeholder="What You'll Learn"
                className="border p-2 w-full mb-2"
                value={course.overview?.whatYouLearn || ""}
                onChange={(e) =>
                  setCourse({
                    ...course,
                    overview: {
                      ...course.overview,
                      whatYouLearn: e.target.value,
                    },
                  })
                }
              />

              <label className="text-xs text-gray-500">Who For</label>
              <textarea
                name="whoFor"
                placeholder="Who is this course for?"
                className="border p-2 w-full mb-2"
                value={course.overview?.whoFor || ""}
                onChange={(e) =>
                  setCourse({
                    ...course,
                    overview: {
                      ...course.overview,
                      whoFor: e.target.value,
                    },
                  })
                }
              />

              <label className="text-xs text-gray-500">
                Course Requirements
              </label>
              <textarea
                name="requirements"
                placeholder="Requirements"
                className="border p-2 w-full mb-2"
                value={course.overview?.requirements || ""}
                onChange={(e) =>
                  setCourse({
                    ...course,
                    overview: {
                      ...course.overview,
                      requirements: e.target.value,
                    },
                  })
                }
              />

              <label className="text-xs text-gray-500">Certification</label>
              <textarea
                name="certification"
                placeholder="Certification Details"
                className="border p-2 w-full mb-2"
                value={course.overview?.certification || ""}
                onChange={(e) =>
                  setCourse({
                    ...course,
                    overview: {
                      ...course.overview,
                      certification: e.target.value,
                    },
                  })
                }
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Curriculum */}
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="w-full text-base bg-gray-100 dark:bg-[#020D1A] my-3 p-3 shadow-md">
            Course Curriculum
          </AccordionTrigger>
          <AccordionContent className="dark:bg-[#020D1A] p-3">
            <CurriculumEditor
              curriculum={course.curriculum}
              setCurriculum={(c) => setCourse({ ...course, curriculum: c })}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Reviews */}
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="w-full text-base bg-gray-100 dark:bg-[#020D1A] my-3 p-3 shadow-md">
            Course Reviews
          </AccordionTrigger>
          <AccordionContent className="dark:bg-[#020D1A]">
            <ReviewListAdmin />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Actions */}
      <div className="flex flex-col md:flex-row justify-end gap-2 mt-6">
        <Button
          className="w-full max-w-[200px]"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? <Loader className="animate-spin mx-auto" /> : "Save Changes"}
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full max-w-[200px] ">
              Delete Course
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="dark:bg-[#122031]">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The course and its curriculum will
                be permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 text-white hover:bg-red-600"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <Loader2 className="animate-spin mx-auto" />
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
