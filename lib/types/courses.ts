// lib/types.ts

export interface CurriculumItem {
  lessonNumber: number;
  lessonName: string;
  lessonDuration: string;
  lessonDescription: string;
}

export interface CourseOverview {
  summary: string;
  whatYouLearn: string;
  whoFor: string;
  requirements: string;
  certification: string;
}


export interface Course {
  _id?: string;
  image: string;
  cloudinaryImageId: string;
  title: string;
  rating?: number;
  reviewsCount?: number;
  duration: string;
  price: number;
  instructor: string; // instructor _id
  overview: CourseOverview;
  curriculum: CurriculumItem[];
  reviews: string[];
}



export const COURSE_LEVELS = [
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
];

export const COURSE_CATEGORIES = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "UI/UX Design",
  "Business",
  "Marketing",
];
