'use client';

import { AuthProvider } from '@/hooks/useAuth';
import Navbar from '@/components/layout/Navbar';
import { XPToastContainer } from '@/components/ui/XPToast';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Navbar />
      <main>{children}</main>
      <XPToastContainer />
    </AuthProvider>
  );
}
