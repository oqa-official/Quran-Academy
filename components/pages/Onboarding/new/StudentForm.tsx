// "use client";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { generateAvailableDates, generateTimeSlots, TIMEZONES } from "@/lib/constants/timezones";
// import { PhoneInput } from "react-international-phone";
// import { toast } from "sonner";
// import "react-international-phone/style.css";
// import { useCurrency } from "@/hooks/useCurrency";
// import { roundToNearestFive } from "@/lib/validation";


// const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// interface StudentFormProps {
//   index: number;
//   data: any;
//   onChange: (newData: any) => void;
//   basePrice: number;
// }

// export default function StudentForm({ index, data, onChange, basePrice }: StudentFormProps) {
//   const { symbol, rate } = useCurrency();
//   const handle = (name: string, value: string | number) =>
//     onChange({ ...data, [name]: value });

//   // 🟢 Handle frequency + price
//   const handleFrequency = (val: string) => {
//     const freq = parseInt(val);
//     let price = basePrice;
//     if (freq === 3) price += 10;
//     if (freq === 4) price += 20;
//     if (freq === 5) price += 25;
//     onChange({ ...data, frequency: freq, price });
//   };

//   // 🟢 Toggle days
//   const toggleDay = (day: string) => {
//     let selected = data.classDays || [];
//     if (selected.includes(day)) {
//       selected = selected.filter((d: string) => d !== day);
//     } else {
//       if (selected.length < (data.frequency || 2)) {
//         selected = [...selected, day];
//       } else {
//         toast.error(`You can only select ${data.frequency || 2} days per week`)
//         return;
//       }
//     }
//     onChange({ ...data, classDays: selected });
//   };

//   return (
//     <div className="p-4 border rounded-xl shadow-sm">



//       {/* Responsive grid: 1 col on mobile, 2 cols on md+ */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {/* Name */}
//         <div className="flex flex-col w-full">
//           <label className="text-xs text-start text-gray-500 mb-1">Name</label>
//           <input
//             name="name"
//             value={data.name || ""}
//             placeholder="Full Name"
//             onChange={(e) => handle("name", e.target.value)}
//             className="border rounded-md h-10 px-3 w-full"
//           />
//         </div>

//         {/* Email */}
//         <div className="flex flex-col w-full ">
//           <label className="text-xs text-start text-gray-500 mb-1">Email</label>
//           <input
//             name="email"
//             value={data.email || ""}
//             placeholder="Email Address"
//             onChange={(e) => handle("email", e.target.value)}
//             className="border rounded-md h-10 px-3 w-full"
//           />
//         </div>

//         {/* Phone */}
//         {/* Phone */}
//         <div className="flex flex-col w-full md:col-span-1">
//           <label className="text-xs text-start text-gray-500 mb-1">Student's Number</label>
//           <PhoneInput
//             defaultCountry="us"
//             preferredCountries={["us", "gb", "ca", "au"]}
//             value={data.phone || ""}
//             onChange={(phone) => handle("phone", phone)}
//             inputClassName="w-full border rounded-sm p-2 bg-transparent"

//             className="bg-transparent h-10 "
//           />
//         </div>


//         {/* Date of Birth */}
//         <div className="flex flex-col w-full ">
//           <label className="text-xs text-start text-gray-500 mb-1">Date of Birth</label>
//           <input
//             type="date"
//             name="dateOfBirth"
//             value={data.dateOfBirth || ""}
//             onChange={(e) => handle("dateOfBirth", e.target.value)}
//             className="border rounded-md h-10 px-3 w-full"
//           />
//         </div>

//         {/* Gender */}
//         <div className="flex flex-col w-full md:col-span-2">
//           <label className="text-xs text-start text-gray-500 mb-1">Gender</label>
//           <Select
//             value={data.gender || undefined}
//             onValueChange={(val) => handle("gender", val)}
//           >
//             <SelectTrigger className="border rounded-md h-10 w-full">
//               <SelectValue placeholder="Select gender" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="male">Male</SelectItem>
//               <SelectItem value="female">Female</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <hr className="border-1 border-gray-400 md:col-span-2" />
//         {/* Frequency */}
//         <div className="flex flex-col w-full">
//           <label className="text-xs text-start text-gray-500 mb-1">
//             Classes/week (Basic Quran Learning)
//           </label>
//           <Select
//             onValueChange={handleFrequency}
//             value={data.frequency ? String(data.frequency) : undefined}
//           >
//             <SelectTrigger className="border rounded-md h-10 w-full">
//               <SelectValue placeholder="Select classes per week" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="2">2 Classes/week ({symbol}{basePrice})</SelectItem>
//               <SelectItem value="3">3 Classes/week ({symbol}{basePrice + 10})</SelectItem>
//               <SelectItem value="4">4 Classes/week ({symbol}{basePrice + 20})</SelectItem>
//               <SelectItem value="5">5 Classes/week ({symbol}{basePrice + 25})</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Auto Price */}
//         <div className="flex flex-col w-full">
//           <label className="text-xs text-start text-gray-500 mb-1">Fee/Month in {symbol}</label>
//           <input
//             name="price"
//             value={roundToNearestFive(Number(data.price * rate)) || ""}
//             readOnly
//             placeholder={symbol}
//             className="border rounded-md h-10 px-3 w-full bg-gray-100"
//           />
//         </div>

