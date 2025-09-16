import { BookOpen, Library, MailOpen, User, Users } from "lucide-react";

export const fallbackCourses = [
  {
    _id: "fallback1", // ✅ give id for safe mapping
    title: "Learn Quranic Studies for Beginner (Level-I)",
    price: 20,
    reviews: 3,
    rating: 5,
    teacher: "Hafiz Muhammad Usman",
    students: 58,
    avatar: "/assets/home/teacher1.png",
    img: "/assets/home/course_1.png",
    fromApi: false,
  },
  {
    _id: "fallback2",
    title: "Learn Recitation of Quran (Level-II)",
    price: 25,
    reviews: 5,
    rating: 5,
    teacher: "Abdur Rehman",
    students: 72,
    avatar: "/assets/home/teacher2.png",
    img: "/assets/home/course_2.png",
    fromApi: false,
  },
  {
    _id: "fallback3",
    title: "Learn Quran with Tajweed (Level-III)",
    price: 35,
    reviews: 1,
    rating: 5,
    teacher: "Muhammad Junaid",
    students: 50,
    avatar: "/assets/home/teacher3.png",
    img: "/assets/home/course1.png",
    fromApi: false,
  },
];




// ✅ Define 12 features
export const allFeatures = [
  "Interactive Lessons",
  "Step-by-step Guidance",
  "Practical Assignments",
  "Certificate upon Completion",
  "Live Classes",
  "1-on-1 Mentorship",
  "Recorded Sessions",
  "Weekly Quizzes",
  "Progress Tracking",
  "Mobile Friendly",
  "Support Community",
  "Flexible Schedule",
];












export const adminLinks = [
  { href: '/admin-dashboard', label: 'Dashboard', icon: 'layout_dashboard' },
  { href: '/admin-dashboard/teachers', label: 'Teachers', icon: 'users' },
  { href: '/admin-dashboard/courses', label: 'Courses', icon: 'bookOpen' },
  { href: '/admin-dashboard/library', label: 'Library', icon: 'library' },
  { href: '/admin-dashboard/inquire', label: 'Inquire', icon: 'mailOpen' },
  { href: '/admin-dashboard/onboardings', label: 'Onboardings', icon: 'mailOpen' },
  { href: '/admin-dashboard/students', label: 'Students', icon: 'user' },
];



export const studentLinks = [
  { href: '/student-dashboard', label: 'Dashboard', icon: 'layout_dashboard' },
  { href: '/student-dashboard/profile', label: 'Profile', icon: 'users' },
  { href: '/student-dashboard/forms', label: 'Forms', icon: 'mailOpen' },
  { href: '/policies', label: 'Policies', icon: 'library' },
  { href: '/library', label: 'Library', icon: 'bookOpen' },
  { href: '/contact', label: 'Contact Us', icon: 'phone' },
];


export const teacherLinks = [
  { href: '/teacher-dashboard', label: 'Dashboard', icon: 'layout_dashboard' },
  { href: '/teacher-dashboard/profile', label: 'Profile', icon: 'users' },
  { href: '/teacher-dashboard/forms', label: 'Forms', icon: 'mailOpen' },
  { href: '/policies', label: 'Policies', icon: 'library' },
  { href: '/library', label: 'Library', icon: 'bookOpen' },
  { href: '/contact', label: 'Contact Us', icon: 'phone' },
];