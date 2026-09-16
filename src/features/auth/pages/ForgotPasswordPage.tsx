import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, Mail, ArrowLeft, Send, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export const ForgotPasswordPage: FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4 sm:px-6">
      <div className="w-full max-w-md bg-white border border-[#DDDDDD] rounded-3xl shadow-xl overflow-hidden text-left">
        {/* HEADER */}
        <div className="bg-[#FFF0F3] p-6 text-center border-b border-[#FF385C]/15 flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-[#FF385C] text-white flex items-center justify-center shadow-md mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-[#222222] tracking-tight">
            Reset Your Password
          </h1>
          <p className="text-xs text-[#717171] mt-1 max-w-xs">
            Enter your registered account email to initiate account access support.
          </p>
        </div>

        {/* CONTENT / FORM */}
        <div className="p-6 sm:p-8 flex flex-col gap-5">
          {/* BACKEND SYSTEM NOTICE ALERT */}
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="font-bold">Security Policy Notice</span>
              <span className="text-[11px] leading-relaxed text-amber-800">
                Automatic OTP password reset is currently unavailable. Submitting this form alerts MarriageHall Support to verify your account identity manually.
              </span>
            </div>
          </div>

          {isSubmitted ? (
            <div className="p-6 text-center bg-[#F7F7F7] rounded-2xl border border-[#DDDDDD] flex flex-col items-center gap-3">
              <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-[#222222]">
                Support Request Received
              </h3>
              <p className="text-xs text-[#717171] max-w-xs leading-relaxed">
                If an account exists for <strong className="text-[#222222]">{email}</strong>, our Support team will contact you directly to assist with password recovery.
              </p>
              <Link to="/login" className="w-full mt-2">
                <Button variant="outline" className="w-full py-2.5 text-xs font-bold">
                  Return to Login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#717171]">
                  Registered Email Address
                </label>
                <Input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="w-4 h-4 text-[#717171]" />}
                  className="text-xs py-2.5"
                />
              </div>

              <Button
                type="submit"
                className="w-full py-3 text-sm font-bold shadow-md hover:shadow-lg mt-1"
                rightIcon={<Send className="w-4 h-4" />}
              >
                Request Password Reset Assistance
              </Button>

              <div className="text-center pt-3 border-t border-[#DDDDDD]">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#FF385C] hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Login</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

