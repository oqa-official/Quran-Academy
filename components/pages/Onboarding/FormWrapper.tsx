"use client";
import React from "react";

import { TextAnimate } from "@/components/magicui/text-animate";
import { motion } from "framer-motion";

export default function FormWrapper({
    title,
    verse = "“Indeed, this Qur’an guides to that which is most suitable...” (17:9)", // default verse
    aayat = "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
    children,
}: {
    title: string;
    verse?: string;
    aayat? : string
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-2xl">

            <motion.h2
                initial={{ opacity: 0, y: -50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                viewport={{ once: false }}
                className="text-2xl md:text-3xl mt-3 font-thin  mb-6 text-center text-accent"
            >
                {aayat}
            </motion.h2>


            <TextAnimate
                animation="blurIn"
                by="word"
                duration={0.6}
                as="h2"
                className="text-2xl md:text-3xl -mt-3 font-bold mb-2 text-center text-primary"
            >
                {title}
            </TextAnimate>
            {verse && <p className="text-center text-gray-500 mt-2">{verse}</p>}
            <div className="mt-6">{children}</div>
        </div>
    );
}
