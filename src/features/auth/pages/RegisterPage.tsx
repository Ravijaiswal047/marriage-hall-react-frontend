import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, Phone, Eye, EyeOff, Building2, UserCheck, Store, ArrowRight } from 'lucide-react';
import type { Role } from '@/types/common';
import { useAuth } from '../hooks/useAuth';
import { registerSchema } from '../schemas/auth.schema';
import type { RegisterFormValues } from '../types/auth.types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils/cn';

export const RegisterPage: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role')?.toUpperCase();
  const initialRole: Role = roleParam === 'VENDOR' ? 'VENDOR' : 'USER';

  const { signup, isSigningUp, signupError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const handleClose = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/halls');
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      role: initialRole,
    },
  });

  useEffect(() => {
    if (roleParam === 'VENDOR' || roleParam === 'USER') {
      setValue('role', roleParam as Role);
    }
  }, [roleParam, setValue]);

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const res = await signup({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role as Role,
        phone: data.phone || undefined,
      });

      if (res && res.token) {
        if (data.role === 'VENDOR') {
          navigate('/vendor/dashboard', { replace: true });
        } else {
          navigate('/halls', { replace: true });
        }
      }
    } catch {
      // Handled via signupError
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={handleClose}
      maxWidth="lg"
      showCloseButton={true}
      title={selectedRole === 'VENDOR' ? 'List Your Venue' : 'Create an Account'}
      headerAlign="center"
    >
      <div className="flex flex-col gap-4 text-left animate-content-fade">
        {/* MODAL BRAND HEADER */}
        <div className="flex flex-col items-center text-center pt-1 pb-1">
          <div className="w-11 h-11 rounded-2xl bg-[#FFF0F3] text-[#FF385C] flex items-center justify-center shadow-xs border border-[#FF385C]/20 mb-2.5">
            <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#222222] tracking-tight">
            {selectedRole === 'VENDOR' ? 'Become a Venue Host' : 'Welcome to MarriageHall'}
          </h2>
          <p className="text-xs sm:text-sm text-[#717171] mt-1 max-w-sm font-normal leading-relaxed">
            {selectedRole === 'VENDOR'
              ? 'List your marriage hall or banquet to receive bookings & host inquiries.'
              : 'Discover top venues, check availability, and manage reservations.'}
          </p>
        </div>

        {/* REGISTRATION FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          {/* ROLE SELECTOR CARDS */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#717171]">
              Account Type:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {/* CUSTOMER CARD */}
              <button
                type="button"
                onClick={() => setValue('role', 'USER')}
                className={cn(
                  'p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer',
                  selectedRole === 'USER'
                    ? 'bg-[#FFF0F3]/80 border-[#FF385C] ring-2 ring-[#FF385C]/20 shadow-xs'
                    : 'bg-white border-[#EBEBEB] hover:border-[#DDDDDD] hover:bg-[#F7F7F7]'
                )}
              >
                <div className="flex items-center justify-between">
                  <UserCheck
                    className={cn(
                      'w-4 h-4',
                      selectedRole === 'USER' ? 'text-[#FF385C]' : 'text-[#717171]'
                    )}
                  />
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all',
                      selectedRole === 'USER'
                        ? 'border-[#FF385C] bg-[#FF385C]'
                        : 'border-[#CCCCCC]'
                    )}
                  >
                    {selectedRole === 'USER' && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#222222] block">Book Venues</span>
                  <span className="text-[10px] text-[#717171] leading-tight block">
                    Couples & planners
                  </span>
                </div>
              </button>

              {/* VENDOR CARD */}
              <button
                type="button"
                onClick={() => setValue('role', 'VENDOR')}
                className={cn(
                  'p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer',
                  selectedRole === 'VENDOR'
                    ? 'bg-[#FFF0F3]/80 border-[#FF385C] ring-2 ring-[#FF385C]/20 shadow-xs'
                    : 'bg-white border-[#EBEBEB] hover:border-[#DDDDDD] hover:bg-[#F7F7F7]'
                )}
              >
                <div className="flex items-center justify-between">
                  <Store
                    className={cn(
                      'w-4 h-4',
                      selectedRole === 'VENDOR' ? 'text-[#FF385C]' : 'text-[#717171]'
                    )}
                  />
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all',
                      selectedRole === 'VENDOR'
                        ? 'border-[#FF385C] bg-[#FF385C]'
                        : 'border-[#CCCCCC]'
                    )}
                  >
                    {selectedRole === 'VENDOR' && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#222222] block">List Venue</span>
                  <span className="text-[10px] text-[#717171] leading-tight block">
                    Hall owners & hosts
                  </span>
                </div>
              </button>
            </div>
            {errors.role?.message && (
              <span className="text-xs text-red-600">{errors.role.message}</span>
            )}
          </div>

          {/* NAME & PHONE IN 2 COLUMNS ON DESKTOP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* FULL NAME */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#717171]">
                Full Name
              </label>
              <Input
                type="text"
                placeholder="e.g. Ananya Roy"
                {...register('name')}
                error={errors.name?.message}
                leftIcon={<UserIcon className="w-4 h-4 text-[#717171]" />}
                className="text-xs py-2"
              />
            </div>

            {/* PHONE NUMBER */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#717171]">
                Phone (Optional)
              </label>
              <Input
                type="tel"
                placeholder="+91 98765 43210"
                {...register('phone')}
                error={errors.phone?.message}
                leftIcon={<Phone className="w-4 h-4 text-[#717171]" />}
                className="text-xs py-2"
              />
            </div>
          </div>

          {/* EMAIL ADDRESS */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#717171]">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="ananya@example.com"
              {...register('email')}
              error={errors.email?.message}
              leftIcon={<Mail className="w-4 h-4 text-[#717171]" />}
              className="text-xs py-2"
            />
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#717171]">
              Password
            </label>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password (min 6 chars)"
              {...register('password')}
              error={errors.password?.message}
              leftIcon={<Lock className="w-4 h-4 text-[#717171]" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#717171] hover:text-[#222222] p-1 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
              className="text-xs py-2"
            />
          </div>

          {/* SERVER ERROR ALERT */}
          {signupError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium leading-relaxed">
              {signupError.message || 'Registration failed. Please check your details and try again.'}
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <Button
            type="submit"
            isLoading={isSigningUp}
            disabled={isSigningUp}
            className="w-full py-2.5 text-sm font-bold shadow-md hover:shadow-lg mt-1 bg-gradient-to-r from-[#FF385C] via-[#E00B41] to-[#D70466] hover:opacity-95 text-white border-none rounded-xl"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {selectedRole === 'VENDOR' ? 'Register as Host' : 'Create Account'}
          </Button>

          {/* LOGIN LINK */}
          <div className="text-center pt-2.5 border-t border-[#EBEBEB]">
            <p className="text-xs text-[#717171]">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-[#FF385C] hover:underline"
              >
                Log in instead
              </Link>
            </p>
          </div>
        </form>
      </div>
    </Modal>
  );
};
