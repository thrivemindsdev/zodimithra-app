import { Plus, Search } from "lucide-react";
import { memo, useState } from "react";

import AquariusImage from "@/assets/signs/AQUARIUS.png";
import AriesImage from "@/assets/signs/ARIES.png";
import CancerImage from "@/assets/signs/CANCER.png";
import CapricornImage from "@/assets/signs/CAPRICON.png";
import GeminiImage from "@/assets/signs/GEMINI.png";
import LeoImage from "@/assets/signs/LEO.png";
import LibraImage from "@/assets/signs/LIBRA.png";
import PiscesImage from "@/assets/signs/PISCES.png";
import SagittariusImage from "@/assets/signs/SAGITTARUIS.png";
import ScorpioImage from "@/assets/signs/SCORPION.png";
import TaurusImage from "@/assets/signs/TAURUS.png";
import VirgoImage from "@/assets/signs/VIRGO.png";
import HomeGreetings from "@/features/home/components/HomeGreetings";
import { useToastModal } from "@/hooks/useToastModal";
import {
  useGetFamilyMembersQuery,
  useGetUserDetailsQuery,
} from "@/queries/userQueries";
import { useActiveUserStore } from "@/store/useActiveUserStore";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import GlobalLoader from "../common/GlobalLoader";
import ToastModal from "../common/ToastModal";
import BodyLayout from "../layout/BodyLayout";
import Header from "../layout/Header";
import AddFamilyMemberModal from "./AddFamilyMemberModal";

const zodiacSigns: Record<string, string> = {
  Aries: AriesImage,
  Taurus: TaurusImage,
  Gemini: GeminiImage,
  Cancer: CancerImage,
  Leo: LeoImage,
  Virgo: VirgoImage,
  Libra: LibraImage,
  Scorpio: ScorpioImage,
  Sagittarius: SagittariusImage,
  Capricorn: CapricornImage,
  Aquarius: AquariusImage,
  Pisces: PiscesImage,
};

const FamilyMembers = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const { toastState, showError, hideToast } = useToastModal();
  const { data: familyMembersData, isLoading } = useGetFamilyMembersQuery();
  const { data: userData, isLoading: isUserLoading } = useGetUserDetailsQuery();
  const isPremium = userData?.is_subscribed;
  const { setActiveUser } = useActiveUserStore();

  const filteredMembers =
    familyMembersData &&
    familyMembersData?.filter(
      (member: any) =>
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.zodiac_sign.toLowerCase().includes(search.toLowerCase()),
    );

  const handleAdd = () => {
    const count = familyMembersData?.length || 0;

    if (!isPremium) {
      if (count < 2) {
        setOpen(true);
      } else {
        navigate("/premium");
      }
    } else {
      if (count < 4) {
        setOpen(true);
      } else {
        showError(
          t("family.limitReachedTitle", "Limit Reached"),
          t(
            "family.limitReachedDesc",
            "You have reached the maximum limit of 4 family members.",
          ),
          t("payment.done", "Done"),
        );
      }
    }
  };

  if (isLoading || isUserLoading) {
    return <GlobalLoader />;
  }

  return (
    <>
      <Header
        title={t("family.title", "Family Members")}
        showBackButton
        redirectPath="/home"
      />
      <BodyLayout>
        <HomeGreetings
          loading={isUserLoading}
          data={userData}
          moreInfo={false}
        />
        {/* Search */}
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 flex-1 items-center rounded-full border border-gray-300 bg-white px-4 shadow-sm">
            <Search size={18} className="text-gray-500" />

            <input
              type="text"
              placeholder={t("family.searchPlaceholder", "Search Members")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ml-3 w-full bg-transparent text-sm font-medium outline-none placeholder:text-text-secondary capitalize"
            />
          </div>

          <button
            onClick={handleAdd}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 bg-white shadow-sm transition hover:scale-105"
          >
            <Plus size={22} />
          </button>
        </div>

        {/* Members */}
        <div className="space-y-4">
          {filteredMembers?.map((member: any) => (
            <div
              key={member.user_id}
              onClick={() => {
                setActiveUser(member);
                navigate("/home");
              }}
              className="flex items-center rounded-3xl border border-gray-200 border-t-0 bg-white p-3 shadow-[0_1px_0_rgba(0,0,0,0.12)] transition-all duration-300 hover:shadow-md"
            >
              {/* Avatar */}
              <div className="mr-4 h-16 w-16 overflow-hidden rounded-2xl bg-gray-100">
                <img
                  src={zodiacSigns[member.zodiac_sign]}
                  alt={member.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1">
                <h2 className="text-lg capitalize font-body-content font-semibold text-text-primary">
                  {member.name}
                </h2>

                <p className="text-sm font-body-content font-normal text-text-secondary">
                  {String(
                    t(
                      `freeKundli.${member.zodiac_sign.toLowerCase()}`,
                      member.zodiac_sign,
                    ),
                  )}
                </p>
              </div>

              {/* Relation */}
              <span className="rounded-full bg-[#0000001A] px-3 py-1 text-[10px] font-semibold tracking-wide text-text-primary">
                {String(
                  t(
                    `family.${member.relation?.toLowerCase()}`,
                    member.relation || "",
                  ),
                )}
              </span>
            </div>
          ))}
        </div>
      </BodyLayout>
      {open && <AddFamilyMemberModal open={open} setOpen={setOpen} />}
      <ToastModal
        isOpen={toastState.isOpen}
        status={toastState.status}
        title={toastState.title}
        description={toastState.description}
        buttonText={toastState.buttonText}
        onDone={hideToast}
      />
    </>
  );
};

export default memo(FamilyMembers);
