import { useState, useRef, useEffect } from 'react';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Building2,
  MapPin,
  DollarSign,
  Users,
  Image as ImageIcon,
  Plus,
  Trash2,
  Wind,
  Car,
  UtensilsCrossed,
  Music,
  Wine,
  Zap,
  Upload,
  Star,
  CheckCircle2,
  ArrowRight,
  Layers,
} from 'lucide-react';
import type { HallRequestDTO } from '@/types/api';
import type { Hall } from '@/types/common';
import { hallFormSchema, type HallFormValues } from '../schemas/hall.schema';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';

export interface HallFormProps {
  initialValues?: Hall;
  onSubmit: (data: HallRequestDTO) => Promise<void>;
  isLoading?: boolean;
  submitError?: Error | null;
  buttonText?: string;
}

const SECTION_TABS = [
  { id: 'section-basic', label: '1. Basic Info', icon: Building2 },
  { id: 'section-pricing', label: '2. Pricing & Specs', icon: DollarSign },
  { id: 'section-media', label: '3. Photos & Media', icon: ImageIcon },
  { id: 'section-amenities', label: '4. Amenities & Rules', icon: Layers },
];

export const HallForm: FC<HallFormProps> = ({
  initialValues,
  onSubmit,
  isLoading = false,
  submitError,
  buttonText = 'Publish Venue Listing',
}) => {
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imagesList, setImagesList] = useState<string[]>(initialValues?.images || []);
  const [activeSection, setActiveSection] = useState('section-basic');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<HallFormValues>({
    resolver: zodResolver(hallFormSchema),
    defaultValues: {
      name: initialValues?.name || '',
      location: initialValues?.location || '',
      city: initialValues?.city || '',
      state: initialValues?.state || '',
      address: initialValues?.address || '',
      landmark: initialValues?.landmark || '',
      pincode: initialValues?.pincode || '',
      price: initialValues?.price || 100000,
      vegPricePerPlate: initialValues?.vegPricePerPlate || undefined,
      nonVegPricePerPlate: initialValues?.nonVegPricePerPlate || undefined,
      capacity: initialValues?.capacity || 500,
      floatingCapacity: initialValues?.floatingCapacity || undefined,
      description: initialValues?.description || '',
      coverImageUrl: initialValues?.coverImageUrl || '',
      hasAc: initialValues?.hasAc !== false,
      hasParking: initialValues?.hasParking !== false,
      parkingCapacity: initialValues?.parkingCapacity || undefined,
      roomsCount: initialValues?.roomsCount || undefined,
      outsideCateringAllowed: Boolean(initialValues?.outsideCateringAllowed),
      djAllowed: initialValues?.djAllowed !== false,
      alcoholAllowed: Boolean(initialValues?.alcoholAllowed),
      powerBackup: initialValues?.powerBackup !== false,
    },
  });

  const coverImageUrl = watch('coverImageUrl');

  // Keep images in form state updated
  useEffect(() => {
    setValue('images', imagesList);
  }, [imagesList, setValue]);

  // Smooth scroll handler for section tabs
  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -100;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleAddImage = () => {
    const trimmed = imageUrlInput.trim();
    if (trimmed && !imagesList.includes(trimmed)) {
      const updated = [...imagesList, trimmed];
      setImagesList(updated);
      setValue('images', updated);
      setImageUrlInput('');

      if (!coverImageUrl) {
        setValue('coverImageUrl', trimmed);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result && !imagesList.includes(result)) {
          setImagesList((prev) => {
            const next = [...prev, result];
            setValue('images', next);
            if (!watch('coverImageUrl') && next.length === 1) {
              setValue('coverImageUrl', result);
            }
            return next;
          });
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result && !imagesList.includes(result)) {
          setImagesList((prev) => {
            const next = [...prev, result];
            setValue('images', next);
            if (!watch('coverImageUrl') && next.length === 1) {
              setValue('coverImageUrl', result);
            }
            return next;
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    const removedUrl = imagesList[index];
    const updated = imagesList.filter((_, idx) => idx !== index);
    setImagesList(updated);
    setValue('images', updated);

    if (coverImageUrl === removedUrl) {
      setValue('coverImageUrl', updated[0] || '');
    }
  };

  const handleSetCoverImage = (url: string) => {
    setValue('coverImageUrl', url);
  };

  const onFormSubmit = async (values: HallFormValues) => {
    const payload: HallRequestDTO = {
      ...values,
      images: imagesList.length > 0 ? imagesList : undefined,
    };
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-6 text-left relative">
      {/* STICKY SECTION NAVIGATION TABS */}
      <div className="sticky top-20 z-20 bg-white/95 backdrop-blur-md p-1.5 border border-[#EBEBEB] rounded-2xl shadow-sm flex items-center gap-1 overflow-x-auto select-none">
        {SECTION_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => scrollToSection(tab.id)}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0',
                isActive
                  ? 'bg-[#FFF0F3] text-[#FF385C] shadow-2xs'
                  : 'text-[#717171] hover:bg-[#F7F7F7] hover:text-[#222222]'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. BASIC INFORMATION */}
      <Card id="section-basic" className="p-6 bg-white border border-[#EBEBEB] rounded-3xl flex flex-col gap-5 shadow-xs scroll-mt-28">
        <div className="flex items-center justify-between pb-3 border-b border-[#EBEBEB]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#FFF0F3] text-[#FF385C] flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#222222] tracking-tight">Basic Venue Details</h3>
              <p className="text-xs text-[#717171]">Provide venue name, address, and city specs</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-[#FF385C] bg-[#FFF0F3] px-2.5 py-1 rounded-full">
            Required
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-[#222222]">Venue Name *</label>
            <Input
              type="text"
              placeholder="e.g. Royal Crystal Banquet & Convention Center"
              {...register('name')}
              error={errors.name?.message}
              className="text-xs py-2.5"
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-[#222222]">Display Location String *</label>
            <Input
              type="text"
              placeholder="e.g. Andheri East, Mumbai, Maharashtra"
              {...register('location')}
              error={errors.location?.message}
              leftIcon={<MapPin className="w-4 h-4 text-[#717171]" />}
              className="text-xs py-2.5"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#222222]">City</label>
            <Input
              type="text"
              placeholder="e.g. Mumbai"
              {...register('city')}
              error={errors.city?.message}
              className="text-xs py-2.5"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#222222]">State</label>
            <Input
              type="text"
              placeholder="e.g. Maharashtra"
              {...register('state')}
              error={errors.state?.message}
              className="text-xs py-2.5"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#222222]">Landmark</label>
            <Input
              type="text"
              placeholder="e.g. Opposite Metro Station"
              {...register('landmark')}
              error={errors.landmark?.message}
              className="text-xs py-2.5"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#222222]">Pincode</label>
            <Input
              type="text"
              placeholder="e.g. 400069"
              {...register('pincode')}
              error={errors.pincode?.message}
              className="text-xs py-2.5"
            />
          </div>
        </div>
      </Card>

      {/* 2. PRICING & CAPACITY */}
      <Card id="section-pricing" className="p-6 bg-white border border-[#EBEBEB] rounded-3xl flex flex-col gap-5 shadow-xs scroll-mt-28">
        <div className="flex items-center justify-between pb-3 border-b border-[#EBEBEB]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#222222] tracking-tight">Pricing & Guest Capacity</h3>
              <p className="text-xs text-[#717171]">Set venue rental prices and maximum guest limits</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            Required
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#222222]">Daily Rent Price (₹) *</label>
            <Input
              type="number"
              {...register('price', { valueAsNumber: true })}
              error={errors.price?.message}
              className="text-xs py-2.5"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#222222]">Seated Guest Capacity *</label>
            <Input
              type="number"
              {...register('capacity', { valueAsNumber: true })}
              error={errors.capacity?.message}
              leftIcon={<Users className="w-4 h-4 text-[#717171]" />}
              className="text-xs py-2.5"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#222222]">Floating Capacity</label>
            <Input
              type="number"
              placeholder="e.g. 1000"
              {...register('floatingCapacity', { valueAsNumber: true })}
              error={errors.floatingCapacity?.message}
              className="text-xs py-2.5"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#222222]">Veg Plate Price (₹)</label>
            <Input
              type="number"
              placeholder="e.g. 1200"
              {...register('vegPricePerPlate', { valueAsNumber: true })}
              error={errors.vegPricePerPlate?.message}
              className="text-xs py-2.5"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#222222]">Non-Veg Plate Price (₹)</label>
            <Input
              type="number"
              placeholder="e.g. 1500"
              {...register('nonVegPricePerPlate', { valueAsNumber: true })}
              error={errors.nonVegPricePerPlate?.message}
              className="text-xs py-2.5"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#222222]">Guest Rooms Count</label>
            <Input
              type="number"
              placeholder="e.g. 8"
              {...register('roomsCount', { valueAsNumber: true })}
              error={errors.roomsCount?.message}
              className="text-xs py-2.5"
            />
          </div>
        </div>
      </Card>

      {/* 3. DESCRIPTION & MEDIA UPLOADER */}
      <Card id="section-media" className="p-6 bg-white border border-[#EBEBEB] rounded-3xl flex flex-col gap-5 shadow-xs scroll-mt-28">
        <div className="flex items-center justify-between pb-3 border-b border-[#EBEBEB]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#222222] tracking-tight">Photos & Media Gallery</h3>
              <p className="text-xs text-[#717171]">Upload venue photos or paste image URLs</p>
            </div>
          </div>
          <span className="text-xs text-[#717171] font-semibold">
            {imagesList.length} photos added
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#222222]">Venue Description</label>
          <Textarea
            rows={4}
            placeholder="Describe venue highlights, dining hall capacity, lighting, mandap setup, and parking accessibility..."
            {...register('description')}
            error={errors.description?.message}
            className="text-xs leading-relaxed"
          />
        </div>

        {/* DRAG AND DROP FILE PICKER ZONE */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-bold text-[#222222]">Venue Photos</label>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'border-2 border-dashed rounded-2xl p-6 text-center flex flex-col items-center justify-center cursor-pointer transition-all',
              isDragging
                ? 'border-[#FF385C] bg-[#FFF0F3]/50 scale-[0.99]'
                : 'border-[#DDDDDD] bg-[#F7F7F7]/60 hover:border-[#FF385C] hover:bg-[#FFF0F3]/20'
            )}
          >
            <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-[#EBEBEB] flex items-center justify-center text-[#FF385C] mb-2">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-[#222222]">
              Click to browse or drop images here
            </p>
            <p className="text-[11px] text-[#717171] mt-0.5">
              Supports PNG, JPG, WEBP & high-resolution photos
            </p>
          </div>

          {/* PASTE IMAGE URL INPUT */}
          <div className="flex flex-col gap-1.5 pt-1">
            <label className="text-[11px] font-bold text-[#717171] uppercase tracking-wider">
              Or Add via Direct Image URL
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddImage();
                  }
                }}
                className="text-xs py-2"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddImage}
                leftIcon={<Plus className="w-4 h-4" />}
                className="shrink-0 cursor-pointer font-bold border-[#DDDDDD]"
              >
                Add Image
              </Button>
            </div>
          </div>

          {/* COVER IMAGE URL OVERRIDE */}
          <div className="flex flex-col gap-1 pt-1">
            <label className="text-[11px] font-bold text-[#717171] uppercase tracking-wider">
              Cover Image URL (Primary Card Image)
            </label>
            <Input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              {...register('coverImageUrl')}
              error={errors.coverImageUrl?.message}
              className="text-xs py-2"
            />
          </div>

          {/* GALLERY IMAGE PREVIEWS */}
          {imagesList.length > 0 && (
            <div className="flex flex-col gap-2 pt-2">
              <span className="text-xs font-bold text-[#222222]">Gallery Preview & Cover Selection</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {imagesList.map((url, idx) => {
                  const isCover = coverImageUrl === url || (!coverImageUrl && idx === 0);
                  return (
                    <div
                      key={idx}
                      className={cn(
                        'relative rounded-2xl overflow-hidden group aspect-video bg-gray-100 border transition-all',
                        isCover ? 'border-[#FF385C] ring-2 ring-[#FF385C]/30' : 'border-[#EBEBEB]'
                      )}
                    >
                      <img src={url} alt={`Venue Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                      
                      {isCover && (
                        <div className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-[#FF385C] text-white text-[10px] font-bold rounded-full shadow-xs flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" /> Cover Photo
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                        {!isCover && (
                          <button
                            type="button"
                            onClick={() => handleSetCoverImage(url)}
                            className="p-1.5 bg-white text-[#222222] rounded-xl text-[10px] font-bold shadow-md hover:bg-[#FFF0F3] hover:text-[#FF385C] transition-colors"
                          >
                            Set Cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="p-1.5 bg-red-600 text-white rounded-xl shadow-md hover:bg-red-700 transition-colors"
                          aria-label="Remove image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* 4. AMENITIES TOGGLES */}
      <Card id="section-amenities" className="p-6 bg-white border border-[#EBEBEB] rounded-3xl flex flex-col gap-5 shadow-xs scroll-mt-28">
        <div className="flex items-center justify-between pb-3 border-b border-[#EBEBEB]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#222222] tracking-tight">Venue Amenities & Policies</h3>
              <p className="text-xs text-[#717171]">Select features available for host bookings</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold text-[#222222]">
          <label className="flex items-center justify-between p-3.5 bg-[#F7F7F7] border border-[#EBEBEB] rounded-2xl cursor-pointer hover:bg-white hover:border-[#FF385C]/40 transition-all">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-sky-100 text-sky-600">
                <Wind className="w-4 h-4" />
              </div>
              <span>Air Conditioned (AC)</span>
            </div>
            <input type="checkbox" {...register('hasAc')} className="w-4 h-4 rounded-md text-[#FF385C] accent-[#FF385C]" />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-[#F7F7F7] border border-[#EBEBEB] rounded-2xl cursor-pointer hover:bg-white hover:border-[#FF385C]/40 transition-all">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-emerald-100 text-emerald-600">
                <Car className="w-4 h-4" />
              </div>
              <span>Dedicated Parking</span>
            </div>
            <input type="checkbox" {...register('hasParking')} className="w-4 h-4 rounded-md text-[#FF385C] accent-[#FF385C]" />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-[#F7F7F7] border border-[#EBEBEB] rounded-2xl cursor-pointer hover:bg-white hover:border-[#FF385C]/40 transition-all">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-rose-100 text-[#FF385C]">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <span>Outside Catering Allowed</span>
            </div>
            <input type="checkbox" {...register('outsideCateringAllowed')} className="w-4 h-4 rounded-md text-[#FF385C] accent-[#FF385C]" />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-[#F7F7F7] border border-[#EBEBEB] rounded-2xl cursor-pointer hover:bg-white hover:border-[#FF385C]/40 transition-all">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-indigo-100 text-indigo-600">
                <Music className="w-4 h-4" />
              </div>
              <span>DJ & Music System</span>
            </div>
            <input type="checkbox" {...register('djAllowed')} className="w-4 h-4 rounded-md text-[#FF385C] accent-[#FF385C]" />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-[#F7F7F7] border border-[#EBEBEB] rounded-2xl cursor-pointer hover:bg-white hover:border-[#FF385C]/40 transition-all">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-purple-100 text-purple-600">
                <Wine className="w-4 h-4" />
              </div>
              <span>Alcohol Permitted</span>
            </div>
            <input type="checkbox" {...register('alcoholAllowed')} className="w-4 h-4 rounded-md text-[#FF385C] accent-[#FF385C]" />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-[#F7F7F7] border border-[#EBEBEB] rounded-2xl cursor-pointer hover:bg-white hover:border-[#FF385C]/40 transition-all">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-amber-100 text-amber-600">
                <Zap className="w-4 h-4" />
              </div>
              <span>100% Power Backup</span>
            </div>
            <input type="checkbox" {...register('powerBackup')} className="w-4 h-4 rounded-md text-[#FF385C] accent-[#FF385C]" />
          </label>
        </div>
      </Card>

      {/* ERROR ALERT */}
      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 font-medium leading-relaxed">
          {submitError.message || 'Failed to save venue listing. Please check form inputs and try again.'}
        </div>
      )}

      {/* STICKY BOTTOM ACTION BAR */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 border border-[#EBEBEB] rounded-2xl shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-[#717171]">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold text-[#222222]">
            {imagesList.length > 0 ? `${imagesList.length} photos ready` : 'Fill required details'}
          </span>
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
          className="px-8 py-3 font-bold shadow-md hover:shadow-lg bg-gradient-to-r from-[#FF385C] via-[#E00B41] to-[#D70466] hover:opacity-95 text-white rounded-xl cursor-pointer"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          {buttonText}
        </Button>
      </div>
    </form>
  );
};
