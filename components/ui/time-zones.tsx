

// "use client";

// import * as React from "react";
// import moment from "moment-timezone";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
// } from "@/components/ui/command";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Button } from "@/components/ui/button";
// import { Check, ChevronsUpDown } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface TimezoneOption {
//   value: string;
//   label: string;
// }

// interface TimezoneSelectProps {
//   value?: string;
//   onChange: (val: string) => void;
// }

// export default function TimezoneSelect({ value, onChange }: TimezoneSelectProps) {
//   const [open, setOpen] = React.useState(false);
//   const [search, setSearch] = React.useState("");

//   const timezones: TimezoneOption[] = React.useMemo(
//     () =>
//       moment.tz.names().map((tz) => ({
//         value: tz,
//         label: `${tz} (UTC${moment.tz(tz).format("Z")})`,
//       })),
//     []
//   );

//   // Filter based on search
//   const filteredTimezones = React.useMemo(
//     () =>
//       timezones.filter((tz) =>
//         tz.label.toLowerCase().includes(search.toLowerCase())
//       ),
//     [search, timezones]
//   );

//   const selectedLabel =
//     timezones.find((tz) => tz.value === value)?.label || "Select timezone";

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button
//           variant="outline"
//           role="combobox"
//           aria-expanded={open}
//           className="w-full justify-between"
//         >
//           {selectedLabel}
//           <ChevronsUpDown className=" h-4 w-4 shrink-0 opacity-50" />
//         </Button>
//       </PopoverTrigger>

//       <PopoverContent className="w-[300px] p-0">
//         <Command value={search} onValueChange={setSearch}>
//           <CommandInput placeholder="Search timezone..." />
//           <CommandEmpty>No timezone found.</CommandEmpty>
//           <CommandGroup className="max-h-[200px] overflow-y-auto">
//             {filteredTimezones.map((tz) => (
//               <CommandItem
//                 key={tz.value}
//                 value={tz.value} // important for Command's internal filtering
//                 onSelect={() => {
//                   onChange(tz.value);
//                   setOpen(false);
//                   setSearch(""); // reset search
//                 }}
//               >
//                 <Check
//                   className={cn(
//                     "-ms-3 h-4 w-4",
//                     tz.value === value ? "opacity-100" : "opacity-0"
//                   )}
//                 />
//                 {tz.label}
//               </CommandItem>
//             ))}
//           </CommandGroup>
//         </Command>
//       </PopoverContent>
//     </Popover>
//   );
// }














"use client";

import * as React from "react";
import moment from "moment-timezone";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { manualTimezones } from "@/lib/constants/timezones";

interface TimezoneOption {
  value: string;
  label: string;
}

interface TimezoneSelectProps {
  value?: string;
  onChange: (val: string) => void;
}

export default function TimezoneSelect({ value, onChange }: TimezoneSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  
  // 🟢 Full list from moment
  const allTimezones: TimezoneOption[] = moment.tz.names().map((tz) => ({
    value: tz,
    label: `${tz} (UTC${moment.tz(tz).format("Z")})`,
  }));

  // 🟢 Combine manual + all (manual appear on top)
  const timezones: TimezoneOption[] = [...manualTimezones, ...allTimezones];

  // 🟢 Filter based on search
  const filteredTimezones = React.useMemo(
    () =>
      timezones.filter((tz) =>
        tz.label.toLowerCase().includes(search.toLowerCase())
      ),
    [search, timezones]
  );

  const selectedLabel =
    timezones.find((tz) => tz.value === value)?.label || "Select timezone";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedLabel}
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] p-0">
        <Command value={search} onValueChange={setSearch}>
          <CommandInput placeholder="Search timezone..." />
          <CommandEmpty>No timezone found.</CommandEmpty>
          <CommandGroup className="max-h-[200px] overflow-y-auto">
            {filteredTimezones.map((tz) => (
              <CommandItem
                key={tz.value}
                value={tz.value}
                onSelect={() => {
                  onChange(tz.value);
                  setOpen(false);
                  setSearch(""); // reset search
                }}
              >
                <Check
                  className={cn(
                    "-ms-3 h-4 w-4",
                    tz.value === value ? "opacity-100" : "opacity-0"
                  )}
                />
                {tz.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
