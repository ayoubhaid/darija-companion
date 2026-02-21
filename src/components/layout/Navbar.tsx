'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useDarkMode } from '@/hooks/useDarkMode';
import { logOut } from '@/lib/auth';
import Button from '@/components/ui/Button';
import { clsx } from 'clsx';
import {
  Bars3Icon,
  XMarkIcon,
  FireIcon,
  BookOpenIcon,
  AcademicCapIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  SparklesIcon,
  RocketLaunchIcon,
  MoonIcon,
  SunIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  MicrophoneIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Start Here', href: '/start-here', icon: RocketLaunchIcon },
  { name: 'Lessons', href: '/lessons', icon: BookOpenIcon },
  { name: 'Stories', href: '/stories', icon: BookOpenIcon },
  { name: 'Vocabulary', href: '/vocabulary', icon: AcademicCapIcon },
  { name: 'Practice', href: '/practice', icon: SparklesIcon },
  { name: 'Quizzes', href: '/quizzes', icon: FireIcon },
  { name: 'Phrasebook', href: '/phrasebook', icon: ChatBubbleLeftRightIcon },
  { name: 'Pronunciation', href: '/pronunciation', icon: MicrophoneIcon },
];

// Mobile bottom nav (most used tabs)
const mobileNavItems = [
  { name: 'Home', href: '/', icon: HomeIcon, exact: true },
  { name: 'Stories', href: '/stories', icon: BookOpenIcon },
  { name: 'Practice', href: '/practice', icon: SparklesIcon },
  { name: 'Quizzes', href: '/quizzes', icon: QuestionMarkCircleIcon },
  { name: 'Profile', href: '/profile', icon: UserIcon },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, userProfile } = useAuth();
  const { darkMode, toggle: toggleDark } = useDarkMode();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      await logOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <nav
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-200/60 dark:border-zinc-800/60 shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2.5 group">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-md group-hover:shadow-glow-sm transition-shadow duration-300">
                  <span className="text-white font-bold text-xl">د</span>
                </div>
                <span className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-primary transition-colors">
                  Darija
                </span>
              </Link>

              {user && (
                <div className="hidden md:flex ml-10 space-x-1">
                  {navigation.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={clsx(
                          'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                          isActive
                            ? 'bg-primary/10 text-primary dark:bg-primary/20'
                            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white'
                        )}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-2">
              {/* Dark mode toggle */}
              <button
                onClick={toggleDark}
                className="p-2 rounded-xl text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? (
                  <SunIcon className="w-5 h-5" />
                ) : (
                  <MoonIcon className="w-5 h-5" />
                )}
              </button>

              {user ? (
                <>
                  <div className="hidden md:flex items-center space-x-3">
                    {/* XP + Streak display */}
                    <div className="flex items-center space-x-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800/60 rounded-full">
                      {(userProfile?.streak || 0) > 0 && (
                        <>
                          <FireIcon className="w-4 h-4 text-orange-500" />
                          <span className="text-sm font-medium text-orange-500">
                            {userProfile?.streak}
                          </span>
                          <span className="text-zinc-300 dark:text-zinc-600">•</span>
                        </>
                      )}
                      <span className="text-sm font-semibold text-primary">
                        {userProfile?.xp || 0} XP
                      </span>
                      <span className="text-zinc-300 dark:text-zinc-600">•</span>
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">
                        Lv {userProfile?.level || 1}
                      </span>
                    </div>

                    {/* User avatar & dropdown */}
                    <div className="relative" ref={userMenuRef}>
                      <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt={user.displayName || 'User'}
                            className="w-8 h-8 rounded-full ring-2 ring-primary/20"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
                            <span className="text-white font-medium text-sm">
                              {(user.displayName || user.email || 'U')[0].toUpperCase()}
                            </span>
                          </div>
                        )}
                      </button>

                      {userMenuOpen && (
                        <div className="absolute right-0 mt-2 w-56 py-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-lg rounded-2xl shadow-xl border border-zinc-200/60 dark:border-zinc-800/60 animate-fade-in-down z-50">
                          <div className="px-4 py-3 border-b border-zinc-200/60 dark:border-zinc-800/60">
                            <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                              {user.displayName || 'User'}
                            </p>
                            <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                          </div>
                          <div className="py-1.5">
                            <Link
                              href="/profile"
                              className="flex items-center px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                              <UserIcon className="w-4 h-4 mr-3 text-zinc-400" />
                              Profile
                            </Link>
                            <Link
                              href="/settings"
                              className="flex items-center px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                              <Cog6ToothIcon className="w-4 h-4 mr-3 text-zinc-400" />
                              Settings
                            </Link>
                            {userProfile?.isAdmin && (
                              <Link
                                href="/admin"
                                className="flex items-center px-4 py-2.5 text-sm text-primary hover:bg-primary/5 transition-colors"
                              >
                                <Cog6ToothIcon className="w-4 h-4 mr-3" />
                                Admin Panel
                              </Link>
                            )}
                          </div>
                          <div className="border-t border-zinc-200/60 dark:border-zinc-800/60 py-1.5">
                            <button
                              onClick={handleSignOut}
                              className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                              <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                              Sign out
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mobile hamburger */}
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 rounded-xl text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    {mobileMenuOpen ? (
                      <XMarkIcon className="w-6 h-6" />
                    ) : (
                      <Bars3Icon className="w-6 h-6" />
                    )}
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="glow" size="sm">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile top dropdown menu */}
        {mobileMenuOpen && user && (
          <div className="md:hidden border-t border-zinc-200/60 dark:border-zinc-800/60 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-lg">
            {/* User info strip */}
            <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-zinc-900 dark:text-white text-sm truncate">
                  {user.displayName || 'Learner'}
                </p>
                <p className="text-xs text-zinc-500 truncate">{user.email}</p>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                {(userProfile?.streak || 0) > 0 && (
                  <>
                    <FireIcon className="w-3.5 h-3.5 text-orange-500" />
                    <span className="text-xs font-medium text-orange-500">
                      {userProfile?.streak}
                    </span>
                    <span className="text-zinc-300 text-xs">·</span>
                  </>
                )}
                <span className="text-xs font-semibold text-primary">{userProfile?.xp || 0} XP</span>
              </div>
            </div>

            <div className="px-4 py-3 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      'flex items-center px-4 py-3 rounded-xl text-base font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
                    )}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <div className="px-4 py-3 border-t border-zinc-100 dark:border-zinc-800 space-y-1">
              <Link
                href="/profile"
                className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
              >
                <UserIcon className="w-5 h-5 mr-3" />
                Profile
              </Link>
              <Link
                href="/settings"
                className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
              >
                <Cog6ToothIcon className="w-5 h-5 mr-3" />
                Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                Sign out
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      {user && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-200/60 dark:border-zinc-800/60 safe-area-pb">
          <div className="flex items-center justify-around px-2 py-2">
            {mobileNavItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-0',
                    isActive
                      ? 'text-primary'
                      : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                  )}
                >
                  <item.icon
                    className={clsx(
                      'w-6 h-6 transition-all duration-200',
                      isActive && 'scale-110'
                    )}
                  />
                  <span
                    className={clsx(
                      'text-[10px] font-medium truncate transition-all duration-200',
                      isActive ? 'text-primary font-semibold' : 'text-zinc-400 dark:text-zinc-500'
                    )}
                  >
                    {item.name}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}
