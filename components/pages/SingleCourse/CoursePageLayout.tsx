"use client";
import { useState } from "react";
import { Star } from "lucide-react";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs"; // shadcn tabs
import { Card, CardContent } from "@/components/ui/card";
import Overview from "./Overview";
import CurriculumTab from "./CurriculumTab";
import ReviewComponent from "./Reviews";

export default function CoursePageLayout() {
    const [rating] = useState(4.5);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 w-full">



            <div className="lg:col-span-3 space-y-6 w-full">
                {/* Course Info */}
                <div className="w-full">
                    <h1 className="text-4xl font-bold mb-2">
                        Learn Quranic Studies for Beginner
                    </h1>

                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 text-yellow-500">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    size={18}
                                    className={i < Math.round(rating) ? "fill-yellow-500" : ""}
                                />
                            ))}
                            <span className="text-gray-600 ml-2">{rating} (32 Reviews)</span>
                        </div>
                        <div>
                            <p className="font-medium">Category : <span className="font-semibold text-primary">Level 1</span></p>
                        </div>
                    </div>


                </div>

                {/* Image */}
                <div className="rounded-lg overflow-hidden shadow-md">
                    <img
                        src="/assets/courses/course_img.png"
                        alt="Course Image"
                        className="w-full object-cover"
                    />
                </div>

                {/* Tabs */}
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="flex space-x-2">
                        <TabsTrigger
                            value="overview"
                            className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md px-4 py-2 text-lg font-semibold"
                        >
                            <h2>Overview</h2>
                        </TabsTrigger>

                        <TabsTrigger
                            value="curriculum"
                            className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md px-4 py-2 text-lg font-semibold"
                        >
                            <h2>Curriculum</h2>
                        </TabsTrigger>

                        <TabsTrigger
                            value="reviews"
                            className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md px-4 py-2 text-lg font-semibold"
                        >
                            <h2>Reviews</h2>
                        </TabsTrigger>
                    </TabsList>


                    {/* Overview Tab */}
                    <TabsContent value="overview">
                        <Overview />
                    </TabsContent>

                    {/* Curriculum Tab */}
                    <TabsContent value="curriculum">
                        <CurriculumTab />
                    </TabsContent>

                    {/* Reviews Tab */}
                    <TabsContent value="reviews">
                        <ReviewComponent />
                    </TabsContent>
                </Tabs>
            </div>
        </div>


    );
}
