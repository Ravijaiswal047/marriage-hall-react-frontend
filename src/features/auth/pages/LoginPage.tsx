import { useState } from 'react';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Building2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { loginSchema } from '../schemas/auth.schema';
import type { LoginFormValues } from '../types/auth.types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export const LoginPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggingIn, loginError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  // Extract intended destination or default to home
  const fromLocation = (location.state as { from?: { pathname: string } })?.from;
  const fromPath = fromLocation?.pathname || '/halls';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data);
      navigate(fromPath, { replace: true });
    } catch {
      // Error is caught and rendered via loginError
    }
  };

  return (
    <div className="w-full flex items-center justify-center py-2 sm:py-4 px-4 sm:px-6">
      <div className="w-full max-w-md bg-white border border-[#DDDDDD] rounded-3xl shadow-xl overflow-hidden text-left my-auto">
        {/* BRAND HEADER */}
        <div className="bg-[#FFF0F3] p-4 sm:p-5 text-center border-b border-[#FF385C]/15 flex flex-col items-center">
          <div className="w-10 h-10 rounded-2xl bg-[#FF385C] text-white flex items-center justify-center shadow-md mb-2">
            <Building2 className="w-5 h-5" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#222222] tracking-tight">
            Welcome Back
          </h1>
          <p className="text-xs text-[#717171] mt-0.5 max-w-xs">
            Log in to manage your venue bookings, explore top banquets, and connect with venue vendors.
          </p>
        </div>

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 sm:p-6 flex flex-col gap-4">
          {/* EMAIL FIELD */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#717171]">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              error={errors.email?.message}
              leftIcon={<Mail className="w-4 h-4 text-[#717171]" />}
              className="text-xs py-2"
            />
          </div>

          {/* PASSWORD FIELD */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#717171]">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-[#FF385C] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
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
          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium leading-relaxed">
              {loginError.message || 'Invalid email or password. Please check your credentials.'}
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <Button
            type="submit"
            isLoading={isLoggingIn}
            disabled={isLoggingIn}
            className="w-full py-2.5 text-sm font-bold shadow-md hover:shadow-lg mt-0.5"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Log In to MarriageHall
          </Button>

          {/* REGISTER LINK */}
          <div className="text-center pt-2.5 border-t border-[#DDDDDD] flex flex-col gap-2">
            <p className="text-xs text-[#717171]">
              Don't have an account yet?{' '}
              <Link
                to="/register"
                className="font-bold text-[#FF385C] hover:underline"
              >
                Create an account
              </Link>
            </p>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#717171] mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Stateless JWT Encrypted Authentication</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
