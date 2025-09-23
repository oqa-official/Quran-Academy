// "use client";

// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { toast } from "sonner";
// import { useUser } from "@/context/UserContext";

// interface Student {
//     _id: string;
//     name: string;
//     email: string;
//     price: number;
//     paymentLink?: string | null;
//     feeStatus: {
//         paid: boolean;
//         lastPaymentDate?: string;
//     };
// }

// export default function PaymentsPage() {
//     const { userId, loading: userLoading } = useUser();
//     const [student, setStudent] = useState<Student | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [generating, setGenerating] = useState(false);

//     // fetch student info
//     useEffect(() => {
//         if (!userId) {
//             setLoading(false);
//             return;
//         }

//         const fetchStudent = async () => {
//             try {
//                 setLoading(true);
//                 const res = await fetch(`/api/db/students/${userId}`);
//                 if (!res.ok) throw new Error("Failed to fetch student");
//                 const data = await res.json();
//                 setStudent(data);
//             } catch (err) {
//                 console.error(err);
//                 toast.error("Failed to load student data");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchStudent();
//     }, [userId]);

//     const handleGeneratePaymentLink = async () => {
//         if (!student?._id) return;
//         setGenerating(true);
//         try {
//             const res = await fetch(`/api/payment`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     studentId: student._id,
//                     fee: student.price,
//                     email: student.email,  
//                     name: student.name,
//                 }),
//             });

//             if (!res.ok) throw new Error("Failed to generate payment link");

//             const data = await res.json();
//             console.log(data.url)

//             setStudent((prev) =>
//                 prev ? { ...prev, paymentLink: data.url } : prev
//             );

//             toast.success("Payment link generated");
//             console.log(data);
//         } catch (err) {
//             console.error(err);
//             toast.error("Failed to generate payment link");
//         } finally {
//             setGenerating(false);
//         }
//     };


//     if (userLoading || loading) {
//         return <p className="p-4">Loading...</p>;
//     }

//     if (!student) {
//         return <p className="p-4">No student record found</p>;
//     }

//     // calculate expiry
//     let expired = false;
//     if (student.feeStatus.paid && student.feeStatus.lastPaymentDate) {
//         const last = new Date(student.feeStatus.lastPaymentDate);
//         const now = new Date();
//         const diffDays = (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
//         expired = diffDays > 30;
//     }

//     return (
//         <div className=" mx-auto">
//             <Card>
//                 <CardHeader>
//                     <CardTitle>Payments</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     <p className="mb-2"><b>Name:</b> {student.name}</p>
//                     <p className="mb-2"><b>Email:</b> {student.email}</p>
//                     <p className="mb-2"><b>Monthly Fee:</b> ${student.price}</p>

//                     {student.feeStatus.paid && !expired && (
//                         <div className="text-green-600 mt-4">
//                             ✅ Your fee is up to date (last paid:{" "}
//                             {new Date(student.feeStatus.lastPaymentDate!).toLocaleDateString()}
//                             )
//                         </div>
//                     )}

//                     {(!student.feeStatus.paid || expired) && (
//                         <div className="mt-4">
//                             {student.paymentLink ? (
//                                 <Button asChild>
//                                     <a href={student.paymentLink} target="_blank">
//                                         Pay Now
//                                     </a>
//                                 </Button>
//                             ) : (
//                                 <Button
//                                     onClick={handleGeneratePaymentLink}
//                                     disabled={generating}
//                                 >
//                                     {generating ? "Generating..." : "Generate Payment Link"}
//                                 </Button>
//                             )}
//                             {expired && (
//                                 <p className="text-red-600 text-sm mt-2">
//                                     ⚠️ Your last payment has expired. Please pay again.
//                                 </p>
//                             )}
//                         </div>
//                     )}
//                 </CardContent>
//             </Card>
//         </div>
//     );
// }















"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import { Skeleton } from "@/components/ui/skeleton";

interface Student {
    _id: string;
    name: string;
    educationMail: string;
    userId: string;
    email: string;
    status: string;
    price: number;
    paymentLink?: string | null;
    feeStatus: {
        paid: boolean;
        lastPaymentDate?: string;
    };
}

