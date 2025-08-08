import React from 'react';
import { Outlet } from 'react-router-dom';
import UnifiedHeader from '@/components/UnifiedHeader';
import UnifiedFooter from '@/components/UnifiedFooter';
import PageNavigation from '@/components/PageNavigation';

interface UnifiedLayoutProps {
  children?: React.ReactNode;
}

const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-500">
      <UnifiedHeader showUserMenu={true} showThemeToggle={true} />
      <PageNavigation />
      <main className="flex-1 flex flex-col w-full px-2 md:px-4 py-8 animate-fade-in">
        {children || <Outlet />}
      </main>
      <UnifiedFooter />
    </div>
  );
};

export default UnifiedLayout;
