// export const TIMEZONES = [
//   // European Timezones
//   { value: 'Europe/London', label: 'London (GMT)' },
//   { value: 'Europe/Paris', label: 'Paris (CET)' },
//   { value: 'Europe/Berlin', label: 'Berlin (CET)' },
//   { value: 'Europe/Madrid', label: 'Madrid (CET)' },
//   { value: 'Europe/Rome', label: 'Rome (CET)' },
//   { value: 'Europe/Moscow', label: 'Moscow (MSK)' },
//   { value: 'Europe/Istanbul', label: 'Istanbul (TRT)' },

//   // American Timezones
//   { value: 'America/New_York', label: 'New York (EST)' },
//   { value: 'America/Chicago', label: 'Chicago (CST)' },
//   { value: 'America/Denver', label: 'Denver (MST)' },
//   { value: 'America/Los_Angeles', label: 'Los Angeles (PST)' },
//   { value: 'America/Sao_Paulo', label: 'São Paulo (BRT)' },
//   { value: 'America/Mexico_City', label: 'Mexico City (CST)' },

//   // Asian Timezones
//   { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
//   { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
//   { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)' },
//   { value: 'Asia/Kolkata', label: 'Kolkata (IST)' },
//   { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
//   { value: 'Asia/Seoul', label: 'Seoul (KST)' },
  
//   // Middle Eastern Timezones
//   { value: 'Asia/Dubai', label: 'Dubai (GST)' },
//   { value: 'Asia/Riyadh', label: 'Riyadh (AST)' },
//   { value: 'Asia/Karachi', label: 'Karachi (PKT)' },
//   { value: 'Asia/Jerusalem', label: 'Jerusalem (IST)' },
// ];













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