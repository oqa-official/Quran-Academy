import { useCurrency } from "@/hooks/useCurrency";
import { Check, Star, User } from "lucide-react";

const listpoints=[
"Interactive Lessons",
"Step-by-step Guidance",
"Practical Assignments",
"Certificate upon Completion",
]

function CourseCard({ title, price, reviews, list, rating, teacher, students, avatar, img, features = [], onClick }: any) {
  const { symbol, rate } = useCurrency();
  return (
    <div className="keen-slider__slide p-2 min-w-[300px] max-w-[330px] md:py-6 py-2" onClick={onClick}>
      <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg cursor-pointer shadow-md shadow-gray-400 transition-all duration-300 hover:scale-[1.030]">
        {/* Top Image */}
        <div className="relative">
          <img src={img} alt={title} className="w-full  h-56 object-cover max-h-[220px]" />
          <div className="absolute right-2 bg-accent p-2 rounded-full -bottom-5 flex items-baseline justify-center">
            <span className="text-sm self-start text-black"> {symbol} </span>
            <h2 className="text-2xl font-bold text-gray-800">{(price * rate).toFixed(1)}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          {/* Rating */}
          <div className="flex items-center text-yellow-500 text-sm mb-2">
            {[...Array(rating)].map((_, i) => (
              <Star key={i} className="fill-accent" size={15} />
            ))}
            <span className="ml-2 text-gray-600">({reviews +2} Reviews)</span>
          </div>

          {/* Title */}
          <h2 className="text-lg font-bold text-gray-800 mb-3 text-start max-w-[280px] hover:text-accent" dangerouslySetInnerHTML={{ __html: title }} />

          {/* Features */}
          <ul className="space-y-2 mt-4">
            {features.map((item: string, idx: number) => (
              <li key={idx} className="flex items-center text-gray-600 text-xs hover:text-primary">
                <Check className="w-4 h-4 mr-2 text-accent" strokeWidth={3} />
                {item}
              </li>
            ))}

            {list &&  listpoints.map((item: string, idx: number) => (
              <li key={idx} className="flex items-center text-gray-600 text-xs hover:text-primary">
                <Check className="w-4 h-4 mr-2 text-accent" strokeWidth={3} />
                {item}
              </li>
            ))}
          </ul>

          {/* Teacher */}
          <div className="flex items-center justify-between mt-4 border-t pt-3">
            <div className="flex items-center gap-1">
              <img src={avatar} alt={teacher} className="w-8 h-8 rounded-full" />
              <span className="text-sm font-medium text-gray-700">{teacher}</span>
            </div>
            <div className="flex items-center">
              <User size={15} fill="gray" className="text-gray-500" />
              <span className="text-sm">{students}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
