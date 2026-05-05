
import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const maskEmail = (email) => {
  if (!email) return '';
  const [user, domain] = email.split('@');
  return `${user[0]}...@${domain}`;
};


// Utility to simulate network delay
const delay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

const Signup = () => {
  const { signup, checkEmail, verifyOTP, login } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1); // 1: Details, 2: OTP
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const otpRefs = useRef([]);

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(form.password)) {
      setError('Password must be at least 8 characters and include 1 uppercase letter, 1 number, and 1 special character.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Check if email already exists
    const exists = await checkEmail(form.email);
    if (exists) {
      setError('An account with this email already exists. Please log in.');
      return;
    }

    setLoading(true);
    
    // Call the real backend register endpoint (this sends OTP)
    const result = await signup(form.name, form.email, form.password);
    
    setLoading(false);
    
    if (result.success) {
      setStep(2);
      setOtpSent(true);
      // Auto-hide success message after 5s
      setTimeout(() => setOtpSent(false), 5000);
    } else {
      setError(result.error || 'Registration failed.');
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (value !== '' && !/^\d+$/.test(value)) return;
    
    const newOtp = [...otp];
    // Take only the last entered character to handle fast typing/paste
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    if (!pastedData || isNaN(pastedData)) return;

    const digits = pastedData.split('').slice(0, 6);
    const newOtp = [...otp];
    digits.forEach((digit, i) => {
      newOtp[i] = digit;
    });
    setOtp(newOtp);

    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex(val => val === '');
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    otpRefs.current[focusIndex]?.focus();
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setError('Please enter the complete 6-digit code.');
      return;
    }

    setLoading(true);
    try {
      // 1. Verify OTP with the backend
      const verifyResult = await verifyOTP(form.email, otpCode);
      
      if (!verifyResult.success) {
        setLoading(false);
        setError(verifyResult.error || 'Invalid OTP. Please try again.');
        return;
      }

      // 2. Once verified, log the user in to get the JWT token
      const loginResult = await login(form.email, form.password);
      
      setLoading(false);
      if (loginResult.success) {
        if (form.email === 'admin@regenesys.com') {
          navigate('/private-gpt');
        } else {
          navigate('/');
        }
      } else {
        setError(loginResult.error || 'Login failed after verification. Please log in manually.');
      }
    } catch (err) {
      setLoading(false);
      setError('Verification failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-[480px] bg-regenesys-navy relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 mb-20">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ffcc00] to-[#008444] flex items-center justify-center text-white font-black text-lg shadow-lg">R</div>
            <div>
              <div className="text-[15px] font-head font-bold text-white tracking-tight uppercase">Regenesys</div>
              <div className="text-[8px] font-mono text-white/40 font-bold tracking-[0.15em] uppercase">Corporate Education</div>
            </div>
          </Link>

          <h2 className="font-head text-[32px] text-white font-bold leading-tight mb-6">
            Join the Enterprise<br />AI Platform
          </h2>
          <p className="text-white/40 text-[14px] leading-relaxed max-w-[320px]">
            Create your account to start querying your organisation's private knowledge base with AI-powered insights.
          </p>

          <div className="mt-12 space-y-4">
            {[
              "Upload & index private documents",
              "Context-aware AI responses",
              "Conversation history & notebooks",
              "Enterprise-grade security"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-white/40 text-[13px]">
                <div className="w-1.5 h-1.5 rounded-full bg-regenesys-gold shrink-0" />
                {feature}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.06] rounded-xl px-5 py-4">
            <ShieldCheck size={20} className="text-regenesys-gold shrink-0" />
            <div className="text-[11px] text-white/50 leading-relaxed">
              SOC2 compliant. All data encrypted at rest and in transit.
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Multi-step Signup Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div 
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full max-w-[420px]"
          >
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center gap-3 mb-10">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ffcc00] to-[#008444] flex items-center justify-center text-white font-black text-sm shadow-lg">R</div>
                <span className="text-[14px] font-head font-bold text-regenesys-navy uppercase">Regenesys</span>
              </Link>
            </div>

            {/* Form Headers */}
            {step === 1 ? (
              <>
                <h1 className="text-[28px] lg:text-[32px] font-bold text-regenesys-navy mb-2">Create your account</h1>
                <p className="text-regenesys-muted text-[14px] mb-8">Get started with Regenesys Enterprise AI.</p>
              </>
            ) : (
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-regenesys-purple/10 text-regenesys-purple rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail size={28} />
                </div>
                <h1 className="text-[28px] lg:text-[32px] font-bold text-regenesys-navy mb-3">Verify your email</h1>
                <p className="text-regenesys-muted text-[14px]">
                  We've sent a 6-digit verification code to<br />
                  <span className="font-bold text-regenesys-navy">{maskEmail(form.email)}</span>
                </p>
                
                <AnimatePresence>
                  {otpSent && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="mt-4 bg-green-50 border border-green-100 text-green-700 text-[12px] px-4 py-2 rounded-lg inline-flex items-center gap-2"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      OTP sent successfully! (Demo Mode)
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-100 text-red-600 text-[13px] px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Forms */}
            {step === 1 ? (
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div>
                  <label className="text-[12px] font-bold text-regenesys-navy/70 uppercase tracking-wider mb-2 block">Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-[14px] outline-none focus:border-regenesys-purple focus:ring-2 focus:ring-regenesys-purple/10 transition-all placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="text-[12px] font-bold text-regenesys-navy/70 uppercase tracking-wider mb-2 block">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="you@company.com"
                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-[14px] outline-none focus:border-regenesys-purple focus:ring-2 focus:ring-regenesys-purple/10 transition-all placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="text-[12px] font-bold text-regenesys-navy/70 uppercase tracking-wider mb-2 block">Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      placeholder="e.g. Pass@1234 (Min 8 chars)"
                      className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-[14px] outline-none focus:border-regenesys-purple focus:ring-2 focus:ring-regenesys-purple/10 transition-all placeholder:text-gray-400 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[12px] font-bold text-regenesys-navy/70 uppercase tracking-wider mb-2 block">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={form.confirmPassword}
                      onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                      placeholder="Re-enter your password"
                      className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-[14px] outline-none focus:border-regenesys-purple focus:ring-2 focus:ring-regenesys-purple/10 transition-all placeholder:text-gray-400 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-regenesys-purple text-white rounded-xl font-bold text-[14px] hover:bg-regenesys-purple-dark transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 shadow-lg shadow-regenesys-purple/20"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Continue <ArrowRight size={16} /></>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-8">
                <div className="flex justify-between gap-2 sm:gap-3">
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      ref={el => otpRefs.current[index] = el}
                      value={data}
                      onChange={e => handleOtpChange(e, index)}
                      onKeyDown={e => handleOtpKeyDown(e, index)}
                      onPaste={handleOtpPaste}
                      className="w-12 h-14 sm:w-14 sm:h-16 text-center text-[22px] font-black bg-white border border-gray-200 rounded-xl outline-none focus:border-regenesys-purple focus:ring-2 focus:ring-regenesys-purple/10 transition-all text-regenesys-navy shadow-sm"
                    />
                  ))}
                </div>

                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={loading || otp.join('').length < 6}
                    className="w-full py-3.5 bg-regenesys-purple text-white rounded-xl font-bold text-[14px] hover:bg-regenesys-purple-dark transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-regenesys-purple/20"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Verify & Create Account <ShieldCheck size={16} /></>
                    )}
                  </button>

                  <button 
                    type="button" 
                    onClick={() => { setStep(1); setOtp(new Array(6).fill('')); setError(''); }}
                    className="w-full py-3 text-[13px] font-bold text-gray-500 hover:text-regenesys-navy transition-colors flex items-center justify-center gap-1.5"
                  >
                    ← Back to edit details
                  </button>
                </div>
              </form>
            )}

            {step === 1 && (
              <>
                <p className="text-center text-[13px] text-regenesys-muted mt-8">
                  Already have an account?{' '}
                  <Link to="/login" className="text-regenesys-purple font-bold hover:underline">Sign In</Link>
                </p>

                <div className="mt-10 pt-6 border-t border-gray-100 text-center">
                  <Link to="/" className="text-[12px] text-regenesys-muted hover:text-regenesys-navy transition-colors">
                    ← Back to Regenesys Corporate Education
                  </Link>
                </div>
              </>
            )}

            {step === 2 && (
              <p className="text-center text-[13px] text-regenesys-muted mt-8">
                Didn't receive the code?{' '}
                <button 
                  type="button" 
                  onClick={() => {
                    setOtpSent(true);
                    setTimeout(() => setOtpSent(false), 5000);
                  }}
                  className="text-regenesys-purple font-bold hover:underline"
                >
                  Resend Code
                </button>
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Signup;
