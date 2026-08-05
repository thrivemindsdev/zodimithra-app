import BodyLayout from "@/components/layout/BodyLayout";
import Header from "@/components/layout/Header";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const YesOrNo = () => {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!value.trim()) return;
    navigate("/tarot-cards/2");
  };

  return (
    <>
      <Header
        title="Tarot Reading"
        subtitle="Tarot gives you ideas for the life"
        showBackButton
        redirectPath="/tarot-reading"
      />

      <BodyLayout>
        <>
          <h2 className="text-2xl font-body font-bold text-text-primary">
            Yes or No
          </h2>

          <p className="text-sm font-body text-text-secondary pb-2">
            Ask your question here!
          </p>

          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type here"
            className="outline-none capitalize bg-input-bg border border-input-border w-full px-4 py-2 rounded-2xl"
          />

          <button
            onClick={handleSubmit}
            disabled={!value.trim()}
            className="mt-4 w-full disabled:opacity-50 bg-primary text-white py-3 rounded-2xl font-semibold hover:opacity-90 transition"
          >
            Submit
          </button>
        </>
      </BodyLayout>
    </>
  );
};

export default YesOrNo;
