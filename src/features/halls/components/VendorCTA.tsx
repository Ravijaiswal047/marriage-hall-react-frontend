import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import { VENDOR_CTA_CONTENT } from '../constants/marketing.content';
import { Button } from '@/components/ui/Button';

export const VendorCTA: FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12 sm:py-16 text-left my-6">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#222222] via-[#2d2d2d] to-[#222222] text-white p-8 sm:p-12 lg:p-16 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* BRAND ACCENT OVERLAY */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF385C]/10 rounded-full filter blur-3xl pointer-events-none" />

        {/* LEFT COLUMN */}
        <div className="relative z-10 max-w-2xl flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF385C]/20 border border-[#FF385C]/40 text-xs font-bold text-[#FF385C] w-fit">
            <Building2 className="w-3.5 h-3.5" />
            <span>For Venue Owners & Managers</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            {VENDOR_CTA_CONTENT.headline}
          </h2>

          <p className="text-sm text-gray-300 leading-relaxed">
            {VENDOR_CTA_CONTENT.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {VENDOR_CTA_CONTENT.benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-semibold text-gray-200">
                <CheckCircle2 className="w-4 h-4 text-[#FF385C] shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN CTA */}
        <div className="relative z-10 shrink-0 w-full sm:w-auto">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/auth/signup?role=VENDOR')}
            rightIcon={<ArrowRight className="w-5 h-5" />}
            className="w-full sm:w-auto px-8 py-4 text-base shadow-lg hover:shadow-xl"
          >
            {VENDOR_CTA_CONTENT.ctaText}
          </Button>
        </div>
      </div>
    </section>
  );
};

