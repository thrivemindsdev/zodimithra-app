import { useState } from "react";
import DateInput from "./DateInput";
import Input from "./Input";
import PlaceInput from "./PlaceInput";
import TimeInput from "./TimeInput";

export default function NextGenerationForm() {
  const [profile, setProfile] = useState({
    name: "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
  });

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow border border-gray-100 space-y-4">
      <Input
        label="Full Name"
        value={profile.name}
        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
      />

      <div className="grid grid-cols-2 gap-4">
        <DateInput
          label="Date of Birth"
          value={profile.birthDate}
          onChange={(e) =>
            setProfile({ ...profile, birthDate: e.target.value })
          }
        />
        <TimeInput
          label="Time of Birth"
          value={profile.birthTime}
          onChange={(e) =>
            setProfile({ ...profile, birthTime: e.target.value })
          }
        />
      </div>

      <PlaceInput
        label="Place of Birth"
        value={profile.birthPlace}
        onChange={(selectedPlace) =>
          setProfile({ ...profile, birthPlace: selectedPlace })
        }
      />
    </div>
  );
}
