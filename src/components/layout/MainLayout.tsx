import type { FC } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { CategoryNav } from './CategoryNav';
import { Footer } from './Footer';
import { MobileBottomNav } from './MobileBottomNav';
import { ToastContainer } from '../ui/Toast';

export const MainLayout: FC = () => {
  const location = useLocation();
  const showCategoryNav = location.pathname === '/' || location.pathname === '/halls';
  const isAuthPage =
    location.pathname.startsWith('/auth') ||
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgot-password';

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#222222] font-sans antialiased pb-16 lg:pb-0">
      <Header />
      {showCategoryNav ? <CategoryNav /> : null}
      <main
        className={
          isAuthPage
            ? 'flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4 flex flex-col justify-center'
            : 'flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'
        }
      >
        <Outlet />
      </main>
      {!isAuthPage && <Footer />}
      <MobileBottomNav />
      <ToastContainer />
    </div>
  );
};
