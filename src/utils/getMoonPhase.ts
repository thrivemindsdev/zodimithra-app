import { getPanchangam, Observer, tithiNames } from "@ishubhamx/panchangam-js";

// Asset Imports
import Moon1 from "@/assets/moon/moon-1.png";
import Moon10 from "@/assets/moon/moon-10.png";
import Moon11 from "@/assets/moon/moon-11.png";
import Moon12 from "@/assets/moon/moon-12.png";
import Moon13 from "@/assets/moon/moon-13.png";
import Moon14 from "@/assets/moon/moon-14.png";
import Moon15 from "@/assets/moon/moon-15.png";
import Moon16 from "@/assets/moon/moon-16.png";
import Moon17 from "@/assets/moon/moon-17.png";
import Moon18 from "@/assets/moon/moon-18.png";
import Moon19 from "@/assets/moon/moon-19.png";
import Moon2 from "@/assets/moon/moon-2.png";
import Moon20 from "@/assets/moon/moon-20.png";
import Moon21 from "@/assets/moon/moon-21.png";
import Moon22 from "@/assets/moon/moon-22.png";
import Moon23 from "@/assets/moon/moon-23.png";
import Moon24 from "@/assets/moon/moon-24.png";
import Moon25 from "@/assets/moon/moon-25.png";
import Moon26 from "@/assets/moon/moon-26.png";
import Moon27 from "@/assets/moon/moon-27.png";
import Moon28 from "@/assets/moon/moon-28.png";
import Moon29 from "@/assets/moon/moon-29.png";
import Moon3 from "@/assets/moon/moon-3.png";
import Moon4 from "@/assets/moon/moon-4.png";
import Moon5 from "@/assets/moon/moon-5.png";
import Moon6 from "@/assets/moon/moon-6.png";
import Moon7 from "@/assets/moon/moon-7.png";
import Moon8 from "@/assets/moon/moon-8.png";
import Moon9 from "@/assets/moon/moon-9.png";

export const MOON_PHASE = [
  { id: 1, name: "Prathama", altName: "Pratipada", paksha: "Shukla", number: 1, description: "1st day of waxing phase", image: Moon14 },
  { id: 2, name: "Dwitiya", paksha: "Shukla", number: 2, description: "2nd day of waxing phase", image: Moon14 },
  { id: 3, name: "Tritiya", paksha: "Shukla", number: 3, description: "3rd day of waxing phase", image: Moon13 },
  { id: 4, name: "Chaturthi", paksha: "Shukla", number: 4, description: "4th day of waxing phase", image: Moon12 },
  { id: 5, name: "Panchami", paksha: "Shukla", number: 5, description: "5th day of waxing phase", image: Moon11 },
  { id: 6, name: "Shashthi", paksha: "Shukla", number: 6, description: "6th day of waxing phase", image: Moon10 },
  { id: 7, name: "Saptami", paksha: "Shukla", number: 7, description: "7th day of waxing phase", image: Moon9 },
  { id: 8, name: "Ashtami", paksha: "Shukla", number: 8, description: "8th day of waxing phase", image: Moon8 },
  { id: 9, name: "Navami", paksha: "Shukla", number: 9, description: "9th day of waxing phase", image: Moon7 },
  { id: 10, name: "Dashami", paksha: "Shukla", number: 10, description: "10th day of waxing phase", image: Moon6 },
  { id: 11, name: "Ekadashi", paksha: "Shukla", number: 11, description: "11th day of waxing phase", image: Moon5 },
  { id: 12, name: "Dwadashi", paksha: "Shukla", number: 12, description: "12th day of waxing phase", image: Moon4 },
  { id: 13, name: "Trayodashi", paksha: "Shukla", number: 13, description: "13th day of waxing phase", image: Moon3 },
  { id: 14, name: "Chaturdashi", paksha: "Shukla", number: 14, description: "14th day of waxing phase", image: Moon2 },
  { id: 15, name: "Purnima", paksha: "Shukla", number: 15, description: "Full Moon Day", image: Moon1 },
  { id: 16, name: "Prathama", altName: "Pratipada", paksha: "Krishna", number: 1, description: "1st day of waning phase", image: Moon29 },
  { id: 17, name: "Dwitiya", paksha: "Krishna", number: 2, description: "2nd day of waning phase", image: Moon28 },
  { id: 18, name: "Tritiya", paksha: "Krishna", number: 3, description: "3rd day of waning phase", image: Moon27 },
  { id: 19, name: "Chaturthi", paksha: "Krishna", number: 4, description: "4th day of waning phase", image: Moon26 },
  { id: 20, name: "Panchami", paksha: "Krishna", number: 5, description: "5th day of waning phase", image: Moon25 },
  { id: 21, name: "Shashthi", paksha: "Krishna", number: 6, description: "6th day of waning phase", image: Moon24 },
  { id: 22, name: "Saptami", paksha: "Krishna", number: 7, description: "7th day of waning phase", image: Moon23 },
  { id: 23, name: "Ashtami", paksha: "Krishna", number: 8, description: "8th day of waning phase", image: Moon22 },
  { id: 24, name: "Navami", paksha: "Krishna", number: 9, description: "9th day of waning phase", image: Moon21 },
  { id: 25, name: "Dashami", paksha: "Krishna", number: 25, description: "10th day of waning phase", image: Moon20 },
  { id: 26, name: "Ekadashi", paksha: "Krishna", number: 11, description: "11th day of waning phase", image: Moon19 },
  { id: 27, name: "Dwadashi", paksha: "Krishna", number: 12, description: "12th day of waning phase", image: Moon18 },
  { id: 28, name: "Trayodashi", paksha: "Krishna", number: 13, description: "13th day of waning phase", image: Moon17 },
  { id: 29, name: "Chaturdashi", paksha: "Krishna", number: 14, description: "14th day of waning phase", image: Moon16 },
  { id: 30, name: "Amavasya", paksha: "Krishna", number: 15, description: "New Moon Day", image: Moon15 },
];

export interface ActivePhase {
  id: number;
  name: string;
  paksha: string;
  number: number;
  description: string;
  image: string;
}

// 1. Synchronous helper using given lat/lng (Best for loops)
export const getPhaseForDateSync = (
  date: Date,
  latitude: number,
  longitude: number
): ActivePhase | null => {
  try {
    const dateObj = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      12, // Noon time
      0,
      0
    );

    const observer = new Observer(latitude, longitude, 0);
    const panchang = getPanchangam(dateObj, observer, {
      timezoneOffset: 330, // IST
    });

    if (panchang) {
      const tithiIndex = panchang.tithi;
      const name = Array.isArray(tithiNames)
        ? tithiNames[tithiIndex] || `Tithi #${tithiIndex}`
        : String(tithiIndex);

      return (
        MOON_PHASE.find(
          (item) => item.name === name && item.paksha === panchang.paksha
        ) || null
      );
    }
  } catch (error) {
    console.error("Error calculating Tithi:", date, error);
  }
  return null;
};
