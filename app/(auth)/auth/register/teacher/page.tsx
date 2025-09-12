"use client";

import Link from "next/link";
import TeacherRegisterForm from "../forms/TeacherRegisterForm";

export default function RegisterPage() {



    return (
        <div className="relative min-h-screen flex justify-center items-center px-2 bg-gray-50">
            {/* Background Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
                style={{ backgroundImage: "url('/assets/home/pattern.png')" }}
            ></div>

            <div className="w-full max-w-md bg-white text-center rounded-2xl p-6 relative z-10 shadow-md">
                <h2 className="text-start font-semibold mb-4">Register As Teacher</h2>
                <TeacherRegisterForm />



                <p className="mt-4 text-gray-600 text-sm">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="text-accent hover:underline">
                        Login
                    </Link>
                </p>
            </div>


        </div>
    );
}