export default function PaymentsPage() {
    const { userId, loading: userLoading } = useUser();
    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    // fetch student info
    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const fetchStudent = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/db/students/${userId}`);
                if (!res.ok) throw new Error("Failed to fetch student");
                const data = await res.json();
                setStudent(data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load student data");
            } finally {
                setLoading(false);
            }
        };

        fetchStudent();
    }, [userId]);

    const handleGeneratePaymentLink = async () => {
        if (!student?._id) return;
        setGenerating(true);
        try {
            const res = await fetch(`/api/payment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    studentId: student._id,
                    fee: student.price,
                    email: student.email,
                    name: student.name,
                }),
            });

            if (!res.ok) throw new Error("Failed to generate payment link");

            const data = await res.json();

            setStudent((prev) =>
                prev ? { ...prev, paymentLink: data.url } : prev
            );

            toast.success("Payment link generated");
        } catch (err) {
            console.error(err);
            toast.error("Failed to generate payment link");
        } finally {
            setGenerating(false);
        }
    };

    if (userLoading || loading) {
        return(
            <div className="space-y-4">
            <Skeleton className="w-full bg-white dark:bg-[#122031] min-h-[200px]"></Skeleton>
            <Skeleton className="w-[80%] bg-white dark:bg-[#122031] min-h-[80px]"></Skeleton>
            <Skeleton className="w-[50%] bg-white dark:bg-[#122031] min-h-[40px]"></Skeleton>
            </div>
        )
    }

    if (!student) {
        return <p className="p-4">No student record found</p>;
    }

    // calculate expiry
    let expired = false;
    if (student.feeStatus.paid && student.feeStatus.lastPaymentDate) {
        const last = new Date(student.feeStatus.lastPaymentDate);
        const now = new Date();
        const diffDays =
            (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
        expired = diffDays > 30;
    }

    return (
        <div className="">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-3xl font-semibold font-merriweather">Payments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-4 my-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Name
                            </label>
                            <input
                                type="text"
                                value={student.name}
                                readOnly
                                className="w-full mt-1 px-3 py-2 rounded-md border bg-gray-100 dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700 focus:outline-none cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email
                            </label>
                            <input
                                type="text"
                                value={student.email}
                                readOnly
                                className="w-full mt-1 px-3 py-2 rounded-md border bg-gray-100 dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700 focus:outline-none cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Quran Academy Email
                            </label>
                            <input
                                type="text"
                                value={student.educationMail}
                                readOnly
                                className="w-full mt-1 px-3 py-2 rounded-md border bg-gray-100 dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700 focus:outline-none cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Student ID
                            </label>
                            <input
                                type="text"
                                value={student.userId}
                                readOnly
                                className="w-full mt-1 px-3 py-2 rounded-md border bg-gray-100 dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700 focus:outline-none cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Monthly Fee
                            </label>
                            <input
                                type="text"
                                value={`$${student.price}`}
                                readOnly
                                className="w-full mt-1 px-3 py-2 rounded-md border bg-gray-100 dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700 focus:outline-none cursor-not-allowed"
                            />
                        </div>

                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Status
                            </label>
                            <input
                                type="text"
                                value={`${student.status}`}
                                readOnly
                                className="w-full mt-1 px-3 py-2 rounded-md border bg-gray-100 dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700 focus:outline-none cursor-not-allowed"
                            />
                        </div>
                    </div>


                    {/* ✅ Paid & Active */}
                    {student.feeStatus.paid && !expired && (
                        <div className="flex items-center gap-2 max-w-xl rounded-md p-3 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                            <CheckCircle2 className="w-5 h-5" />
                            <span>
                                Your fee is up to date (last paid:{" "}
                                {new Date(
                                    student.feeStatus.lastPaymentDate!
                                ).toLocaleDateString()}
                                )
                            </span>
                        </div>
                    )}

                    {/* ⚠️ Unpaid */}
                    {!student.feeStatus.paid && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 max-w-xl rounded-md p-3 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                                <AlertTriangle className="w-5 h-5" />
                                <span>Your fee is unpaid. Please pay now.</span>
                            </div>

                            {student.paymentLink ? (
                                <Button asChild variant="destructive" className="w-full max-w-[200px]">
                                    <a href={student.paymentLink} target="_blank">
                                        <CreditCard className="mr-2 w-4 h-4" /> Pay Now
                                    </a>
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleGeneratePaymentLink}
                                    disabled={generating}
                                    variant="destructive"
                                    className="w-full max-w-[200px]"
                                >
                                    {generating ? "Generating..." : "Generate Payment Link"}
                                </Button>
                            )}
                        </div>
                    )}

                    {/* ⚠️ Expired */}
                    {student.feeStatus.paid && expired && (
                        <div className="space-y-2">
                            <div className="flex items-center w-full max-w-2xl gap-2 rounded-md p-3 bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                                <AlertTriangle className="w-5 h-5" />
                                <span>
                                    Your last payment has expired. Please pay again for this month.
                                </span>
                            </div>

                            {student.paymentLink ? (
                                <Button asChild className="w-full ">
                                    <a href={student.paymentLink} target="_blank">
                                        <CreditCard className="mr-2 w-4 h-4" /> Pay Now
                                    </a>
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleGeneratePaymentLink}
                                    disabled={generating}
                                    className="w-full max-w-md"
                                >
                                    {generating ? "Generating..." : "Generate Payment Link"}
                                </Button>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