//         {/* Days */}
//         <div className="flex flex-col w-full md:col-span-1">
//           <label className="text-xs text-start text-gray-500 mb-1">Select Days</label>
//           <div className="flex flex-wrap gap-2">
//             {DAYS.map((day) => (
//               <button
//                 type="button"
//                 key={day}
//                 onClick={() => toggleDay(day)}
//                 className={`w-9 h-9 rounded-full flex items-center justify-center text-sm border transition ${data.classDays?.includes(day)
//                   ? "bg-primary text-white border-primary"
//                   : "bg-white text-gray-700 border-gray-300"
//                   }`}
//               >
//                 {day[0]}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Timezone */}
//         <div className="flex flex-col w-full">
//           <label className="text-xs text-start text-gray-500 mb-1">Timezone</label>
//           <Select
//             value={data.timezone || undefined}
//             onValueChange={(val) => handle("timezone", val)}
//           >
//             <SelectTrigger className="border rounded-md h-10 w-full">
//               <SelectValue placeholder="Select timezone" />
//             </SelectTrigger>
//             <SelectContent>
//               {TIMEZONES.map((tz) => (
//                 <SelectItem key={tz.value} value={tz.value}>
//                   {tz.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>



//         {/* Preferred Start Date */}
//         <div className="flex flex-col w-full">
//           <label className="text-xs text-start text-gray-500 mb-1">Preferred Start Date</label>
//           <Select
//             value={data.preferredStartDate || undefined}
//             onValueChange={(val) => handle("preferredStartDate", val)}
//           >
//             <SelectTrigger className="border rounded-md h-10 w-full">
//               <SelectValue placeholder="Select start date" />
//             </SelectTrigger>
//             <SelectContent>
//               {generateAvailableDates().map((d) => (
//                 <SelectItem key={d} value={d}>
//                   {d}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Preferred Start Time */}
//         <div className="flex flex-col w-full">
//           <label className="text-xs text-start text-gray-500 mb-1">Preferred Start Time</label>
//           <Select
//             value={data.preferredStartTime || undefined}
//             onValueChange={(val) => handle("preferredStartTime", val)}
//           >
//             <SelectTrigger className="border rounded-md h-10 w-full">
//               <SelectValue placeholder="Select time" />
//             </SelectTrigger>
//             <SelectContent>
//               {generateTimeSlots().map((t) => (
//                 <SelectItem key={t} value={t}>
//                   {t}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//       </div>
//     </div>
//   );
// }












"use client";

import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateAvailableDates, generateTimeSlots } from "@/lib/constants/timezones";

import { PhoneInput } from "react-international-phone";
import { toast } from "sonner";
import "react-international-phone/style.css";
import { useCurrency } from "@/hooks/useCurrency";
import { roundToNearestFive } from "@/lib/validation";

import { DatePicker } from "@/components/ui/DatePicker";
import moment from "moment-timezone";
import TimezoneSelect from "@/components/ui/time-zones";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ✅ Build timezone options using moment-timezone
const timezones = moment.tz.names().map((tz) => {
  const offset = moment.tz(tz).utcOffset();
  const hours = Math.floor(offset / 60);
  const minutes = offset % 60;
  const sign = offset >= 0 ? "+" : "-";
  const formatted = `UTC${sign}${String(Math.abs(hours)).padStart(2, "0")}:${String(
    Math.abs(minutes)
  ).padStart(2, "0")}`;

  return {
    value: tz,
    label: `${tz} (${formatted})`,
  };
});

interface StudentFormProps {
  index: number;
  data: any;
  onChange: (newData: any) => void;
  basePrice: number;
}

