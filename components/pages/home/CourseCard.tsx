import Image from "next/image";

type Props = {
  title: string;
  price: number;
  reviews: number;
  rating: number;
  teacher: string;
  students: number;
  avatar: string;
  img: string;
};

export default function CourseCard({
  title,
  price,
  reviews,
  rating,
  teacher,
  students,
  avatar,
  img,
}: Props) {
  return (
    <div className="relative overflow-hidden bg-white rounded-t-full shadow-xl w-96 h-auto transition hover:shadow-2xl hover:cursor-pointer hover:scale-[1.005]">
      {/* Minaret Dome */}
      <div className="absolute top-0 left-0 right-0 h-44">
        <div className="absolute inset-0 bg-white [clip-path:polygon(0_100%,_100%_100%,_100%_25%,_50%_0%,_0%_25%)] shadow-md"></div>
      </div>

      {/* Image */}
      <div className="relative z-10 -mt-2">
        <Image
          src={img}
          alt={title}
          width={384}
          height={224}
          className="w-full h-56 object-cover rounded-t-full transition-transform duration-300 hover:scale-105"
        />
        {/* Price Badge */}
        <div className="absolute bottom-3 right-4 bg-yellow-400 text-black font-bold px-3 py-1 rounded-full shadow">
          ${price}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col justify-between h-80">
        {/* Reviews */}
        <div className="flex justify-center items-center mb-3 text-yellow-500">
          {"★".repeat(rating)}{"☆".repeat(5 - rating)}
          <span className="ml-2 text-gray-600 text-sm">({reviews} Reviews)</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">{title}</h3>

        {/* Feature points */}
        <ul className="text-sm text-gray-600 space-y-1 mb-4">
          <li>✔️ Interactive Lessons</li>
          <li>✔️ Step-by-step Guidance</li>
          <li>✔️ Practical Assignments</li>
          <li>✔️ Certificate upon Completion</li>
        </ul>

        {/* Teacher Info (aligned row) */}
        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-3">
            <Image
              src={avatar}
              alt={teacher}
              width={36}
              height={36}
              className="rounded-full"
            />
            <span className="text-sm text-gray-700 font-medium">{teacher}</span>
          </div>
          <span className="text-sm text-gray-500">👥 {students}</span>
        </div>
      </div>
    </div>
  );
}
