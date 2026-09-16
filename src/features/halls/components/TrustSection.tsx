import type { FC } from 'react';
import {
  ShieldCheck,
  CalendarCheck,
  BadgeIndianRupee,
  Headphones,
  Star,
  Quote,
} from 'lucide-react';
import { TRUST_FEATURES, TESTIMONIALS } from '../constants/marketing.content';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';

export const TrustSection: FC = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-[#FF385C]" />;
      case 'CalendarCheck':
        return <CalendarCheck className="w-6 h-6 text-[#FF385C]" />;
      case 'BadgeIndianRupee':
        return <BadgeIndianRupee className="w-6 h-6 text-[#FF385C]" />;
      case 'Headphones':
        return <Headphones className="w-6 h-6 text-[#FF385C]" />;
      default:
        return <ShieldCheck className="w-6 h-6 text-[#FF385C]" />;
    }
  };

  return (
    <section className="py-16 sm:py-20 text-left border-t border-[#DDDDDD] bg-[#F7F7F7] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        {/* WHY MARRIAGEHALL.COM */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="primary" size="sm" className="mb-2">
              Why Couples Choose Us
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-black text-[#222222] tracking-tight">
              Why MarriageHall.com
            </h2>
            <p className="text-sm text-[#717171] mt-2">
              We make finding and booking your dream wedding venue effortless, transparent, and secure.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_FEATURES.map((item) => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-2xl border border-[#DDDDDD] shadow-xs flex flex-col items-start gap-3"
              >
                <div className="p-3 bg-[#FFF0F3] rounded-xl">
                  {getIcon(item.iconName)}
                </div>
                <h3 className="text-base font-bold text-[#222222]">
                  {item.title}
                </h3>
                <p className="text-xs text-[#717171] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CUSTOMER TRUST / TESTIMONIALS */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Badge variant="primary" size="sm" className="mb-2">
              Verified Stories
            </Badge>
            <h3 className="text-xl sm:text-2xl font-black text-[#222222]">
              Loved by Couples Nationwide
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="bg-white p-6 sm:p-8 rounded-2xl border border-[#DDDDDD] shadow-sm flex flex-col justify-between gap-6"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <Quote className="w-6 h-6 text-[#DDDDDD]" />
                  </div>
                  <p className="text-sm italic text-[#222222] leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#DDDDDD]">
                  <Avatar src={t.avatar} name={t.coupleName} size="md" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#222222]">
                      {t.coupleName}
                    </span>
                    <span className="text-[11px] text-[#717171]">
                      Married at {t.venueName}, {t.weddingLocation}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

