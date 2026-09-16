import { useState } from 'react';
import type { FC } from 'react';
import { MapPin, Navigation, Copy, Check } from 'lucide-react';
import type { Hall } from '@/types/common';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export interface HallLocationSectionProps {
  hall: Hall;
  className?: string;
}

export const HallLocationSection: FC<HallLocationSectionProps> = ({
  hall,
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const fullAddress = [
    hall.address,
    hall.landmark ? `Near ${hall.landmark}` : null,
    hall.city || hall.location,
    hall.state,
    hall.pincode,
  ]
    .filter(Boolean)
    .join(', ');

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(fullAddress || hall.location);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mapQuery = encodeURIComponent(fullAddress || hall.location || 'India');
  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className={className}>
      <div className="flex flex-col gap-4 text-left">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#FF385C]" />
            <h2 className="text-xl font-bold text-[#222222]">Location & Address</h2>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyAddress}
            leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            className="text-xs font-semibold border-[#DDDDDD]"
          >
            {copied ? 'Address Copied!' : 'Copy Full Address'}
          </Button>
        </div>

        {/* ADDRESS DETAILS CARD */}
        <Card className="p-4 bg-[#F7F7F7] border border-[#DDDDDD] flex flex-col gap-2">
          <span className="text-xs font-bold text-[#222222] flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-[#FF385C]" />
            {hall.name}
          </span>
          <p className="text-xs text-[#717171] leading-relaxed">
            {fullAddress || hall.location}
          </p>
          {hall.landmark && (
            <span className="text-[11px] font-medium text-[#FF385C]">
              Landmark: {hall.landmark}
            </span>
          )}
        </Card>

        {/* GOOGLE MAPS EMBED */}
        <div className="w-full h-64 rounded-2xl overflow-hidden border border-[#DDDDDD] shadow-xs bg-gray-100">
          <iframe
            title={`Map location for ${hall.name}`}
            src={googleMapsEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
};

