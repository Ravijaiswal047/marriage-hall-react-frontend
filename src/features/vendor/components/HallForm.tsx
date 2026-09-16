import { useState } from 'react';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, MapPin, DollarSign, Users, Image as ImageIcon, Plus, Trash2, Wind, Car, UtensilsCrossed, Music, Wine, Zap } from 'lucide-react';
import type { HallRequestDTO } from '@/types/api';
import type { Hall } from '@/types/common';
import { hallFormSchema, type HallFormValues } from '../schemas/hall.schema';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export interface HallFormProps {
  initialValues?: Hall;
  onSubmit: (data: HallRequestDTO) => Promise<void>;
  isLoading?: boolean;
  submitError?: Error | null;
  buttonText?: string;
}

export const HallForm: FC<HallFormProps> = ({
  initialValues,
  onSubmit,
  isLoading = false,
  submitError,
  buttonText = 'Save Venue Listing',
}) => {
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imagesList, setImagesList] = useState<string[]>(initialValues?.images || []);

  const {
    register,
    handleSubmit,
    setValue,
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

  const handleAddImage = () => {
    if (imageUrlInput.trim() && !imagesList.includes(imageUrlInput.trim())) {
      const updated = [...imagesList, imageUrlInput.trim()];
      setImagesList(updated);
      setValue('images', updated);
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    const updated = imagesList.filter((_, idx) => idx !== index);
    setImagesList(updated);
    setValue('images', updated);
  };

  const onFormSubmit = async (values: HallFormValues) => {
    const payload: HallRequestDTO = {
      ...values,
      images: imagesList.length > 0 ? imagesList : undefined,
    };
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-6 text-left">
      {/* 1. BASIC INFORMATION */}
      <Card className="p-6 bg-white border border-[#DDDDDD] rounded-2xl flex flex-col gap-4 shadow-xs">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#FF385C] flex items-center gap-1.5">
          <Building2 className="w-4 h-4" /> Basic Venue Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-[#222222]">Venue Name *</label>
            <Input
              type="text"
              placeholder="e.g. Royal Crystal Banquet"
              {...register('name')}
              error={errors.name?.message}
              className="text-xs py-2"
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
              className="text-xs py-2"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#222222]">City</label>
            <Input
              type="text"
              placeholder="e.g. Mumbai"
              {...register('city')}
              error={errors.city?.message}
              className="text-xs py-2"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#222222]">State</label>
            <Input
              type="text"
              placeholder="e.g. Maharashtra"
              {...register('state')}
              error={errors.state?.message}
              className="text-xs py-2"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#222222]">Landmark</label>
            <Input
              type="text"
              placeholder="e.g. Near Metro Station"
              {...register('landmark')}
              error={errors.landmark?.message}
              className="text-xs py-2"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#222222]">Pincode</label>
            <Input
              type="text"
              placeholder="e.g. 400069"
              {...register('pincode')}
              error={errors.pincode?.message}
              className="text-xs py-2"
            />
          </div>
        </div>
      </Card>

      {/* 2. PRICING & CAPACITY */}
      <Card className="p-6 bg-white border border-[#DDDDDD] rounded-2xl flex flex-col gap-4 shadow-xs">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#FF385C] flex items-center gap-1.5">
          <DollarSign className="w-4 h-4" /> Pricing & Capacity Specs
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#222222]">Daily Rent Price (₹) *</label>
            <Input
              type="number"
              {...register('price', { valueAsNumber: true })}
              error={errors.price?.message}
              className="text-xs py-2"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#222222]">Seated Guest Capacity *</label>
            <Input
              type="number"
              {...register('capacity', { valueAsNumber: true })}
              error={errors.capacity?.message}
              leftIcon={<Users className="w-4 h-4 text-[#717171]" />}
              className="text-xs py-2"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#222222]">Floating Capacity</label>
            <Input
              type="number"
              placeholder="e.g. 1000"
              {...register('floatingCapacity', { valueAsNumber: true })}
              error={errors.floatingCapacity?.message}
              className="text-xs py-2"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#222222]">Veg Plate Price (₹)</label>
            <Input
              type="number"
              placeholder="e.g. 1200"
              {...register('vegPricePerPlate', { valueAsNumber: true })}
              error={errors.vegPricePerPlate?.message}
              className="text-xs py-2"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#222222]">Non-Veg Plate Price (₹)</label>
            <Input
              type="number"
              placeholder="e.g. 1500"
              {...register('nonVegPricePerPlate', { valueAsNumber: true })}
              error={errors.nonVegPricePerPlate?.message}
              className="text-xs py-2"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#222222]">Guest Rooms Count</label>
            <Input
              type="number"
              placeholder="e.g. 8"
              {...register('roomsCount', { valueAsNumber: true })}
              error={errors.roomsCount?.message}
              className="text-xs py-2"
            />
          </div>
        </div>
      </Card>

      {/* 3. DESCRIPTION & MEDIA URLS */}
      <Card className="p-6 bg-white border border-[#DDDDDD] rounded-2xl flex flex-col gap-4 shadow-xs">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#FF385C] flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4" /> Description & Image Gallery
        </h3>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#222222]">Venue Description</label>
          <Textarea
            rows={4}
            placeholder="Describe venue highlights, dining hall size, stage lighting, and accessibility..."
            {...register('description')}
            error={errors.description?.message}
            className="text-xs"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#222222]">Cover Image URL</label>
          <Input
            type="url"
            placeholder="https://images.unsplash.com/photo-..."
            {...register('coverImageUrl')}
            error={errors.coverImageUrl?.message}
            className="text-xs py-2"
          />
        </div>

        {/* GALLERY URL ADDER */}
        <div className="flex flex-col gap-2 pt-2 border-t border-[#DDDDDD]">
          <label className="text-xs font-bold text-[#222222]">Additional Gallery Image URLs</label>
          <div className="flex items-center gap-2">
            <Input
              type="url"
              placeholder="Paste image URL..."
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              className="text-xs py-2"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddImage}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add
            </Button>
          </div>

          {/* IMAGE PREVIEW TILES */}
          {imagesList.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
              {imagesList.map((url, idx) => (
                <div key={idx} className="relative rounded-xl overflow-hidden group aspect-video bg-gray-100 border border-[#DDDDDD]">
                  <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100 shadow-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* 4. AMENITIES TOGGLES */}
      <Card className="p-6 bg-white border border-[#DDDDDD] rounded-2xl flex flex-col gap-4 shadow-xs">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#FF385C]">
          Venue Amenities & Policies
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-[#222222]">
          <label className="flex items-center justify-between p-3 bg-[#F7F7F7] rounded-xl cursor-pointer">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-sky-600" />
              <span>Air Conditioned (AC)</span>
            </div>
            <input type="checkbox" {...register('hasAc')} className="w-4 h-4 rounded-xs text-[#FF385C]" />
          </label>

          <label className="flex items-center justify-between p-3 bg-[#F7F7F7] rounded-xl cursor-pointer">
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-emerald-600" />
              <span>Dedicated Parking</span>
            </div>
            <input type="checkbox" {...register('hasParking')} className="w-4 h-4 rounded-xs text-[#FF385C]" />
          </label>

          <label className="flex items-center justify-between p-3 bg-[#F7F7F7] rounded-xl cursor-pointer">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-[#FF385C]" />
              <span>Outside Catering Allowed</span>
            </div>
            <input type="checkbox" {...register('outsideCateringAllowed')} className="w-4 h-4 rounded-xs text-[#FF385C]" />
          </label>

          <label className="flex items-center justify-between p-3 bg-[#F7F7F7] rounded-xl cursor-pointer">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-indigo-600" />
              <span>DJ & Music System</span>
            </div>
            <input type="checkbox" {...register('djAllowed')} className="w-4 h-4 rounded-xs text-[#FF385C]" />
          </label>

          <label className="flex items-center justify-between p-3 bg-[#F7F7F7] rounded-xl cursor-pointer">
            <div className="flex items-center gap-2">
              <Wine className="w-4 h-4 text-rose-600" />
              <span>Alcohol Permitted</span>
            </div>
            <input type="checkbox" {...register('alcoholAllowed')} className="w-4 h-4 rounded-xs text-[#FF385C]" />
          </label>

          <label className="flex items-center justify-between p-3 bg-[#F7F7F7] rounded-xl cursor-pointer">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>100% Power Backup</span>
            </div>
            <input type="checkbox" {...register('powerBackup')} className="w-4 h-4 rounded-xs text-[#FF385C]" />
          </label>
        </div>
      </Card>

      {/* ERROR ALERT */}
      {submitError && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
          {submitError.message || 'Failed to save venue listing. Please check form inputs and try again.'}
        </div>
      )}

      {/* SUBMIT BUTTON */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
          className="px-8 py-3 font-bold shadow-md hover:shadow-lg"
        >
          {buttonText}
        </Button>
      </div>
    </form>
  );
};
