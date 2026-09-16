import { useState } from 'react';
import type { FC } from 'react';
import { Settings, Bell, Shield } from 'lucide-react';
import { LogoutButton } from '@/features/auth/components/LogoutButton';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const CustomerSettingsPage: FC = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSavePreferences = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex items-center gap-2 pb-3 border-b border-[#DDDDDD]">
        <Settings className="w-5 h-5 text-[#FF385C]" />
        <h1 className="text-xl font-bold text-[#222222]">Account Settings & Preferences</h1>
      </div>

      {/* NOTIFICATION PREFERENCES */}
      <Card className="p-6 bg-white border border-[#DDDDDD] rounded-2xl flex flex-col gap-4 shadow-xs">
        <div className="flex items-center gap-2 text-sm font-bold text-[#222222]">
          <Bell className="w-4 h-4 text-[#FF385C]" />
          <span>Notification Preferences</span>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#222222]">Email Booking Confirmations</span>
              <span className="text-[11px] text-[#717171]">Receive instant PDF receipts and payment updates via email</span>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 rounded-xs text-[#FF385C] focus:ring-[#FF385C]"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-[#DDDDDD]">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#222222]">SMS Date Alerts</span>
              <span className="text-[11px] text-[#717171]">Receive SMS reminders before your upcoming wedding date</span>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="w-4 h-4 rounded-xs text-[#FF385C] focus:ring-[#FF385C]"
            />
          </label>
        </div>

        {savedSuccess && (
          <div className="text-xs text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
            Preferences saved successfully!
          </div>
        )}

        <div className="pt-2 border-t border-[#DDDDDD] flex justify-end">
          <Button size="sm" onClick={handleSavePreferences} className="text-xs font-bold">
            Save Preferences
          </Button>
        </div>
      </Card>

      {/* SECURITY & LOGOUT */}
      <Card className="p-6 bg-white border border-[#DDDDDD] rounded-2xl flex flex-col gap-4 shadow-xs">
        <div className="flex items-center gap-2 text-sm font-bold text-[#222222]">
          <Shield className="w-4 h-4 text-[#FF385C]" />
          <span>Security & Session Management</span>
        </div>

        <p className="text-xs text-[#717171] leading-relaxed">
          Log out of your MarriageHall.com session on this device. You will be prompted to enter your credentials next time you access private customer routes.
        </p>

        <div className="pt-2 border-t border-[#DDDDDD] flex justify-start">
          <LogoutButton variant="danger" size="sm" />
        </div>
      </Card>
    </div>
  );
};

