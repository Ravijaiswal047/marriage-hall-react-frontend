export interface DestinationItem {
  id: string;
  city: string;
  state: string;
  tagline: string;
  image: string;
  venueCountText: string;
}

export interface CategoryMarketingItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  badge?: string;
}

export interface TrustItem {
  id: string;
  title: string;
  description: string;
  iconName: 'ShieldCheck' | 'CalendarCheck' | 'BadgeIndianRupee' | 'Headphones';
}

export interface TestimonialItem {
  id: string;
  coupleName: string;
  weddingLocation: string;
  quote: string;
  rating: number;
  avatar: string;
  venueName: string;
}

export const HERO_CONTENT = {
  title: 'Find the perfect venue for your special day',
  subtitle:
    'Discover & book marriage halls, banquet halls, lawns, hotels, resorts, and luxury wedding venues with real-time slot availability.',
  primaryCta: 'Explore Venues',
  secondaryCta: 'List Your Venue',
  bgImage:
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2000&q=80',
};

export const POPULAR_DESTINATIONS: DestinationItem[] = [
  {
    id: 'mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    tagline: 'Sea-facing banquets & luxury Five-Star venues',
    image:
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
    venueCountText: '120+ Verified Venues',
  },
  {
    id: 'delhi',
    city: 'Delhi',
    state: 'NCR',
    tagline: 'Grand royal farmhouses & opulent wedding lawns',
    image:
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
    venueCountText: '150+ Verified Venues',
  },
  {
    id: 'bangalore',
    city: 'Bangalore',
    state: 'Karnataka',
    tagline: 'Lush green open-air lawns & modern convention centers',
    image:
      'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
    venueCountText: '95+ Verified Venues',
  },
  {
    id: 'hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    tagline: 'Heritage royal palaces & air-conditioned marriage halls',
    image:
      'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80',
    venueCountText: '80+ Verified Venues',
  },
  {
    id: 'pune',
    city: 'Pune',
    state: 'Maharashtra',
    tagline: 'Scenic resort venues & elegant party halls',
    image:
      'https://images.unsplash.com/photo-1626014903708-ec4f676451e0?auto=format&fit=crop&w=800&q=80',
    venueCountText: '65+ Verified Venues',
  },
  {
    id: 'jaipur',
    city: 'Jaipur',
    state: 'Rajasthan',
    tagline: 'Majestic destination wedding forts & palaces',
    image:
      'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=800&q=80',
    venueCountText: '50+ Royal Venues',
  },
];

export const CATEGORY_MARKETING_ITEMS: CategoryMarketingItem[] = [
  {
    id: 'banquet-halls',
    title: 'Banquet Halls',
    subtitle: 'Air-conditioned indoor halls with premium catering',
    image:
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80',
    badge: 'Popular',
  },
  {
    id: 'lawns',
    title: 'Wedding Lawns',
    subtitle: 'Spacious open-air green lawns for grand receptions',
    image:
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80',
    badge: 'Outdoor',
  },
  {
    id: 'hotels',
    title: '5-Star Hotels',
    subtitle: 'Luxury hotel ballrooms with guest accommodations',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
    badge: 'Premium',
  },
  {
    id: 'luxury-venues',
    title: 'Luxury Palaces',
    subtitle: 'Royal palaces & forts for destination weddings',
    image:
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
    badge: 'Heritage',
  },
  {
    id: 'farmhouses',
    title: 'Private Farmhouses',
    subtitle: 'Exclusive private estates with pool & lawn space',
    image:
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'resorts',
    title: 'Beach & Hill Resorts',
    subtitle: 'Scenic getaway resorts for multi-day celebrations',
    image:
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
  },
];

export const TRUST_FEATURES: TrustItem[] = [
  {
    id: 'verified',
    title: '100% Verified Listings',
    description:
      'Every wedding hall is physically audited for capacity, parking, and amenities.',
    iconName: 'ShieldCheck',
  },
  {
    id: 'realtime',
    title: 'Real-time Slot Availability',
    description:
      'Check morning, evening, or full-day slot availability live before booking.',
    iconName: 'CalendarCheck',
  },
  {
    id: 'pricing',
    title: 'Transparent Pricing',
    description:
      'Direct pricing per day and plate rates without hidden agent markups.',
    iconName: 'BadgeIndianRupee',
  },
  {
    id: 'support',
    title: 'Dedicated Wedding Concierge',
    description:
      'Personalized assistance from venue selection to advance payment receipt.',
    iconName: 'Headphones',
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: '1',
    coupleName: 'Ananya & Rahul',
    weddingLocation: 'Mumbai',
    venueName: 'Grand Imperial Palace',
    quote:
      'MarriageHall.com helped us check live date slots and lock in our dream venue in just 10 minutes. The pricing was completely transparent!',
    rating: 5,
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: '2',
    coupleName: 'Vikram & Sneha',
    weddingLocation: 'Delhi NCR',
    venueName: 'Royal Orchid Lawns',
    quote:
      'Searching for farmhouses with 800+ guest capacity was so smooth. The vendor replied instantly and we paid the advance online hassle-free.',
    rating: 5,
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
];

export const VENDOR_CTA_CONTENT = {
  headline: 'Own a marriage hall or wedding venue?',
  description:
    'Join India’s fastest-growing wedding venue marketplace. List your property, manage bookings, and reach thousands of engaged couples daily.',
  ctaText: 'List Your Venue For Free',
  benefits: [
    'Direct customer inquiries & bookings',
    'Real-time slot availability calendar control',
    'Zero commission on venue bookings',
    'Dedicated vendor analytics dashboard',
  ],
};

