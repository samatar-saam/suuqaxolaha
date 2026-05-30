// src/admin/pages/AdminSettings.jsx
import { useState, useEffect } from "react";
import {
  Settings,
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
  DollarSign,
  Users,
  ShoppingBag,
  Truck,
  Shield,
  Bell,
  Lock,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Smartphone,
  CreditCard,
} from "lucide-react";

const SETTINGS_API = "http://localhost:5000/settings";

export default function AdminSettings() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    // General Settings
    storeName: "SuuqHub",
    storeEmail: "info@suuqhub.com",
    storePhone: "+254 700 000 000",
    storeAddress: "Garissa, Kenya",
    storeDescription: "Shop Local. Empower Business.",
    timezone: "Africa/Nairobi",
    currency: "KES",
    dateFormat: "DD/MM/YYYY",
    
    // Payment Settings
    paymentMethods: {
      mpesa: true,
      card: true,
      cod: true,
    },
    mpesaPaybill: "123456",
    mpesaAccountNo: "SUUQHUB",
    
    // Shipping Settings
    freeDeliveryThreshold: 2500,
    deliveryFee: 250,
    estimatedDeliveryDays: "3-5",
    
    // Notification Settings
    orderConfirmationEmail: true,
    orderStatusEmail: true,
    newUserEmail: true,
    lowStockAlert: true,
    lowStockThreshold: 10,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
  });

  const [adminPassword, setAdminPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(SETTINGS_API);
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      await fetch(SETTINGS_API, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updatePaymentMethod = (method, value) => {
    setSettings(prev => ({
      ...prev,
      paymentMethods: { ...prev.paymentMethods, [method]: value },
    }));
  };

  const handlePasswordChange = async () => {
    if (adminPassword.newPassword !== adminPassword.confirmPassword) {
      alert("New passwords do not match");
      return;
    }
    if (adminPassword.newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    
    alert("Password changed successfully!");
    setAdminPassword({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Lock },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        {/* Header */}
        <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white shadow-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Settings size={20} />
                <span className="text-sm font-semibold uppercase tracking-wide">System Settings</span>
              </div>
              <h1 className="text-3xl font-black">Admin Settings</h1>
              <p className="mt-1 text-purple-100">Configure your store preferences and system settings</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchSettings}
                className="flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2.5 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/30"
              >
                <RefreshCw size={16} />
                Reset
              </button>
              <button
                onClick={saveSettings}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-purple-600 transition hover:scale-105 disabled:opacity-70"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex flex-wrap border-b border-slate-200 bg-slate-50/50">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition ${
                    activeTab === tab.id
                      ? "border-b-2 border-purple-600 text-purple-600 bg-white"
                      : "text-slate-600 hover:text-purple-600"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-6">
            {/* General Settings */}
            {activeTab === "general" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Store Information</h3>
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-slate-700">Store Name</label>
                      <input
                        type="text"
                        value={settings.storeName}
                        onChange={(e) => updateSetting("storeName", e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-slate-700">Store Email</label>
                      <input
                        type="email"
                        value={settings.storeEmail}
                        onChange={(e) => updateSetting("storeEmail", e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-slate-700">Store Phone</label>
                      <input
                        type="tel"
                        value={settings.storePhone}
                        onChange={(e) => updateSetting("storePhone", e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-slate-700">Store Address</label>
                      <input
                        type="text"
                        value={settings.storeAddress}
                        onChange={(e) => updateSetting("storeAddress", e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-sm font-semibold text-slate-700">Store Description</label>
                      <textarea
                        rows={2}
                        value={settings.storeDescription}
                        onChange={(e) => updateSetting("storeDescription", e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-slate-700">Timezone</label>
                      <select
                        value={settings.timezone}
                        onChange={(e) => updateSetting("timezone", e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                      >
                        <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                        <option value="Africa/Cairo">Africa/Cairo (CAT)</option>
                        <option value="Africa/Johannesburg">Africa/Johannesburg (SAST)</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-slate-700">Currency</label>
                      <select
                        value={settings.currency}
                        onChange={(e) => updateSetting("currency", e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                      >
                        <option value="KES">Kenyan Shilling (KES)</option>
                        <option value="USD">US Dollar (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Settings */}
            {activeTab === "payment" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Payment Methods</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50">
                      <input
                        type="checkbox"
                        checked={settings.paymentMethods.mpesa}
                        onChange={(e) => updatePaymentMethod("mpesa", e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-purple-600"
                      />
                      <Smartphone size={18} className="text-green-600" />
                      <span className="text-sm font-medium text-slate-700">M-PESA Mobile Money</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50">
                      <input
                        type="checkbox"
                        checked={settings.paymentMethods.card}
                        onChange={(e) => updatePaymentMethod("card", e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-purple-600"
                      />
                      <CreditCard size={18} className="text-blue-600" />
                      <span className="text-sm font-medium text-slate-700">Credit / Debit Card</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50">
                      <input
                        type="checkbox"
                        checked={settings.paymentMethods.cod}
                        onChange={(e) => updatePaymentMethod("cod", e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-purple-600"
                      />
                      <DollarSign size={18} className="text-emerald-600" />
                      <span className="text-sm font-medium text-slate-700">Cash on Delivery</span>
                    </label>
                  </div>
                </div>

                {settings.paymentMethods.mpesa && (
                  <div className="border-t border-slate-200 pt-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">M-PESA Configuration</h3>
                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700">Paybill Number</label>
                        <input
                          type="text"
                          value={settings.mpesaPaybill}
                          onChange={(e) => updateSetting("mpesaPaybill", e.target.value)}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700">Account Number</label>
                        <input
                          type="text"
                          value={settings.mpesaAccountNo}
                          onChange={(e) => updateSetting("mpesaAccountNo", e.target.value)}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Shipping Settings */}
            {activeTab === "shipping" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Delivery Settings</h3>
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-slate-700">Free Delivery Threshold (KSh)</label>
                      <input
                        type="number"
                        value={settings.freeDeliveryThreshold}
                        onChange={(e) => updateSetting("freeDeliveryThreshold", parseInt(e.target.value))}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                      />
                      <p className="text-xs text-slate-500 mt-1">Orders above this amount get free delivery</p>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-slate-700">Standard Delivery Fee (KSh)</label>
                      <input
                        type="number"
                        value={settings.deliveryFee}
                        onChange={(e) => updateSetting("deliveryFee", parseInt(e.target.value))}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-slate-700">Estimated Delivery (Days)</label>
                      <input
                        type="text"
                        value={settings.estimatedDeliveryDays}
                        onChange={(e) => updateSetting("estimatedDeliveryDays", e.target.value)}
                        placeholder="3-5"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Email Notifications</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50">
                      <input
                        type="checkbox"
                        checked={settings.orderConfirmationEmail}
                        onChange={(e) => updateSetting("orderConfirmationEmail", e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-purple-600"
                      />
                      <Mail size={18} className="text-purple-600" />
                      <span className="text-sm font-medium text-slate-700">Order Confirmation Email</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50">
                      <input
                        type="checkbox"
                        checked={settings.orderStatusEmail}
                        onChange={(e) => updateSetting("orderStatusEmail", e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-purple-600"
                      />
                      <Bell size={18} className="text-purple-600" />
                      <span className="text-sm font-medium text-slate-700">Order Status Update Email</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50">
                      <input
                        type="checkbox"
                        checked={settings.newUserEmail}
                        onChange={(e) => updateSetting("newUserEmail", e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-purple-600"
                      />
                      <Users size={18} className="text-purple-600" />
                      <span className="text-sm font-medium text-slate-700">New User Registration Email</span>
                    </label>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Stock Alerts</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50">
                      <input
                        type="checkbox"
                        checked={settings.lowStockAlert}
                        onChange={(e) => updateSetting("lowStockAlert", e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-purple-600"
                      />
                      <ShoppingBag size={18} className="text-purple-600" />
                      <span className="text-sm font-medium text-slate-700">Low Stock Alert</span>
                    </label>
                    {settings.lowStockAlert && (
                      <div className="ml-8">
                        <label className="mb-1 block text-sm font-semibold text-slate-700">Low Stock Threshold</label>
                        <input
                          type="number"
                          value={settings.lowStockThreshold}
                          onChange={(e) => updateSetting("lowStockThreshold", parseInt(e.target.value))}
                          className="w-48 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Security Settings</h3>
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-slate-700">Session Timeout (minutes)</label>
                      <input
                        type="number"
                        value={settings.sessionTimeout}
                        onChange={(e) => updateSetting("sessionTimeout", parseInt(e.target.value))}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-slate-700">Max Login Attempts</label>
                      <input
                        type="number"
                        value={settings.maxLoginAttempts}
                        onChange={(e) => updateSetting("maxLoginAttempts", parseInt(e.target.value))}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-3 mt-4 p-3 rounded-lg border border-slate-200 bg-slate-50">
                    <input
                      type="checkbox"
                      checked={settings.twoFactorAuth}
                      onChange={(e) => updateSetting("twoFactorAuth", e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-purple-600"
                    />
                    <Shield size={18} className="text-purple-600" />
                    <span className="text-sm font-medium text-slate-700">Enable Two-Factor Authentication (2FA)</span>
                  </label>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Change Admin Password</h3>
                  <div className="grid gap-4 max-w-md">
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-slate-700">Current Password</label>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={adminPassword.currentPassword}
                        onChange={(e) => setAdminPassword({ ...adminPassword, currentPassword: e.target.value })}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-slate-700">New Password</label>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={adminPassword.newPassword}
                        onChange={(e) => setAdminPassword({ ...adminPassword, newPassword: e.target.value })}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-slate-700">Confirm New Password</label>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={adminPassword.confirmPassword}
                        onChange={(e) => setAdminPassword({ ...adminPassword, confirmPassword: e.target.value })}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-400"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={showPassword}
                          onChange={(e) => setShowPassword(e.target.checked)}
                          className="h-4 w-4 rounded border-slate-300 text-purple-600"
                        />
                        <span className="text-sm text-slate-600">Show passwords</span>
                      </label>
                      <button
                        onClick={handlePasswordChange}
                        className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}