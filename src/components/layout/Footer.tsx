import type { FC } from 'react';
import { Building2 } from 'lucide-react';

export const Footer: FC = () => {
  return (
    <footer className="bg-[#222222] text-[#717171] py-12 border-t border-[#DDDDDD]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
        <div>
          <div className="flex items-center gap-2 font-black text-lg text-white mb-4 tracking-tight">
            <Building2 className="w-5 h-5 text-[#FF385C]" />
            <span>MarriageHall</span>
          </div>
          <p className="text-xs text-[#717171] leading-relaxed">
            India's premier wedding venue marketplace. Discover, check live availability, and book luxury banquet halls seamlessly.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-bold text-white mb-3">Marketplace</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="/halls" className="hover:text-white transition-colors">Browse Venues</a></li>
            <li><a href="/halls?city=Mumbai" className="hover:text-white transition-colors">Mumbai Wedding Halls</a></li>
            <li><a href="/halls?city=Delhi" className="hover:text-white transition-colors">Delhi Banquets</a></li>
            <li><a href="/halls?city=Bangalore" className="hover:text-white transition-colors">Bangalore Palaces</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold text-white mb-3">Vendors</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="/auth/signup?role=VENDOR" className="hover:text-white transition-colors">List Your Venue</a></li>
            <li><a href="/vendor/dashboard" className="hover:text-white transition-colors">Vendor Dashboard</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold text-white mb-3">Legal & Support</h4>
          <ul className="space-y-2 text-xs">
            <li><span className="text-[#717171]">Terms of Service</span></li>
            <li><span className="text-[#717171]">Privacy Policy</span></li>
            <li><span className="text-[#717171]">Support Center</span></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-gray-800 text-center text-xs text-[#717171]">
        © {new Date().getFullYear()} MarriageHall.com. All rights reserved.
      </div>
    </footer>
  );
};
