import { useState } from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Globe,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const DESTINATION_TABS = [
  { id: 'popular', label: 'Popular Cities' },
  { id: 'luxury', label: 'Luxury Banquets' },
  { id: 'lawns', label: 'Lawns & Gardens' },
  { id: 'palace', label: 'Royal Palaces' },
];

const DESTINATIONS_DATA: Record<string, { city: string; desc: string; link: string }[]> = {
  popular: [
    { city: 'Mumbai', desc: 'Banquets in Bandra, Juhu & Andheri', link: '/halls?city=Mumbai' },
    { city: 'Delhi NCR', desc: 'Luxury farmhouses in Chattarpur', link: '/halls?city=Delhi' },
    { city: 'Bangalore', desc: 'Garden lawns in Palace Ground', link: '/halls?city=Bangalore' },
    { city: 'Jaipur', desc: 'Royal heritage resorts & palaces', link: '/halls?city=Jaipur' },
    { city: 'Hyderabad', desc: 'Convention halls in Banjara Hills', link: '/halls?city=Hyderabad' },
    { city: 'Udaipur', desc: 'Lakeview wedding destinations', link: '/halls?city=Udaipur' },
    { city: 'Goa', desc: 'Beachfront resort venues', link: '/halls?city=Goa' },
    { city: 'Chennai', desc: 'Kalyana Mandapams & halls', link: '/halls?city=Chennai' },
  ],
  luxury: [
    { city: '5-Star Hotel Banquets', desc: 'Taj, Oberoi & Marriott halls', link: '/halls?category=luxury' },
    { city: 'Grand Convention Centers', desc: 'Acres of pillarless halls', link: '/halls?category=convention' },
    { city: 'Royal Ballrooms', desc: 'Crystal chandeliers & stage', link: '/halls?category=ballroom' },
    { city: 'Executive Party Suites', desc: 'Premium catering included', link: '/halls?category=suite' },
  ],
  lawns: [
    { city: 'Poolside Party Lawns', desc: 'Cocktail & sangeet venues', link: '/halls?category=lawn' },
    { city: 'Open-Air Farmhouses', desc: 'Green manicured gardens', link: '/halls?category=farmhouse' },
    { city: 'Beachside Turf Lawns', desc: 'Sunset mandap setups', link: '/halls?category=beach' },
    { city: 'Golf Club Grounds', desc: 'Spacious outdoor capacity', link: '/halls?category=golf' },
  ],
  palace: [
    { city: 'Udaipur Palace Lawns', desc: 'Destination royal weddings', link: '/halls?city=Udaipur' },
    { city: 'Jaipur Fort Banquets', desc: 'Heritage heritage architecture', link: '/halls?city=Jaipur' },
    { city: 'Jodhpur Heritage Haveli', desc: 'Courtyard & mandap setups', link: '/halls?city=Jodhpur' },
    { city: 'Jaisalmer Sand Resorts', desc: 'Desert royal celebrations', link: '/halls?city=Jaisalmer' },
  ],
};

