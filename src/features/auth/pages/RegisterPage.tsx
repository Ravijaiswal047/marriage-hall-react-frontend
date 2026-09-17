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
    >
      <div className="flex flex-col gap-4 text-left">
        {/* HEADER */}
        <div className="bg-[#FFF0F3] p-4 text-center rounded-2xl border border-[#FF385C]/15 flex flex-col items-center">
          <div className="w-10 h-10 rounded-2xl bg-[#FF385C] text-white flex items-center justify-center shadow-md mb-2">
            <Building2 className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#222222] tracking-tight">
            {selectedRole === 'VENDOR' ? 'List Your Venue' : 'Create an Account'}
          </h2>
          <p className="text-xs text-[#717171] mt-0.5 max-w-sm">
            {selectedRole === 'VENDOR'
              ? 'Join MarriageHall.com to list your wedding venue, check reservations, and receive host inquiries.'
              : 'Join MarriageHall.com to discover venues, check availability, or manage your hall listings.'}
          </p>
        </div>

        {/* REGISTRATION FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5 pt-1">
          {/* ROLE SELECTOR CARDS */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#717171]">
              I want to:
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* CUSTOMER CARD */}
              <button
                type="button"
                onClick={() => setValue('role', 'USER')}
                className={cn(
                  'p-2.5 sm:p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all',
                  selectedRole === 'USER'
                    ? 'bg-[#FFF0F3] border-[#FF385C] shadow-xs'
                    : 'bg-white border-[#DDDDDD] hover:bg-[#F7F7F7]'
                )}
              >
                <div className="flex items-center justify-between">
                  <UserCheck
                    className={cn(
                      'w-4 h-4 sm:w-5 sm:h-5',
                      selectedRole === 'USER' ? 'text-[#FF385C]' : 'text-[#717171]'
                    )}
                  />
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                      selectedRole === 'USER'
                        ? 'border-[#FF385C] bg-[#FF385C]'
                        : 'border-[#DDDDDD]'
                    )}
                  >
                    {selectedRole === 'USER' && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </div>
                <span className="text-xs font-bold text-[#222222]">Book Venues</span>
                <span className="text-[10px] text-[#717171] leading-tight">
                  For couples & event planners
                </span>
              </button>

              {/* VENDOR CARD */}
              <button
                type="button"
                onClick={() => setValue('role', 'VENDOR')}
                className={cn(
                  'p-2.5 sm:p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all',
                  selectedRole === 'VENDOR'
                    ? 'bg-[#FFF0F3] border-[#FF385C] shadow-xs'
                    : 'bg-white border-[#DDDDDD] hover:bg-[#F7F7F7]'
                )}
              >
                <div className="flex items-center justify-between">
                  <Store
                    className={cn(
                      'w-4 h-4 sm:w-5 sm:h-5',
                      selectedRole === 'VENDOR' ? 'text-[#FF385C]' : 'text-[#717171]'
                    )}
                  />
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                      selectedRole === 'VENDOR'
                        ? 'border-[#FF385C] bg-[#FF385C]'
                        : 'border-[#DDDDDD]'
                    )}
                  >
                    {selectedRole === 'VENDOR' && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </div>
                <span className="text-xs font-bold text-[#222222]">List Venue</span>
                <span className="text-[10px] text-[#717171] leading-tight">
                  For hall owners & managers
                </span>
              </button>
            </div>
            {errors.role?.message && (
              <span className="text-xs text-red-600">{errors.role.message}</span>
            )}
          </div>

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

          {/* PHONE NUMBER */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#717171]">
              Phone Number (Optional)
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

          {/* PASSWORD */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#717171]">
              Password
            </label>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password (min 6 chars)"
              {...register('password')}
              error={errors.password?.message}
              leftIcon={<Lock className="w-4 h-4 text-[#717171]" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#717171] hover:text-[#222222] p-1"
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
            className="w-full py-2.5 text-sm font-bold shadow-md hover:shadow-lg mt-0.5"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {selectedRole === 'VENDOR' ? 'Register as Vendor' : 'Create Customer Account'}
          </Button>

          {/* LOGIN LINK */}
          <div className="text-center pt-2.5 border-t border-[#DDDDDD]">
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
