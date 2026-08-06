import BodyLayout from "@/components/layout/BodyLayout";
import Header from "@/components/layout/Header";
import {
  useGetDayDetailsQuery,
  useGetEventsQuery,
  useGetFestivalsQuery,
} from "@/queries/calendarQueries";
import { useCosmicEnergyQuery } from "@/queries/homeQueries";
import { useGetCurrentLocationQuery } from "@/queries/locationQueries";
import { timeZone } from "@/utils/timezone-utils";
import { format } from "date-fns";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import CalendarLayout from "./components/CalendarLayout";
import DayDetails from "./components/DayDetails";
import EventsPlanner from "./components/EventsPlanner";
import Festival from "./components/Festival";
import PlanetCard from "./components/PlanetCard";

const CalendarScreen = () => {
  // const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const date = format(selectedDate, "yyyy-MM-dd");
  const { data: planetData, isLoading: isPlanetLoading } = useCosmicEnergyQuery(
    { lang: i18n.language ?? "en" },
  );
  const { data: festivalData, isLoading: isFestivalLoading } =
    useGetFestivalsQuery({
      year: selectedDate.getFullYear(),
      month: selectedDate.getMonth() + 1,
      day: selectedDate.getDate(),
      country: "IN",
    });

  const { data: location, isLoading: isLocationLoading } =
    useGetCurrentLocationQuery();

  const { data: eventsData, isLoading: isEventsLoading } = useGetEventsQuery({
    lang: i18n.language ?? "en",
  });

  const { data: dayDetails, isLoading: isDayDetailsLoading } =
    useGetDayDetailsQuery({
      dob: date,
      lat: Number(location?.latitude),
      lon: Number(location?.longitude),
      tz: timeZone,
    });

  return (
    <>
      <Header title={t("calendar.title")} subtitle={t("calendar.subTitle")} />
      <BodyLayout>
        <CalendarLayout
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          location={location}
          loading={isLocationLoading}
        />
        <PlanetCard loading={isPlanetLoading} planetData={planetData} />
        <Festival
          loading={isFestivalLoading}
          festivalData={festivalData?.holidays}
          selectedDate={selectedDate.getDate()}
          selectedMonth={selectedDate.getMonth()}
        />
        <DayDetails
          loading={isDayDetailsLoading || isLocationLoading}
          data={dayDetails}
        />
        <EventsPlanner loading={isEventsLoading} data={eventsData} />
        {/* <button
          onClick={() => navigate("/shubdin-finder")}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl  px-6 py-4 text-md font-semibold font-body-content text-white bg-linear-to-r from-button-primary to-button-secondary"
        >
          <Calendar size={16} />
          <span>Shub Din Finder</span>
        </button> */}
      </BodyLayout>
    </>
  );
};

export default CalendarScreen;
