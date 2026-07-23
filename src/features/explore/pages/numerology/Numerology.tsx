import BodyLayout from "@/components/layout/BodyLayout";
import Header from "@/components/layout/Header";
import NumerologyForm from "./components/NumerologyForm";

const Numerology = () => {
  return (
    <>
      <Header
        title="Numerology Calculator"
        subtitle="Find the luck wth the numbers"
        showBackButton
      />
      <BodyLayout>
        <NumerologyForm />
      </BodyLayout>
    </>
  );
};

export default Numerology;
