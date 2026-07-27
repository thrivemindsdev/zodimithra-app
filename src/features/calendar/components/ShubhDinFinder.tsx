import BodyLayout from "@/components/layout/BodyLayout";
import Header from "@/components/layout/Header";
import { Clock3, Moon, Sparkles, Star } from "lucide-react";
import { useState } from "react";

type Category = {
  id: number;
  title: string;
};

type Event = {
  day: string;
  date: number;
  month: string;
  year: number;
  weekday: string;
  title: string;
  rating: number;
  tithi: string;
  star: string;
  time: string;
};

const categories: Category[] = [
  { id: 1, title: "Griha Pravesh" },
  { id: 2, title: "Namkaran" },
  { id: 3, title: "Bhoomi Pujan" },
  { id: 4, title: "Property Purchase" },
  { id: 5, title: "Engagement" },
  { id: 6, title: "Renovation Start" },
  { id: 7, title: "Vehicle Purchase" },
  { id: 8, title: "Gold & Jewellery" },
  { id: 9, title: "First Salary/Dealing" },
  { id: 10, title: "Investment & Trading" },
  { id: 11, title: "New Venture Start" },
  { id: 12, title: "Shop/Office Inauguration" },
  { id: 13, title: "Vivah (Wedding)" },
  { id: 14, title: "Vidyarambh" },
  { id: 15, title: "Other" },
];

const events: Event[] = [
  {
    day: "14",
    date: 14,
    month: "April",
    year: 2026,
    weekday: "Tuesday",
    title: "Shukla Tritiya",
    rating: 5,
    tithi: "Rohini",
    star: "Rohini",
    time: "9:15 AM - 11:30 AM",
  },
  {
    day: "22",
    date: 22,
    month: "April",
    year: 2026,
    weekday: "Wednesday",
    title: "Shukla Ekadashi",
    rating: 5,
    tithi: "Pushya",
    star: "Pushya",
    time: "7:45 AM - 10:00 AM",
  },
  {
    day: "3",
    date: 3,
    month: "May",
    year: 2026,
    weekday: "Sunday",
    title: "Shukla Saptami",
    rating: 4,
    tithi: "Anuradha",
    star: "Anuradha",
    time: "10:30 AM - 12:45 PM",
  },
  {
    day: "18",
    date: 18,
    month: "May",
    year: 2026,
    weekday: "Monday",
    title: "Shukla Panchami",
    rating: 4,
    tithi: "Uttara Phalguni",
    star: "Uttara Phalguni",
    time: "8:00 AM - 10:15 AM",
  },
  {
    day: "7",
    date: 7,
    month: "June",
    year: 2026,
    weekday: "Sunday",
    title: "Shukla Dashami",
    rating: 3,
    tithi: "Hasta",
    star: "Hasta",
    time: "6:30 AM - 9:00 AM",
  },
];

const Rating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((item) => (
        <Star
          key={item}
          size={13}
          className={
            item <= rating
              ? "fill-primary text-primary"
              : "text-primary/50"
          }
        />
      ))}
    </div>
  );
};

const ShubhDinFinder = () => {
  const [selected, setSelected] = useState(7);

  return (
    <>
      <Header
        title="Shub din finder"
        subtitle="Select occation to find auspicious dates"
        showBackButton
        redirectPath="/calendar"
      />
      <BodyLayout>
        {/* Category Chips */}

        <div className="py-3 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item.id)}
              className={`rounded-full border px-3 py-2 text-xs transition-all whitespace-nowrap
            ${
              selected === item.id
                ? "bg-primary text-white border-primary"
                : "bg-white border-primary text-primary"
            }`}
            >
              {item.title}
            </button>
          ))}
        </div>

        {/* Cards */}

        <div className="space-y-4 pt-4 font-body">
          {events.map((event, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-md overflow-hidden flex"
            >
              {/* Left Date */}

              <div className="w-20 bg-gray-100 flex flex-col justify-center items-center py-5 text-text-primary">
                <h2 className="text-3xl font-bold leading-none">
                  {event.date}
                </h2>
                <p className="text-xs mt-2">{event.month}</p>
                <p className="text-xs">{event.year}</p>
              </div>

              {/* Right */}

              <div className="flex-1 p-4">
                <div className="flex justify-between">
                  <h3 className="font-bold text-text-primary">
                    {event.weekday}
                  </h3>
                  <Rating rating={event.rating} />
                </div>
                <div className="flex items-center gap-2 pt-1 text-xs text-text-secondary">
                  <span className="flex items-center gap-1">
                    <Moon size={12} />
                    {event.title}
                  </span>

                  <span className="flex items-center gap-1">
                    <Sparkles size={12} />
                    {event.star}
                  </span>
                </div>

                <div className="pt-2 flex items-center gap-1 text-xs text-text-secondary">
                  <Clock3 size={12} />
                  {event.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </BodyLayout>
    </>
  );
};

export default ShubhDinFinder;
