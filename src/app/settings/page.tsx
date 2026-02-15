'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
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
  ClockIcon,
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<string>('default');

  const [settings, setSettings] = useState({
    showTransliteration: true,
    showArabic: true,
    darkMode: false,
    notifications: true,
    reminderTime: '09:00',
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const handleToggle = (key: keyof typeof settings) => {
    if (key === 'notifications' && !settings.notifications) {
      requestNotificationPermission();
    }
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
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
    <div className="flex items-center justify-between py-4 border-b border-zinc-200 dark:border-zinc-700 last:border-0">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
          <Icon className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
        </div>
        <div>
          <h3 className="font-medium text-zinc-900 dark:text-white">{title}</h3>
          <p className="text-sm text-zinc-500">{description}</p>
        </div>
      </div>
      {toggle !== undefined && onToggle && (
        <button
          onClick={onToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            toggle ? 'bg-primary' : 'bg-zinc-300 dark:bg-zinc-600'
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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20 pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Manage your account preferences
          </p>
        </div>

        <Card padding="lg" className="mb-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 flex items-center">
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

        <Card padding="lg" className="mb-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 flex items-center">
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

          {settings.notifications && (
            <div className="py-4 border-b border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <ClockIcon className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-zinc-900 dark:text-white">Daily Reminder</h3>
                  <p className="text-sm text-zinc-500">Get reminded to practice every day</p>
                </div>
                <select
                  value={settings.reminderTime}
                  onChange={(e) => setSettings({ ...settings, reminderTime: e.target.value })}
                  className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                >
                  <option value="07:00">7:00 AM</option>
                  <option value="08:00">8:00 AM</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="18:00">6:00 PM</option>
                  <option value="20:00">8:00 PM</option>
                </select>
              </div>
            </div>
          )}

          {notificationPermission === 'denied' && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">
                Notifications are blocked. Please enable them in your browser settings.
              </p>
            </div>
          )}
        </Card>

        <Card padding="lg" className="mb-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 flex items-center">
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

        <Card padding="lg" className="mb-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
            Account
          </h2>
          
          <div className="space-y-2">
            <div className="py-3 text-sm text-zinc-600 dark:text-zinc-400">
              <span className="font-medium">Email:</span> {user?.email}
            </div>
            <div className="py-3 text-sm text-zinc-600 dark:text-zinc-400">
              <span className="font-medium">Member since:</span> {user?.metadata?.creationTime || 'Unknown'}
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <h2 className="text-lg font-semibold text-red-600 mb-4">
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
