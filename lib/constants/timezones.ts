interface TimezoneOption {
  value: string;
  label: string;
}


export const manualTimezones: TimezoneOption[] = [
  // UK & Europe
  { value: "Europe/London", label: "London, UK (UTC+00:00)" },
  { value: "Europe/Paris", label: "Paris, France (UTC+01:00)" },
  { value: "Europe/Berlin", label: "Berlin, Germany (UTC+01:00)" },
  { value: "Europe/Madrid", label: "Madrid, Spain (UTC+01:00)" },
  { value: "Europe/Rome", label: "Rome, Italy (UTC+01:00)" },
  { value: "Europe/Amsterdam", label: "Amsterdam, Netherlands (UTC+01:00)" },
  { value: "Europe/Brussels", label: "Brussels, Belgium (UTC+01:00)" },
  { value: "Europe/Zurich", label: "Zurich, Switzerland (UTC+01:00)" },
  { value: "Europe/Stockholm", label: "Stockholm, Sweden (UTC+01:00)" },
  { value: "Europe/Oslo", label: "Oslo, Norway (UTC+01:00)" },
  { value: "Europe/Helsinki", label: "Helsinki, Finland (UTC+02:00)" },
  { value: "Europe/Vienna", label: "Vienna, Austria (UTC+01:00)" },
  { value: "Europe/Athens", label: "Athens, Greece (UTC+02:00)" },
  { value: "Europe/Dublin", label: "Dublin, Ireland (UTC+00:00)" },
  { value: "Europe/Lisbon", label: "Lisbon, Portugal (UTC+00:00)" },
  { value: "Europe/Istanbul", label: "Istanbul, Türkiye (UTC+03:00)" },

  // North America
  { value: "America/New_York", label: "New York, USA (UTC-05:00)" },
  { value: "America/Chicago", label: "Chicago, USA (UTC-06:00)" },
  { value: "America/Denver", label: "Denver, USA (UTC-07:00)" },
  { value: "America/Los_Angeles", label: "Los Angeles, USA (UTC-08:00)" },
  { value: "America/Phoenix", label: "Phoenix, USA (UTC-07:00)" },
  { value: "America/Detroit", label: "Detroit, USA (UTC-05:00)" },
  { value: "America/Toronto", label: "Toronto, Canada (UTC-05:00)" },
  { value: "America/Vancouver", label: "Vancouver, Canada (UTC-08:00)" },
  { value: "America/Montreal", label: "Montreal, Canada (UTC-05:00)" },
  { value: "America/Halifax", label: "Halifax, Canada (UTC-04:00)" },
  { value: "America/Mexico_City", label: "Mexico City, Mexico (UTC-06:00)" },

  // South America
  { value: "America/Sao_Paulo", label: "São Paulo, Brazil (UTC-03:00)" },
  { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires, Argentina (UTC-03:00)" },
  { value: "America/Lima", label: "Lima, Peru (UTC-05:00)" },
  { value: "America/Bogota", label: "Bogotá, Colombia (UTC-05:00)" },
  { value: "America/Santiago", label: "Santiago, Chile (UTC-04:00)" },

  // Australia & New Zealand
  { value: "Australia/Sydney", label: "Sydney, Australia (UTC+10:00)" },
  { value: "Australia/Melbourne", label: "Melbourne, Australia (UTC+10:00)" },
  { value: "Australia/Perth", label: "Perth, Australia (UTC+08:00)" },
  { value: "Australia/Brisbane", label: "Brisbane, Australia (UTC+10:00)" },
  { value: "Pacific/Auckland", label: "Auckland, New Zealand (UTC+12:00)" },
  { value: "Pacific/Fiji", label: "Suva, Fiji (UTC+12:00)" },

  // Middle East & Asia
  { value: "Asia/Karachi", label: "Karachi, Pakistan (UTC+05:00)" },
  { value: "Asia/Dubai", label: "Dubai, UAE (UTC+04:00)" },
  { value: "Asia/Qatar", label: "Doha, Qatar (UTC+03:00)" },
  { value: "Asia/Kuwait", label: "Kuwait City, Kuwait (UTC+03:00)" },
  { value: "Asia/Riyadh", label: "Riyadh, Saudi Arabia (UTC+03:00)" },
  { value: "Asia/Tehran", label: "Tehran, Iran (UTC+03:30)" },
  { value: "Asia/Kolkata", label: "Mumbai/Delhi, India (UTC+05:30)" },
  { value: "Asia/Shanghai", label: "Shanghai, China (UTC+08:00)" },
  { value: "Asia/Tokyo", label: "Tokyo, Japan (UTC+09:00)" },
  { value: "Asia/Seoul", label: "Seoul, South Korea (UTC+09:00)" },
  { value: "Asia/Singapore", label: "Singapore (UTC+08:00)" },
  { value: "Asia/Hong_Kong", label: "Hong Kong (UTC+08:00)" },
  { value: "Asia/Bangkok", label: "Bangkok, Thailand (UTC+07:00)" },
  { value: "Asia/Kuala_Lumpur", label: "Kuala Lumpur, Malaysia (UTC+08:00)" },
  { value: "Asia/Jakarta", label: "Jakarta, Indonesia (UTC+07:00)" }
];





export function generateTimeSlots() {
  const slots = [];
  for (let h = 0; h < 24; h++) {
    // Determine the hour for 12-hour format
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    // Determine the AM/PM suffix
    const ampm = h >= 12 ? 'PM' : 'AM';

    // Format the hours and minutes with leading zeros
    const formatHour = displayHour.toString();
    
    // Add :00 slot
    slots.push(`${formatHour}:00 ${ampm}`);
    // Add :30 slot
    slots.push(`${formatHour}:30 ${ampm}`);
  }
  return slots;
}


export function generateAvailableDates(): string[] {
  const today = new Date();
  const dates: string[] = [];

  for (let i = 5; i <= 19; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const day = d.getDate().toString().padStart(2, "0");
    const month = d.toLocaleString("en-US", { month: "short" });
    const formatted = `${day} ${month} ${d.getFullYear()}`;
    dates.push(formatted);
  }

  return dates;
}