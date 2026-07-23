import DateInput from "@/components/common/DateInput";
import Input from "@/components/common/Input";
import PlaceInput from "@/components/common/PlaceInput";
import RadioGroup from "@/components/common/RadioGroup";
import TimeInput from "@/components/common/TimeInput";
import BodyLayout from "@/components/layout/BodyLayout";
import Header from "@/components/layout/Header";
import { useGetUserDetailsQuery } from "@/queries/userQueries";
import { getCroppedImg } from "@/utils/cropImage";
import { Camera, User, X } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { RELATIONSHIP_OPTIONS, type FormState } from "../auth/BirthDetailsForm";

const EditProfile = () => {
  const { data: userDetails } = useGetUserDetailsQuery();

  const [formData, setFormData] = useState<FormState>({
    fullName: userDetails?.name ?? "",
    dob: userDetails?.date_of_birth ?? "",
    tob: userDetails?.birth_time ?? "",
    pob: userDetails?.birth_place ?? "",
    lat: userDetails?.latitude ?? "",
    lon: userDetails?.longitude ?? "",
    gender: userDetails?.gender ?? "",
    relationshipStatus: userDetails?.marital_status ?? "",
    profileImage: userDetails?.image_url ?? "",
    phone: userDetails?.phone ?? "",
  });

  // Image Cropper States
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCroppingModalOpen, setIsCroppingModalOpen] = useState(false);

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

  // 3. Confirm crop and save base64 image into formData
  const handleCropSave = async () => {
    if (tempImage && croppedAreaPixels) {
      try {
        const croppedImageBase64 = await getCroppedImg(
          tempImage,
          croppedAreaPixels,
        );
        updateField("profileImage", croppedImageBase64);
        setIsCroppingModalOpen(false);
        setTempImage(null);
      } catch (error) {
        console.error("Error cropping image:", error);
      }
    }
  };

  // Extract profileImage away from the rest of the fields
  const { profileImage, ...requiredFields } = formData;

  // Only check if required text fields are empty
  const isFormIncomplete = Object.values(requiredFields).some(
    (val) => !val.trim(),
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isFormIncomplete) {
      const formDeatils = new FormData();

      formDeatils.append("name", formData.fullName);
      formDeatils.append("gender", formData.gender);
      formDeatils.append("marital_status", formData.relationshipStatus ?? "");
      formDeatils.append("date_of_birth", formData.dob ?? "");
      formDeatils.append("birth_time", formData.tob ?? "");
      formDeatils.append("birth_place", formData.pob ?? "");
      formDeatils.append("latitude", formData.lat ?? "");
      formDeatils.append("longitude", formData.lon ?? "");
      formDeatils.append("role", "customer");
      formDeatils.append("phone", formData.phone ?? "");
      formDeatils.append("onboarding_completed", "1");
      // formDeatils.append("current_location", currentPlace?.city ?? "");
      formDeatils.append("profile_image", "");

      // const response = await RegistrationApi(formDeatils);
      // if (response?.status === 200) {
      //   navigate("/home");
      // }
    }
  };

  return (
    <>
      <Header
        title="Edit Profile"
        subtitle="Find your perfect Astrologer"
        showBackButton
      />
      <BodyLayout>
        <div className="p-4 rounded-2xl border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Profile Image Section */}
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

              <span className="text-xs text-gray-500 mt-2.5 font-medium sm:hidden">
                Tap camera icon to edit
              </span>
            </div>

            <Input
              label="Full Name"
              name="fullName"
              icon={User}
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="e.g. John Doe"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <PlaceInput
              label="Place of Birth"
              value={formData.pob}
              onChange={handlePlaceChange}
            />

            <RadioGroup
              label="Relationship Status"
              options={RELATIONSHIP_OPTIONS}
              selectedValue={formData.relationshipStatus}
              onChange={(val) => updateField("relationshipStatus", val)}
            />

            <button
              type="submit"
              disabled={isFormIncomplete}
              className="w-full mt-6 bg-primary text-white font-semibold py-2.5 px-4 rounded-lg transition outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit
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

            {/* Cropper Container - Needs relative position & specific height */}
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
