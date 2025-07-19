import React from 'react';
import Navbar from './Navbar';
import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-500">
      {/* Header/Navbar horizontal en haut */}
      <Navbar />
      {/* Body occupe presque toute la largeur, padding latéral réduit */}
      <main className="flex-1 flex flex-col items-center justify-center w-full px-2 md:px-4 py-8 animate-fade-in">
        <div className="w-full">{children}</div>
      </main>
      {/* Footer en bas */}
      <Footer />
    </div>
  );
};

export default MainLayout;
