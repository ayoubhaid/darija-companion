import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';
import Navbar from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'Darija Companion - Learn Moroccan Arabic',
  description: 'A comprehensive Moroccan Darija learning app with interactive lessons, vocabulary flashcards, and quizzes.',
  keywords: ['Darija', 'Moroccan Arabic', 'Learn Arabic', 'Language Learning'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
