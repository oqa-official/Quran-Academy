import { NavSection } from "@/app/(dashboards)/admin_dashboard/componnets/Sidebar";
import { BookOpen, DollarSign, LayoutDashboard, Library, LibraryBig, MailCheck, MailOpen, Phone, Settings, User, Users } from "lucide-react";


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





export const teacherLinks = [
  { href: '/teacher-dashboard', label: 'Dashboard', icon: 'layout_dashboard' },
  { href: '/teacher-dashboard/profile', label: 'Profile', icon: 'users' },
  { href: '/teacher-dashboard/forms', label: 'Forms', icon: 'mailOpen' },
  { href: '/policies', label: 'Policies', icon: 'library' },
  { href: '/library', label: 'Library', icon: 'bookOpen' },
  { href: '/contact', label: 'Contact Us', icon: 'phone' },
];

export const NAV_DATA_TEACHER = [
  {
    label: "TEACHER MENU",
    items: [
      { title: "Dashboard", url: "/teacher-dashboard", icon: LayoutDashboard },
      { title: "Profile", url: "/teacher-dashboard/profile", icon: User },
      { title: "Forms", url: "/teacher-dashboard/forms", icon: MailOpen },
      { title: "Policies", url: "/policies", icon: Library },
      { title: "Library", url: "/library", icon: LibraryBig },
      { title: "Contact Us", url: "/contact-us", icon: Phone },
    ],
  },
];




export const studentLinks = [
  { href: '/student-dashboard', label: 'Dashboard', icon: 'layout_dashboard' },
  { href: '/student-dashboard/profile', label: 'Profile', icon: 'users' },
  { href: '/student-dashboard/forms', label: 'Forms', icon: 'mailOpen' },
  { href: '/policies', label: 'Policies', icon: 'library' },
  { href: '/library', label: 'Library', icon: 'bookOpen' },
  { href: '/contact', label: 'Contact Us', icon: 'phone' },
];



export const NAV_DATA_STUDENT = [
  {
    label: "STUDENT MENU",
    items: [
      { title: "Dashboard", url: "/student-dashboard", icon: LayoutDashboard },
      { title: "Profile", url: "/student-dashboard/profile", icon: User },
      { title: "Payments", url: "/student-dashboard/payments", icon: DollarSign },
      { title: "Forms", url: "/student-dashboard/forms", icon: MailOpen },
      { title: "Policies", url: "/policies", icon: LibraryBig },
      { title: "Library", url: "/library", icon: Library },
      { title: "Contact", url: "/contact-us", icon: Phone },
    ],
  },
];




export const NAV_DATA_ADMIN: NavSection[] = [
  {
    label: "Main Menu",
    items: [
      { title: "Dashboard", url: "/admin_dashboard", icon: LayoutDashboard },
      {
        title: "Teachers",
        icon: Users,
        items: [
          { title: "View All", url: "/admin_dashboard/teachers", icon: Users },
          { title: "Add Teacher", url: "/admin_dashboard/teachers/add", icon: Users },
          { title: "Teacher Inquiries", url: "/admin_dashboard/teachers/teacher-inquiries", icon: Users },
        ],
      },
      {
        title: "Courses",
        icon: BookOpen,
        items: [
          { title: "View All", url: "/admin_dashboard/courses", icon: BookOpen },
          { title: "Add New", url: "/admin_dashboard/courses/add", icon: BookOpen },
        ],
      },
      {
        title: "Library",
        icon: LibraryBig,
        items: [
          { title: "View All", url: "/admin_dashboard/library", icon: LibraryBig },
          { title: "Add Book", url: "/admin_dashboard/library/add", icon: LibraryBig },
        ],
      },
      { title: "Inquire", url: "/admin_dashboard/inquire", icon: MailOpen },
       {
        title: "Onboardings",
        icon: MailOpen,
        items: [
          { title: "Onboarded Inquiries", url: "/admin_dashboard/onboardings", icon: User },
          { title: "View Students", url: "/admin_dashboard/onboardings/students", icon: User },
        ],
      },
      {
        title: "Students",
        icon: User,
        items: [
          { title: "View All", url: "/admin_dashboard/students", icon: User },
        ],
      },

       {
        title: "Emails",
        icon: MailCheck,
        items: [
          { title: "Student Onboarded", url: "/admin_dashboard/emails/student-created", icon: User },
          { title: "Teacher Added", url: "/admin_dashboard/emails/instructor-created", icon: User },
          { title: "Reset Password", url: "/admin_dashboard/emails/forgot-password", icon: User },
          { title: "Inquiry Fill", url: "/admin_dashboard/emails/inquiry-fill", icon: User },
          { title: "Teacher Inquiry", url: "/admin_dashboard/emails/teacher-inquiry", icon: User },
        ],
      },


      { title: "Profile", url: "/admin_dashboard/profile", icon: Settings },
    ],
  },
];