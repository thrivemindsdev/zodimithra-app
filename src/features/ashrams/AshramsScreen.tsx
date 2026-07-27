import BodyLayout from "@/components/layout/BodyLayout";
import Header from "@/components/layout/Header";
import AshramsBanner from "./components/AshramsBanner";
import AshramsList from "./components/AshramsList";

const AshramsScreen = () => {
  return (
    <>
      <Header title="Ashrams" showBackButton redirectPath="/home" />
      <BodyLayout>
        <AshramsBanner />
        <AshramsList />
      </BodyLayout>
    </>
  );
};

export default AshramsScreen;
