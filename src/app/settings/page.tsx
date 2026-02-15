'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { logOut } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { 
  Cog6ToothIcon,
  BellIcon,
  MoonIcon,
  EyeIcon,
  ArrowRightOnRectangleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    showTransliteration: userProfile?.preferences?.showTransliteration ?? true,
    showArabic: userProfile?.preferences?.showArabic ?? true,
    darkMode: userProfile?.preferences?.darkMode ?? false,
    notifications: userProfile?.preferences?.notifications ?? true,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await logOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const SettingItem = ({
    icon: Icon,
    title,
    description,
    toggle,
    onToggle,
  }: {
    icon: React.ElementType;
    title: string;
    description: string;
    toggle?: boolean;
    onToggle?: () => void;
  }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-slate-700 last:border-0">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
          <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
      {toggle && onToggle && (
        <button
          onClick={onToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            toggle ? 'bg-primary-500' : 'bg-gray-300 dark:bg-slate-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              toggle ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account preferences
          </p>
        </div>

        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Cog6ToothIcon className="w-5 h-5 mr-2" />
            Learning Preferences
          </h2>
          
          <SettingItem
            icon={EyeIcon}
            title="Show Transliteration"
            description="Display phonetic spelling for Arabic words"
            toggle={settings.showTransliteration}
            onToggle={() => handleToggle('showTransliteration')}
          />
          
          <SettingItem
            icon={EyeIcon}
            title="Show Arabic Script"
            description="Display Arabic script alongside transliteration"
            toggle={settings.showArabic}
            onToggle={() => handleToggle('showArabic')}
          />
        </Card>

        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <BellIcon className="w-5 h-5 mr-2" />
            Notifications
          </h2>
          
          <SettingItem
            icon={BellIcon}
            title="Push Notifications"
            description="Receive reminders and learning updates"
            toggle={settings.notifications}
            onToggle={() => handleToggle('notifications')}
          />
        </Card>

        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <MoonIcon className="w-5 h-5 mr-2" />
            Appearance
          </h2>
          
          <SettingItem
            icon={MoonIcon}
            title="Dark Mode"
            description="Use dark theme for the app"
            toggle={settings.darkMode}
            onToggle={() => handleToggle('darkMode')}
          />
        </Card>

        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Account
          </h2>
          
          <div className="space-y-2">
            <div className="py-3 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Email:</span> {user?.email}
            </div>
            <div className="py-3 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Member since:</span> {user?.metadata?.creationTime || 'Unknown'}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-red-600">
            Danger Zone
          </h2>
          
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start border-red-300 text-red-600 hover:bg-red-50"
              onClick={handleSignOut}
              loading={loading}
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
              Sign Out
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
