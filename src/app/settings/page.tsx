'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDarkMode } from '@/hooks/useDarkMode';
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
  ClockIcon,
  SunIcon,
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<string>('default');
  const { darkMode, setMode } = useDarkMode();

  const [settings, setSettings] = useState({
    showTransliteration: true,
    showArabic: true,
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
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
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
    children,
  }: {
    icon: React.ElementType;
    title: string;
    description: string;
    toggle?: boolean;
    onToggle?: () => void;
    children?: React.ReactNode;
  }) => (
    <div className="py-4 border-b border-zinc-200 dark:border-zinc-700 last:border-0">
      <div className="flex items-center justify-between">
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
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
              toggle ? 'bg-primary' : 'bg-zinc-300 dark:bg-zinc-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                toggle ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        )}
      </div>
      {children && <div className="mt-3 ml-14">{children}</div>}
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20 pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Settings</h1>
          <p className="text-zinc-600 dark:text-zinc-400">Manage your account preferences</p>
        </div>

        {/* Learning Preferences */}
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

        {/* Appearance */}
        <Card padding="lg" className="mb-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 flex items-center">
            {darkMode ? (
              <MoonIcon className="w-5 h-5 mr-2" />
            ) : (
              <SunIcon className="w-5 h-5 mr-2" />
            )}
            Appearance
          </h2>

          <SettingItem
            icon={darkMode ? MoonIcon : SunIcon}
            title="Dark Mode"
            description={darkMode ? 'Currently using dark theme' : 'Currently using light theme'}
            toggle={darkMode}
            onToggle={() => setMode(!darkMode)}
          />
        </Card>

        {/* Notifications */}
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
          >
            {settings.notifications && (
              <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                <ClockIcon className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                <span className="text-sm text-zinc-700 dark:text-zinc-300 flex-1">
                  Daily reminder at
                </span>
                <select
                  value={settings.reminderTime}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, reminderTime: e.target.value }))
                  }
                  className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="07:00">7:00 AM</option>
                  <option value="08:00">8:00 AM</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="18:00">6:00 PM</option>
                  <option value="20:00">8:00 PM</option>
                </select>
              </div>
            )}
          </SettingItem>

          {notificationPermission === 'denied' && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-sm text-red-600 dark:text-red-400">
                Notifications are blocked. Please enable them in your browser settings.
              </p>
            </div>
          )}
        </Card>

        {/* Account Info */}
        <Card padding="lg" className="mb-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Account</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 text-sm border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-500">Email</span>
              <span className="font-medium text-zinc-900 dark:text-white">{user?.email}</span>
            </div>
            <div className="flex justify-between py-2 text-sm border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-500">Member since</span>
              <span className="font-medium text-zinc-900 dark:text-white">
                {user?.metadata?.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })
                  : 'Unknown'}
              </span>
            </div>
            <div className="flex justify-between py-2 text-sm">
              <span className="text-zinc-500">Level</span>
              <span className="font-medium text-primary">Level {userProfile?.level || 1}</span>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card padding="lg">
          <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
          <Button
            variant="outline"
            className="w-full justify-start border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={handleSignOut}
            loading={loading}
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
            Sign Out
          </Button>
        </Card>
      </div>
    </div>
  );
}
