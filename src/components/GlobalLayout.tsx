import React from 'react';
import { Outlet } from 'react-router-dom';
import AnimatedHeader from './AnimatedHeader';
import Navbar from './Navbar';
import UserMenu from './UserMenu';
import InteractiveFooter from './InteractiveFooter';

const GlobalLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-accent/5 text-foreground transition-all duration-700">
      {/* Header animé persistant */}
      <AnimatedHeader />
      
      {/* Navigation horizontale avec UserMenu intégré */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border/50 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Navbar />
            <UserMenu />
          </div>
        </div>
      </div>

      {/* Zone de contenu principal */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <Outlet />
      </main>

      {/* Footer interactif */}
      <InteractiveFooter />
    </div>
  );
};

export default GlobalLayout;