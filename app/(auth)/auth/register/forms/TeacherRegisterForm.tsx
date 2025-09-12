// "use client";

// import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";
// import { PhoneInput } from "react-international-phone";
// import "react-international-phone/style.css";

// interface InstructorRegisterForm {
//   name: string;
//   email: string;
//   number: string;
//   password: string;
//   confirmPassword: string;
// }

// export default function TeacherRegisterForm() {
//   const router = useRouter();
//   const [form, setForm] = useState<InstructorRegisterForm>({
//     name: "",
//     email: "",
//     number: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [errors, setErrors] = useState({
//     name: "",
//     email: "",
//     number: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setErrors({ ...errors, [e.target.name]: "" }); // clear error on change
//   };

//   const handlePhoneChange = (value: string) => {
//     setForm({ ...form, number: value });
//     setErrors({ ...errors, number: "" });
//   };

//   const validatePassword = (password: string) => {
//     const regex =
//       /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{10,}$/;
//     return regex.test(password);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Reset errors
//     let hasError = false;
//     const newErrors = { name: "", email: "", number: "", password: "", confirmPassword: "" };

//     if (!form.name) {
//       newErrors.name = "Name is required";
//       hasError = true;
//     }
//     if (!form.email) {
//       newErrors.email = "Email is required";
//       hasError = true;
//     }
//     if (!form.number) {
//       newErrors.number = "Phone number is required";
//       hasError = true;
//     }
//     if (!form.password) {
//       newErrors.password = "Password is required";
//       hasError = true;
//     } else if (!validatePassword(form.password)) {
//       newErrors.password =
//         "Password must be 10+ chars with uppercase, number, and special char";
//       hasError = true;
//     }
//     if (!form.confirmPassword) {
//       newErrors.confirmPassword = "Confirm your password";
//       hasError = true;
//     } else if (form.password !== form.confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match";
//       hasError = true;
//     }

//     setErrors(newErrors);

//     if (hasError) return;

//     try {
//       setLoading(true);

//       // Prepare payload matching Instructor interface
//       const payload = {
//         name: form.name,
//         email: form.email,
//         number: form.number,
//         password: form.password,
//         educationMail: form.email, // assuming educational email same as email
//       };

//       const res = await fetch("/api/db/instructors", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         toast.error(data.error || "Registration failed");
//         return;
//       }

//       toast.success("Registration successful!");
//       router.push("/auth/login");
//     } catch (err: any) {
//       toast.error(err.message || "Something went wrong");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="flex flex-col items-start space-y-4 w-full">
//       <div className="w-full">
//         <Label>Name</Label>
//         <Input name="name" value={form.name} onChange={handleChange} />
//         {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
//       </div>

//       <div className="w-full">
//         <Label>Email</Label>
//         <Input type="email" name="email" value={form.email} onChange={handleChange} />
//         {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
//       </div>

//       <div className="w-full">
//         <Label>Contact Number</Label>
//         <PhoneInput
//           defaultCountry="us"
//           value={form.number}
//           onChange={handlePhoneChange}
//           inputClassName="w-full border rounded-md p-2"
//           className="w-full"
//         />
//         {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
//       </div>

//       <div className="w-full">
//         <Label>Password</Label>
//         <Input type="password" name="password" value={form.password} onChange={handleChange} />
//         {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
//       </div>

//       <div className="w-full">
//         <Label>Confirm Password</Label>
//         <Input
//           type="password"
//           name="confirmPassword"
//           value={form.confirmPassword}
//           onChange={handleChange}
//         />
//         {errors.confirmPassword && (
//           <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
//         )}
//       </div>

//       <Button type="submit" className="w-full" disabled={loading}>
//         {loading ? "Registering..." : "Register"}
//       </Button>
//     </form>
//   );
// }


















"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { useUser } from "@/context/UserContext";

interface InstructorRegisterForm {
  name: string;
  email: string;
  number: string;
  password: string;
  confirmPassword: string;
}

export default function TeacherRegisterForm() {
  const router = useRouter();
  const { setUser } = useUser();

  const [form, setForm] = useState<InstructorRegisterForm>({
    name: "",
    email: "",
    number: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handlePhoneChange = (value: string) => {
    setForm({ ...form, number: value });
    setErrors({ ...errors, number: "" });
  };

  const validatePassword = (password: string) => {
    const regex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{10,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    let hasError = false;
    const newErrors = { name: "", email: "", number: "", password: "", confirmPassword: "" };

    if (!form.name) {
      newErrors.name = "Name is required";
      hasError = true;
    }
    if (!form.email) {
      newErrors.email = "Email is required";
      hasError = true;
    }
    if (!form.number) {
      newErrors.number = "Phone number is required";
      hasError = true;
    }
    if (!form.password) {
      newErrors.password = "Password is required";
      hasError = true;
    } else if (!validatePassword(form.password)) {
      newErrors.password =
        "Password must be 10+ chars with uppercase, number, and special char";
      hasError = true;
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password";
      hasError = true;
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    try {
      setLoading(true);

      const payload = {
        name: form.name,
        email: form.email,
        number: form.number,
        password: form.password,
        educationMail: form.email, // assuming educational email same as email
      };

      const res = await fetch("/api/db/instructors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Registration failed");
        return;
      }

      toast.success("Registration successful!");

      // Set user in context and redirect to teacher dashboard
      setUser(data._id, "instructor");
      router.push("/teacher-dashboard");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-start space-y-4 w-full">
      <div className="w-full">
        <Label>Name</Label>
        <Input name="name" value={form.name} onChange={handleChange} />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div className="w-full">
        <Label>Email</Label>
        <Input type="email" name="email" value={form.email} onChange={handleChange} />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div className="w-full">
        <Label>Contact Number</Label>
        <PhoneInput
          defaultCountry="us"
          value={form.number}
          onChange={handlePhoneChange}
          inputClassName="w-full border rounded-md p-2"
          className="w-full"
        />
        {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
      </div>

      <div className="w-full">
        <Label>Password</Label>
        <Input type="password" name="password" value={form.password} onChange={handleChange} />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
      </div>

      <div className="w-full">
        <Label>Confirm Password</Label>
        <Input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </Button>
    </form>
  );
}
