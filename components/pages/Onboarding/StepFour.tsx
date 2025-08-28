import FormWrapper from "./FormWrapper";
import { useRouter } from "next/navigation";

export default function StepThree({ goBack }: any) {
  const router = useRouter();

  return (
    <FormWrapper
      title="Request Received"
      verse="Our team will contact you soon."
      aayat="جَزَاكُمُ ٱللَّهُ خَيْرًا"
      step={3}
      totalSteps={3}
    >
      <div className="text-center py-6">

        <img
              src={"/assets/home/quran7.png"}
              alt={"quran"}
              className={`max-w-[200px] mx-auto -mt-6 object-cover transition-all `}
            />


        <p className="text-lg font-medium text-gray-700">
          Thank you for your interest!
        </p>
      </div>

      <div className="flex justify-center gap-4">
        <button
          className="px-4 py-2 rounded-sm bg-gray-200"
          onClick={goBack}
        >
          Back
        </button>
        <button
          className="px-4 py-2 rounded-sm bg-primary hover:bg-accent transition-colors duration-150 text-white"
          onClick={() => router.push("/")}
        >
          Go to Home
        </button>
      </div>
    </FormWrapper>
  );
}