export const Footer: FC = () => {
  const [activeTab, setActiveTab] = useState('popular');

  return (
    <footer className="bg-[#F7F7F7] text-[#222222] border-t border-[#EBEBEB] pt-12 pb-8 mt-16 text-left select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
        {/* INSPIRATION DESTINATIONS TABS (AIRBNB STYLE) */}
        <div className="flex flex-col gap-4 pb-8 border-b border-[#EBEBEB]">
          <h2 className="text-lg sm:text-xl font-extrabold text-[#222222] tracking-tight">
            Inspiration for future wedding celebrations
          </h2>

          {/* DESTINATION TABS */}
          <div className="flex items-center gap-6 overflow-x-auto pb-2 border-b border-[#EBEBEB]">
            {DESTINATION_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'text-xs sm:text-sm font-bold pb-2 transition-all whitespace-nowrap cursor-pointer border-b-2',
                  activeTab === tab.id
                    ? 'border-[#222222] text-[#222222]'
                    : 'border-transparent text-[#717171] hover:text-[#222222]'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* DESTINATIONS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            {DESTINATIONS_DATA[activeTab]?.map((item, idx) => (
              <Link
                key={idx}
                to={item.link}
                className="flex flex-col text-left group hover:opacity-80 transition-opacity"
              >
                <span className="text-xs sm:text-sm font-bold text-[#222222] group-hover:underline">
                  {item.city}
                </span>
                <span className="text-[11px] text-[#717171] truncate">{item.desc}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* 4 CORE FOOTER COLUMNS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-[#EBEBEB]">
          {/* COLUMN 1: SUPPORT */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold text-[#222222] uppercase tracking-wider">Support</h3>
            <ul className="space-y-2 text-xs text-[#717171]">
              <li>
                <a href="#help" className="hover:text-[#222222] hover:underline">
                  Help Center & FAQs
                </a>
              </li>
              <li>
                <a href="#guarantee" className="hover:text-[#222222] hover:underline flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FF385C]" />
                  <span>MarriageHall Guarantee</span>
                </a>
              </li>
              <li>
                <a href="#cancellation" className="hover:text-[#222222] hover:underline">
                  Cancellation & Refund Policy
                </a>
              </li>
              <li>
                <a href="#disability" className="hover:text-[#222222] hover:underline">
                  Accessibility Services
                </a>
              </li>
              <li>
                <a href="#report" className="hover:text-[#222222] hover:underline">
                  Report a Venue Concern
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 2: HOSTING / VENDORS */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold text-[#222222] uppercase tracking-wider">Venue Hosts</h3>
            <ul className="space-y-2 text-xs text-[#717171]">
              <li>
                <Link to="/auth/signup?role=VENDOR" className="hover:text-[#222222] hover:underline font-semibold text-[#FF385C]">
                  List Your Venue
                </Link>
              </li>
              <li>
                <Link to="/vendor/dashboard" className="hover:text-[#222222] hover:underline">
                  Host Dashboard
                </Link>
              </li>
              <li>
                <a href="#protection" className="hover:text-[#222222] hover:underline">
                  Host Protection Coverage
                </a>
              </li>
              <li>
                <a href="#resources" className="hover:text-[#222222] hover:underline">
                  Venue Listing Resources
                </a>
              </li>
              <li>
                <a href="#community" className="hover:text-[#222222] hover:underline">
                  Host Community Forum
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: MARKETPLACE */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold text-[#222222] uppercase tracking-wider">MarriageHall</h3>
            <ul className="space-y-2 text-xs text-[#717171]">
              <li>
                <a href="#news" className="hover:text-[#222222] hover:underline">
                  Newsroom & Media
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-[#222222] hover:underline flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>New Features 2026</span>
                </a>
              </li>
              <li>
                <a href="#careers" className="hover:text-[#222222] hover:underline">
                  Careers & Culture
                </a>
              </li>
              <li>
                <a href="#investors" className="hover:text-[#222222] hover:underline">
                  Investor Relations
                </a>
              </li>
              <li>
                <a href="#emergency" className="hover:text-[#222222] hover:underline">
                  Wedding Relief Fund
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: POPULAR CATEGORIES */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold text-[#222222] uppercase tracking-wider">Browse Categories</h3>
            <ul className="space-y-2 text-xs text-[#717171]">
              <li>
                <Link to="/halls?category=ac" className="hover:text-[#222222] hover:underline">
                  AC Banquet Halls
                </Link>
              </li>
              <li>
                <Link to="/halls?category=lawn" className="hover:text-[#222222] hover:underline">
                  Outdoor Wedding Lawns
                </Link>
              </li>
              <li>
                <Link to="/halls?category=luxury" className="hover:text-[#222222] hover:underline">
                  5-Star Luxury Banquets
                </Link>
              </li>
              <li>
                <Link to="/halls?category=heritage" className="hover:text-[#222222] hover:underline">
                  Royal Heritage Palaces
                </Link>
              </li>
              <li>
                <Link to="/halls?category=beach" className="hover:text-[#222222] hover:underline">
                  Beachside Resort Venues
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM LEGAL & SOCIAL BAR (AIRBNB SIGNATURE BAR) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#717171]">
          {/* LEFT: BRAND COPYRIGHT & LEGAL LINKS */}
          <div className="flex items-center flex-wrap gap-2 text-center md:text-left">
            <div className="flex items-center gap-1.5 font-bold text-[#222222]">
              <Building2 className="w-4 h-4 text-[#FF385C]" />
              <span>© {new Date().getFullYear()} MarriageHall, Inc.</span>
            </div>
            <span>·</span>
            <a href="#privacy" className="hover:underline hover:text-[#222222]">
              Privacy
            </a>
            <span>·</span>
            <a href="#terms" className="hover:underline hover:text-[#222222]">
              Terms
            </a>
            <span>·</span>
            <a href="#sitemap" className="hover:underline hover:text-[#222222]">
              Sitemap
            </a>
            <span>·</span>
            <a href="#details" className="hover:underline hover:text-[#222222]">
              Company Details
            </a>
          </div>

          {/* RIGHT: LANGUAGE / CURRENCY & SOCIAL ICONS */}
          <div className="flex items-center gap-6 shrink-0">
            {/* LANGUAGE & CURRENCY SELECTOR */}
            <div className="flex items-center gap-4 font-bold text-[#222222]">
              <button type="button" className="flex items-center gap-1.5 hover:underline cursor-pointer">
                <Globe className="w-4 h-4" />
                <span>English (IN)</span>
              </button>
              <button type="button" className="flex items-center gap-1 hover:underline cursor-pointer">
                <span>₹</span>
                <span>INR</span>
              </button>
            </div>

            {/* SOCIAL ICONS */}
            <div className="flex items-center gap-3 text-[#222222]">
              <a href="https://facebook.com" aria-label="Facebook" className="hover:text-[#FF385C] transition-colors p-1">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://instagram.com" aria-label="Instagram" className="hover:text-[#FF385C] transition-colors p-1">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://twitter.com" aria-label="Twitter" className="hover:text-[#FF385C] transition-colors p-1">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://youtube.com" aria-label="YouTube" className="hover:text-[#FF385C] transition-colors p-1">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://linkedin.com" aria-label="LinkedIn" className="hover:text-[#FF385C] transition-colors p-1">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
