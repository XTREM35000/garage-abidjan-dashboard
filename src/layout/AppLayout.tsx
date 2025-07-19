import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UserMenu from '../components/UserMenu';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-500">
      <header className="relative w-full">
        <Header />
        <div className="absolute top-0 right-0 h-full flex items-center pr-4">
          <UserMenu />
        </div>
      </header>
      <main className="flex-1 flex flex-col w-full px-2 md:px-4 py-8 animate-fade-in">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
