import { Plus, Search } from "lucide-react";
import { memo, useState } from "react";

import HomeGreetings from "@/features/home/components/HomeGreetings";
import {
  useGetFamilyMembersQuery,
  useGetUserDetailsQuery,
} from "@/queries/userQueries";
import { useNavigate } from "react-router-dom";
import GlobalLoader from "../common/GlobalLoader";
import Header from "../layout/Header";
import BodyLayout from "../layout/BodyLayout";
import AddFamilyMemberModal from "./AddFamilyMemberModal";

const FamilyMembers = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const { data: familyMembersData, isLoading } = useGetFamilyMembersQuery();
  const { data: userData, isLoading: isUserLoading } = useGetUserDetailsQuery();
  const isPremium = userData?.is_subscribed;

  const filteredMembers =
    familyMembersData &&
    familyMembersData?.filter(
      (member: any) =>
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.zodiac_sign.toLowerCase().includes(search.toLowerCase()),
    );

  const handleAdd = () => {
    isPremium ? setOpen(true) : navigate("/home/premium");
  };

  if (isLoading || isUserLoading) {
    return <GlobalLoader />;
  }

  return (
    <>
      <Header title="Family Members" showBackButton />
      <BodyLayout>
        <HomeGreetings data={userData} moreInfo={false} />
        {/* Search */}
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 flex-1 items-center rounded-full border border-gray-300 bg-white px-4 shadow-sm">
            <Search size={18} className="text-gray-500" />

            <input
              type="text"
              placeholder="Search Members"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ml-3 w-full bg-transparent text-sm font-medium outline-none placeholder:text-text-secondary"
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
              key={member.id}
              className="flex items-center rounded-3xl border border-gray-200 border-t-0 bg-white p-3 shadow-[0_1px_0_rgba(0,0,0,0.12)] transition-all duration-300 hover:shadow-md"
            >
              {/* Avatar */}
              <div className="mr-4 h-16 w-16 overflow-hidden rounded-2xl bg-gray-100">
                <img
                  src={member.image}
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
                  {member.zodiac_sign}
                </p>
              </div>

              {/* Relation */}
              <span className="rounded-full bg-[#0000001A] px-3 py-1 text-[10px] font-semibold tracking-wide text-text-primary">
                {member.relation}
              </span>
            </div>
          ))}
        </div>
      </BodyLayout>
      {open && <AddFamilyMemberModal open={open} setOpen={setOpen} />}
    </>
  );
};

export default memo(FamilyMembers);
