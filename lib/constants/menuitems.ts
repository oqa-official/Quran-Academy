import {
  Home,
  UsersRound,
  BookOpen,
  LibraryBig,
  Phone,
  Briefcase,
  DollarSign
} from "lucide-react";

export const menuItems = [
  { label: "Home", href: "/", icon: Home, desc:"Welcome Page" },
  { label: "About Us", href: "/about-us", icon: UsersRound, desc:"Who we are" },
  { label: "Courses", href: "/courses", icon: BookOpen , desc:"What we offer"},
  { label: "Library", href: "/library", icon: LibraryBig , desc:"books colletions"},
  { label: "Pricing", href: "/pricing", icon: DollarSign , desc:"Affordable Plans"},
  { label: "Contact", href: "/contact", icon: Phone , desc:"For Quick Queries"},
  { label: "Career", href: "/career", icon: Briefcase , desc:"For careers",},
];
