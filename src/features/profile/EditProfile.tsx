import DateInput from "@/components/common/DateInput";
import Input from "@/components/common/Input";
import PlaceInput from "@/components/common/PlaceInput";
import TimeInput from "@/components/common/TimeInput";
import BodyLayout from "@/components/layout/BodyLayout";
import Header from "@/components/layout/Header";
import { useGetUserDetailsQuery, USER_QUERY_KEYS } from "@/queries/userQueries";
import { updateUserDetailsApi } from "@/services/user.api";
import { getCroppedImg } from "@/utils/cropImage";
import { useQueryClient } from "@tanstack/react-query";
import { Camera, User, X } from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { type FormState } from "../auth/BirthDetailsForm";
import { Capacitor } from "@capacitor/core";
import { useHardwareBack } from "@/hooks/useHardwareBack";

const EditProfile = () => {
  useHardwareBack({ route: "/profile" });
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: userDetails } = useGetUserDetailsQuery();

  const [formData, setFormData] = useState<FormState>({
    fullName: "",
    dob: "",
    tob: "",
    pob: "",
    lat: "",
    lon: "",
    gender: "",
    relationshipStatus: "",
    profileImage: "",
    phone: "",
  });

  // Track actual cropped File object for FormData submission
  const [croppedFile, setCroppedFile] = useState<File | null>(null);

  // Image Cropper States
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCroppingModalOpen, setIsCroppingModalOpen] = useState(false);

  // Sync state when React Query fetches user details
  useEffect(() => {
    if (userDetails) {
      setFormData({
        fullName: userDetails.name ?? "",
        dob: userDetails.date_of_birth ?? "",
        tob: userDetails.birth_time ?? "",
        pob: userDetails.birth_place ?? "",
        lat: userDetails.latitude ?? "",
        lon: userDetails.longitude ?? "",
        gender: userDetails.gender ?? "",
        relationshipStatus: userDetails.marital_status ?? "",
        profileImage: userDetails.image_url ?? userDetails.image ?? "",
        phone: userDetails.phone ?? "",
      });
    }
  }, [userDetails]);

  const updateField = (field: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    updateField(e.target.name as keyof FormState, e.target.value);
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

  // 1. Handle File Selection
  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setTempImage(reader.result as string);
        setIsCroppingModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // 2. Capture crop completion details
  const onCropComplete = (_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  };

  // 3. Confirm crop, update image preview URL & store File object
  const handleCropSave = async () => {
    if (tempImage && croppedAreaPixels) {
      try {
        const { file, url } = await getCroppedImg(
          tempImage, // FIXED: pass tempImage instead of formData.profileImage
          croppedAreaPixels,
        );
        updateField("profileImage", url); // Display preview URL in avatar
        setCroppedFile(file); // Store File object to append in FormData
        setIsCroppingModalOpen(false);
        setTempImage(null);
      } catch (error) {
        console.error("Error cropping image:", error);
      }
    }
  };

  // Check required text fields validation
  const { profileImage, ...requiredFields } = formData;
  const isFormIncomplete = Object.values(requiredFields).some(
    (val) => !val?.toString().trim(),
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isFormIncomplete) {
      try {
        const formDetails = new FormData();

        formDetails.append("name", formData.fullName);
        formDetails.append("gender", formData.gender);
        formDetails.append("marital_status", formData.relationshipStatus ?? "");
        formDetails.append("date_of_birth", formData.dob ?? "");
        formDetails.append("birth_time", formData.tob ?? "");
        formDetails.append("birth_place", formData.pob ?? "");
        formDetails.append("latitude", formData.lat ?? "");
        formDetails.append("longitude", formData.lon ?? "");

        // FIXED: Only append image if a new cropped file exists
        if (croppedFile) {
          formDetails.append("image", croppedFile);
        }

        const response = await updateUserDetailsApi(formDetails);
        if (response.status === 200) {
          await queryClient.invalidateQueries({
            queryKey: [USER_QUERY_KEYS.userDetails],
          });
          navigate("/profile");
        }
      } catch (error) {
        console.error("Updating failed:", error);
      }
    }
  };

  return (
    <>
      <Header
        title={t("profile.editProfile")}
        showBackButton
        redirectPath="/profile"
      />
      <BodyLayout>
        <div className="p-4 font-body rounded-2xl card-shadow">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Profile Image Section */}
            {Capacitor.getPlatform() !== 'ios' &&
              <div className="flex flex-col items-center justify-center my-4">
                <div className="relative">
                  {/* Avatar Display */}
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-gray-200 overflow-hidden shadow-sm bg-gray-50 flex items-center justify-center">
                    {formData.profileImage ? (
                      <img
                        src={formData.profileImage}
                        alt="Profile Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-gray-400" />
                    )}
                  </div>

                  {/* Mobile-Friendly Touch Target Camera Badge */}
                  <label
                    htmlFor="profile-image-upload"
                    className="absolute bottom-0 right-0 p-3 bg-primary text-white rounded-full shadow-md active:scale-95 transition-transform cursor-pointer flex items-center justify-center border-2 border-white touch-manipulation"
                    aria-label="Upload profile picture"
                  >
                    <Camera className="w-5 h-5" />
                    <input
                      id="profile-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                </div>

                <span className="text-xs font-body text-gray-500 mt-2.5 font-medium sm:hidden">
                  Tap camera icon to edit
                </span>
              </div>
            }

            <Input
              label={t("onboard.fullName")}
              name="fullName"
              icon={User}
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="e.g. John Doe"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DateInput
                label={t("onboard.dateOfBirth")}
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
              />
              <TimeInput
                label={t("onboard.timeofBirth")}
                name="tob"
                value={formData.tob}
                onChange={handleInputChange}
              />
            </div>

            <PlaceInput
              label={t("onboard.placeOfBirth")}
              value={formData.pob}
              onChange={handlePlaceChange}
            />

            <button
              type="submit"
              disabled={isFormIncomplete}
              className="w-full mt-6 font-body bg-primary text-white font-semibold py-2.5 px-4 rounded-lg transition outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("profile.saveChanges")}
            </button>
          </form>
        </div>
      </BodyLayout>

      {/* Image Crop Modal */}
      {isCroppingModalOpen && tempImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl relative flex flex-col">
            <button
              onClick={() => setIsCroppingModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Crop Profile Picture
            </h3>

            <div className="relative w-full h-64 bg-gray-900 rounded-xl overflow-hidden">
              <Cropper
                image={tempImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            {/* Zoom Slider */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">Zoom:</span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Modal Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsCroppingModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCropSave}
                className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90"
              >
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
