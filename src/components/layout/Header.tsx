import type { FC } from 'react';
import { DesktopNavbar } from './DesktopNavbar';
import { MobileNavbar } from './MobileNavbar';

export const Header: FC = () => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#DDDDDD]">
      <DesktopNavbar />
      <MobileNavbar />
    </header>
  );
};