export default function StudentForm({
  index,
  data,
  onChange,
  basePrice,
}: StudentFormProps) {
  const { symbol, rate } = useCurrency();
  const handle = (name: string, value: string | number) =>
    onChange({ ...data, [name]: value });

  // 🟢 Handle frequency + price
  const handleFrequency = (val: string) => {
    const freq = parseInt(val);
    let price = basePrice;
    if (freq === 3) price += 10;
    if (freq === 4) price += 20;
    if (freq === 5) price += 25;
    onChange({ ...data, frequency: freq, price });
  };

  // 🟢 Toggle days
  const toggleDay = (day: string) => {
    let selected = data.classDays || [];
    if (selected.includes(day)) {
      selected = selected.filter((d: string) => d !== day);
    } else {
      if (selected.length < (data.frequency || 2)) {
        selected = [...selected, day];
      } else {
        toast.error(`You can only select ${data.frequency || 2} days per week`);
        return;
      }
    }
    onChange({ ...data, classDays: selected });
  };

  return (
    <div className="p-4 border rounded-xl shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="flex flex-col w-full">
          <label className="text-xs text-start text-gray-500 mb-1">Name</label>
          <input
            name="name"
            value={data.name || ""}
            placeholder="Full Name"
            onChange={(e) => handle("name", e.target.value)}
            className="border rounded-md h-10 px-3 w-full"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col w-full">
          <label className="text-xs text-start text-gray-500 mb-1">Email</label>
          <input
            name="email"
            value={data.email || ""}
            placeholder="Email Address"
            onChange={(e) => handle("email", e.target.value)}
            className="border rounded-md h-10 px-3 w-full"
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col w-full md:col-span-1">
          <label className="text-xs text-start text-gray-500 mb-1">
            Student&apos;s Number
          </label>
          <PhoneInput
            defaultCountry="us"
            preferredCountries={["us", "gb", "ca", "au"]}
            value={data.phone || ""}
            onChange={(phone) => handle("phone", phone)}
            inputClassName="w-full border rounded-sm p-2 bg-transparent"
            className="bg-transparent h-10"
          />
        </div>

        {/* Date of Birth */}
        <div className="flex flex-col w-full">
          <label className="text-xs text-start text-gray-500 mb-1">
            Date of Birth
          </label>
          <DatePicker
            value={data.dateOfBirth || ""}
            onChange={(val) => handle("dateOfBirth", val)}
          />
        </div>

        {/* Gender */}
        <div className="flex flex-col w-full md:col-span-1">
          <label className="text-xs text-start text-gray-500 mb-1">Gender</label>
          <ShadcnSelect
            value={data.gender || undefined}
            onValueChange={(val) => handle("gender", val)}
          >
            <SelectTrigger className="border rounded-md h-10 w-full">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </ShadcnSelect>
        </div>

        <hr className="border-1 border-gray-400 md:col-span-2" />

        {/* Frequency */}
        <div className="flex flex-col w-full">
          <label className="text-xs text-start text-gray-500 mb-1">
            Classes/week (Basic Quran Learning)
          </label>
          <ShadcnSelect
            onValueChange={handleFrequency}
            value={data.frequency ? String(data.frequency) : undefined}
          >
            <SelectTrigger className="border rounded-md h-10 w-full">
              <SelectValue placeholder="Select classes per week" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">
                2 Classes/week ({symbol}
                {basePrice})
              </SelectItem>
              <SelectItem value="3">
                3 Classes/week ({symbol}
                {basePrice + 10})
              </SelectItem>
              <SelectItem value="4">
                4 Classes/week ({symbol}
                {basePrice + 20})
              </SelectItem>
              <SelectItem value="5">
                5 Classes/week ({symbol}
                {basePrice + 25})
              </SelectItem>
            </SelectContent>
          </ShadcnSelect>
        </div>

        {/* Auto Price */}
        <div className="flex flex-col w-full">
          <label className="text-xs text-start text-gray-500 mb-1">
            Fee/Month in {symbol}
          </label>
          <input
            name="price"
            value={roundToNearestFive(Number(data.price * rate)) || ""}
            readOnly
            placeholder={symbol}
            className="border rounded-md h-10 px-3 w-full bg-gray-100"
          />
        </div>

        {/* Days */}
        <div className="flex flex-col w-full md:col-span-1">
          <label className="text-xs text-start text-gray-500 mb-1">
            Select Days
          </label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => (
              <button
                type="button"
                key={day}
                onClick={() => toggleDay(day)}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm border transition ${data.classDays?.includes(day)
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-300"
                  }`}
              >
                {day[0]}
              </button>
            ))}
          </div>
        </div>

        {/* ✅ Timezone (using moment-timezone + Command-based searchable select) */}
        <div className="flex flex-col w-full">
          <label className="text-xs text-start text-gray-500 mb-1">Timezone</label>
          <TimezoneSelect
            value={data.timezone || ""}
            onChange={(val) => handle("timezone", val)}
          />


        </div>


        {/* Preferred Start Date */}
        <div className="flex flex-col w-full">
          <label className="text-xs text-start text-gray-500 mb-1">
            Preferred Start Date
          </label>
          <ShadcnSelect
            value={data.preferredStartDate || undefined}
            onValueChange={(val) => handle("preferredStartDate", val)}
          >
            <SelectTrigger className="border rounded-md h-10 w-full">
              <SelectValue placeholder="Select start date" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {generateAvailableDates().map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </ShadcnSelect>
        </div>

        {/* Preferred Start Time */}
        <div className="flex flex-col w-full">
          <label className="text-xs text-start text-gray-500 mb-1">
            Preferred Start Time
          </label>
          <ShadcnSelect
            value={data.preferredStartTime || undefined}
            onValueChange={(val) => handle("preferredStartTime", val)}
          >
            <SelectTrigger className="border rounded-md h-10 w-full">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {generateTimeSlots().map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </ShadcnSelect>
        </div>
      </div>
    </div>
  );
}
