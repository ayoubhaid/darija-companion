'use client';

import { AuthProvider } from '@/hooks/useAuth';
import Navbar from '@/components/layout/Navbar';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Navbar />
      <main>{children}</main>
    </AuthProvider>
  );
}
