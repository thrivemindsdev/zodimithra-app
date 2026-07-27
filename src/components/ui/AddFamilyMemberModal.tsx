import React, { useState, useEffect, useRef, type FormEvent } from "react";
import { User, X, ChevronDown } from "lucide-react";
import PlaceInput from "../common/PlaceInput";
import TimeInput from "../common/TimeInput";
import DateInput from "../common/DateInput";
import Input from "../common/Input";
import { AddFamilyMember } from "@/services/user.api";
import { useQueryClient } from "@tanstack/react-query";
import { USER_QUERY_KEYS } from "@/queries/userQueries";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface FormState {
  fullName: string;
  dob: string;
  tob: string;
  pob: string;
  lat: string;
  lon: string;
  relation: string;
}

const initialFormState: FormState = {
  fullName: "",
  dob: "",
  tob: "",
  pob: "",
  lat: "",
  lon: "",
  relation: "",
};

const RELATION_OPTIONS = [
  "Spouse",
  "Parent",
  "Child",
  "Sibling",
  "Relative",
  "Friend",
];

const AddFamilyMemberModal = ({ open, setOpen }: Props) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close custom relation dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!open) return null;

  const handleClose = () => {
    setFormData(initialFormState);
    setIsDropdownOpen(false);
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectRelation = (relation: string) => {
    setFormData((prev) => ({ ...prev, relation }));
    setIsDropdownOpen(false);
  };

  const handlePlaceChange = (
    selectedPlace: string,
    latitude?: string,
    longitude?: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      pob: selectedPlace,
      lat: latitude ?? "",
      lon: longitude ?? "",
    }));
  };

  const isFormIncomplete =
    !formData.fullName ||
    !formData.dob ||
    !formData.tob ||
    !formData.pob ||
    !formData.relation;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isFormIncomplete) return;
    try {
      const payload = {
        name: formData.fullName,
        relation: formData.relation,
        date_of_birth: formData.dob,
        birth_time: formData.tob,
        birth_place: formData.pob,
        latitude: formData.lat,
        longitude: formData.lon,
      };
      await AddFamilyMember(payload);
      await queryClient.invalidateQueries({
        queryKey: [USER_QUERY_KEYS.familyMembers],
      });
    } catch (error) {
      console.error(error);
    } finally {
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl transition-all">
        {/* Header */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            <X size={20} />
          </button>
        </div>
        <h2 className="text-xl text-center font-body-content font-bold text-gradient">
          Add Family Member
        </h2>
        <p className="pt-1 pb-4 text-sm text-center text-text-secondary">
          Enter the birth details of your family member
        </p>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <Input
            label="Full Name"
            name="fullName"
            icon={User}
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="e.g. John Doe"
          />

          {/* Custom Relation Dropdown (UL/LI) */}
          <div className="relative flex flex-col gap-1.5" ref={dropdownRef}>
            <label className="text-xs font-semibold text-text-primary">
              Relation
            </label>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex py-2 w-full items-center justify-between bg-input-bg border border-input-border rounded-lg px-4 text-sm font-medium outline-none"
            >
              <span
                className={
                  formData.relation ? "text-text-primary" : "text-gray-400"
                }
              >
                {formData.relation || "Select relation"}
              </span>
              <ChevronDown
                size={18}
                className={`text-gray-500 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <ul className="absolute top-19 z-100 max-h-48 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white p-1 shadow-lg">
                {RELATION_OPTIONS.map((option) => (
                  <li
                    key={option}
                    onClick={() => handleSelectRelation(option)}
                    className={`cursor-pointer rounded-lg px-3 py-2 text-sm transition hover:bg-gray-100 ${
                      formData.relation === option
                        ? "bg-gray-50 font-semibold text-primary"
                        : "text-text-primary"
                    }`}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Date & Time Cluster Layout */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DateInput
              label="Date of Birth"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
            />
            <TimeInput
              label="Time of Birth"
              name="tob"
              value={formData.tob}
              onChange={handleInputChange}
            />
          </div>

          {/* Place of Birth */}
          <PlaceInput
            label="Place of Birth"
            value={formData.pob}
            onChange={handlePlaceChange}
          />

          {/* Action Buttons */}
          <div className="mt-6 grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="w-full rounded-xl border border-primary bg-white py-2.5 text-sm font-semibold text-primary transition hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isFormIncomplete}
              className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none"
            >
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFamilyMemberModal;
