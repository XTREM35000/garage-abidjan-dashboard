import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { useOrganisation } from '@/components/OrganisationProvider';

interface UnifiedLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  showNavbar?: boolean;
}

const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({
  children,
  showHeader = true,
  showFooter = true,
  showNavbar = true
}) => {
  const { isAuthenticated } = useAuth();
  const { currentOrg } = useOrganisation();

  // Ne pas afficher le header/footer sur les pages d'auth
  const isAuthPage = window.location.pathname.includes('/auth') ||
                     window.location.pathname.includes('/create-organisation') ||
                     window.location.pathname === '/';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {showHeader && isAuthenticated && <Header />}
      {showNavbar && isAuthenticated && <Navbar />}

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {showFooter && isAuthenticated && <Footer />}
    </div>
  );
};

export default UnifiedLayout;
