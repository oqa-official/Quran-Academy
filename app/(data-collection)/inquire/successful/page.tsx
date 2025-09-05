"use client";
import Link from "next/link";

export default function Page() {
    return (


        <div className="relative min-h-screen flex justify-center items-center">
            {/* 🔹 Background Overlay */}
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
                style={{ backgroundImage: "url('/assets/home/pattern.png')" }}
            ></div>
            <div className="w-full max-w-2xl bg-white text-center rounded-2xl p-4 relative z-10">
                {/* Header */}

                <>
                    <p className="text-2xl md:text-3xl my-2 text-accent">
                        جَزَاكُمُ ٱللَّهُ خَيْرًا
                    </p>
                    <p className="text-2xl md:text-3xl my-2 text-primary font-merriweather font-semibold">
                        Thank you for your response.
                    </p>
                </>

                <img
                    src={"/assets/home/arrow.png"}
                    alt="arrow"
                    className="max-w-[200px] mx-auto"
                />

                <div className="flex flex-col items-center space-y-4 mt-6">
                    <img
                        src="/assets/home/pricing2.png"
                        alt="success"
                        className="w-32 mx-auto"
                    />
                    <h3 className="text-lg font-normal text-gray-700">
                        Thanks for the information<br /> You should receive the link on your
                        number for further procedure.
                    </h3>
                    <Link href={"/"}>
                        <button
                            className="px-4 py-2 rounded-sm bg-primary text-white hover:bg-accent"
                        >
                            Go Back
                        </button>
                    </Link>
                </div>
            </div>

        </div>

    );
}