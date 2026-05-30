// src/users/pages/UserProfile.jsx
import { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  Lock,
  CheckCircle,
  AlertCircle,
  Upload,
} from "lucide-react";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Kenya",
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setFormData({
          firstName: parsedUser.firstName || "",
          lastName: parsedUser.lastName || "",
          email: parsedUser.email || "",
          phone: parsedUser.phone || "",
          address: parsedUser.address || "",
          city: parsedUser.city || "",
          postalCode: parsedUser.postalCode || "",
          country: parsedUser.country || "Kenya",
        });
        
        // Load profile image from localStorage
        const savedImage = localStorage.getItem(`profile_image_${parsedUser.id}`);
        if (savedImage) {
          setProfileImage(savedImage);
        }
      } catch (e) {
        console.error("Failed to parse user data:", e);
      }
    }
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
    setPasswordError("");
    setPasswordSuccess("");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size should be less than 2MB");
        return;
      }
      
      // Check file type
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setProfileImage(imageData);
        // Save to localStorage with user-specific key
        if (user?.id) {
          localStorage.setItem(`profile_image_${user.id}`, imageData);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfileImage = () => {
    if (confirm("Remove your profile picture?")) {
      setProfileImage(null);
      if (user?.id) {
        localStorage.removeItem(`profile_image_${user.id}`);
      }
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  const updatePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordData.newPassword }),
      });

      if (response.ok) {
        setPasswordSuccess("Password updated successfully!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordSuccess("");
        }, 2000);
      } else {
        setPasswordError("Failed to update password");
      }
    } catch (error) {
      console.error("Password update error:", error);
      setPasswordError("Failed to update password. Please try again.");
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const response = await fetch(`http://localhost:5000/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          updatedAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      city: user?.city || "",
      postalCode: user?.postalCode || "",
      country: user?.country || "Kenya",
    });
    setIsEditing(false);
  };

  const getInitials = () => {
    const first = formData.firstName?.charAt(0) || "";
    const last = formData.lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "U";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-xl">
              <User size={24} className="text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
              <p className="text-sm text-slate-500 mt-1">
                Manage your personal information and account settings
              </p>
            </div>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition"
            >
              <Edit size={16} />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={cancelEdit}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                onClick={saveProfile}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition disabled:opacity-70"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Avatar & Info */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24">
            <div className="text-center">
              <div className="relative inline-block group">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover mx-auto shadow-lg border-4 border-purple-100"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto shadow-lg">
                    <span className="text-4xl font-black text-white">{getInitials()}</span>
                  </div>
                )}
                <button
                  onClick={triggerFileUpload}
                  className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-slate-200 hover:bg-purple-50 transition group-hover:scale-110"
                >
                  <Camera size={16} className="text-purple-600" />
                </button>
                {profileImage && (
                  <button
                    onClick={removeProfileImage}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full shadow-md hover:bg-red-600 transition"
                    title="Remove picture"
                  >
                    <X size={12} className="text-white" />
                  </button>
                )}
              </div>
              <h2 className="mt-4 text-xl font-bold text-slate-900">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-sm text-purple-600">{user?.role === "admin" ? "Administrator" : "Customer"}</p>
              <p className="text-xs text-slate-500 mt-1">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-600 transition"
              >
                <Lock size={16} />
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Personal Information</h3>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400 ${
                    !isEditing ? "bg-slate-50 text-slate-500" : "bg-white"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400 ${
                    !isEditing ? "bg-slate-50 text-slate-500" : "bg-white"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400 ${
                    !isEditing ? "bg-slate-50 text-slate-500" : "bg-white"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400 ${
                    !isEditing ? "bg-slate-50 text-slate-500" : "bg-white"
                  }`}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Street address"
                  className={`w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400 ${
                    !isEditing ? "bg-slate-50 text-slate-500" : "bg-white"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400 ${
                    !isEditing ? "bg-slate-50 text-slate-500" : "bg-white"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400 ${
                    !isEditing ? "bg-slate-50 text-slate-500" : "bg-white"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400 ${
                    !isEditing ? "bg-slate-50 text-slate-500" : "bg-white"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Account Stats */}
          <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Account Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-slate-50 rounded-xl">
                <p className="text-2xl font-bold text-purple-600">0</p>
                <p className="text-xs text-slate-500">Total Orders</p>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-xl">
                <p className="text-2xl font-bold text-purple-600">0</p>
                <p className="text-xs text-slate-500">Wishlist Items</p>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-xl">
                <p className="text-2xl font-bold text-purple-600">0</p>
                <p className="text-xs text-slate-500">Reviews Written</p>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-xl">
                <p className="text-2xl font-bold text-purple-600">0</p>
                <p className="text-xs text-slate-500">Pending Returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowPasswordModal(false)}>
          <div className="relative max-w-md w-full bg-white rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowPasswordModal(false)}
              className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-lg hover:bg-slate-100 transition"
            >
              <X size={20} />
            </button>

            <div className="p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock size={28} className="text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Change Password</h3>
                <p className="text-sm text-slate-500 mt-1">Enter your new password below</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                  />
                </div>

                {passwordError && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                    <AlertCircle size={16} />
                    {passwordError}
                  </div>
                )}

                {passwordSuccess && (
                  <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-600">
                    <CheckCircle size={16} />
                    {passwordSuccess}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={updatePassword}
                    className="flex-1 rounded-lg bg-purple-600 py-2 text-sm font-semibold text-white hover:bg-purple-700"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}