import React, { useState, useEffect } from "react";

const defaultAvatars = [
  "https://i.pravatar.cc/150?img=1",
  "https://i.pravatar.cc/150?img=2",
  "https://i.pravatar.cc/150?img=3",
  "https://i.pravatar.cc/150?img=4",
];

const Profile = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setEmail(user.email || "");
      setName(user.name || "");
      setAvatar(user.avatar || defaultAvatars[0]);
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.length > 50) {
      newErrors.name = "Name must be 50 characters or less";
    }
    if (!avatar) {
      newErrors.avatar = "Please select or upload an avatar";
    }
    return newErrors;
  };

  const handleSave = async () => {
    setErrors({});
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const updatedUser = { email, name, avatar };
      // Simulate API call
      setTimeout(() => {
        localStorage.setItem("user", JSON.stringify(updatedUser));
        alert("Profile updated!");
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      setErrors({ general: "Failed to update profile. Please try again." });
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors({ avatar: "Please upload a valid image file" });
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ avatar: "Image size must be less than 2MB" });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => setAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="relative bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700 transform transition-all hover:scale-[1.01]">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-purple-600 rounded-t-2xl"></div>
        <div className="absolute -top-2 -right-2 w-16 h-16 bg-red-600 rounded-full blur-xl opacity-20"></div>
        <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-purple-600 rounded-full blur-xl opacity-20"></div>

        <div className="flex justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>

        <h2 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-red-400 to-purple-500 bg-clip-text text-transparent">
          Edit Your Profile
        </h2>
        <p className="text-gray-400 text-center mb-8">Update your personal details</p>

        <div className="space-y-6">
          {errors.general && (
            <p className="text-red-400 text-sm text-center">{errors.general}</p>
          )}

          {/* Avatar Preview */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src={avatar || defaultAvatars[0]}
                alt="Profile avatar"
                className="w-24 h-24 rounded-full border-2 border-gray-600 object-cover"
              />
              {errors.avatar && (
                <p className="text-red-400 text-sm mt-2 text-center">{errors.avatar}</p>
              )}
            </div>
          </div>

          {/* Avatar Upload and Default Avatars */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Profile Picture
            </label>
            <div className="flex items-center space-x-4 mb-4">
              <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white text-sm py-2 px-4 rounded-lg transition-all">
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  aria-describedby={errors.avatar ? "avatar-error" : undefined}
                />
              </label>
              <p className="text-sm text-gray-400">or choose a default avatar:</p>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {defaultAvatars.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt="Default avatar"
                  onClick={() => setAvatar(src)}
                  className={`w-16 h-16 rounded-full cursor-pointer border-2 transition-all ${
                    avatar === src ? "border-red-500" : "border-transparent hover:border-red-500/50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-3 rounded-lg bg-gray-700 border ${
                errors.name ? "border-red-500" : "border-gray-600"
              } focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all outline-none`}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="text-red-400 text-sm mt-1">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Input (Disabled) */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              disabled
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 opacity-60 cursor-not-allowed"
              aria-disabled="true"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
              isLoading
                ? "bg-red-700 cursor-not-allowed"
                : "bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 shadow-lg hover:shadow-red-500/20"
            }`}
          >
            {isLoading ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Saving...
              </div>
            ) : (
              "Save Profile"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;