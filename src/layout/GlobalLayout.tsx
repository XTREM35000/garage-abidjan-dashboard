import React from 'react';
import { useLocation } from 'react-router-dom';
import UnifiedHeader from '@/components/UnifiedHeader';
import UnifiedFooter from '@/components/UnifiedFooter';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';

interface GlobalLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

const GlobalLayout: React.FC<GlobalLayoutProps> = ({
  children,
  showHeader = true,
  showFooter = true
}) => {
  const location = useLocation();
  const { isAuthenticated } = useSimpleAuth();

  // Pages qui ne doivent pas avoir le header/footer
  const excludedPages = [
    '/',
    '/auth',
    '/connexion',
    '/organisation-onboarding',
    '/organisation-selector',
    '/create-organisation'
  ];

  // Pages qui ne doivent pas avoir le header (comme les modals plein écran)
  const headerExcludedPages = [
    '/',
    '/auth',
    '/connexion'
  ];

  // Pages qui ne doivent pas avoir le footer
  const footerExcludedPages = [
    '/',
    '/auth',
    '/connexion',
    '/organisation-onboarding'
  ];

  const shouldShowHeader = showHeader &&
    !headerExcludedPages.includes(location.pathname) &&
    isAuthenticated;

  const shouldShowFooter = showFooter &&
    !footerExcludedPages.includes(location.pathname);

    return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 flex flex-col">
            {/* Header Global */}
      {shouldShowHeader && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <UnifiedHeader
            showUserMenu={true}
            showThemeToggle={true}
          />
        </div>
      )}

      {/* Contenu Principal */}
      <main className={`flex-1 ${shouldShowHeader ? 'pt-16' : ''} ${shouldShowFooter ? 'pb-20' : ''}`}>
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="min-h-[calc(100vh-8rem)]">
            {children}
          </div>
        </div>
      </main>

      {/* Footer Global */}
      {shouldShowFooter && (
        <div className="fixed bottom-0 left-0 right-0 z-40">
          <UnifiedFooter />
        </div>
      )}
    </div>
  );
};

export default GlobalLayout;
