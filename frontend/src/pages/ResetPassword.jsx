import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email') || location.state?.email || 'your account';

  // Password Validation State
  const [validation, setValidation] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false
  });

  // Watch password changes to update validation UI
  useEffect(() => {
    setValidation({
      length: form.password.length >= 8,
      uppercase: /[A-Z]/.test(form.password),
      number: /[0-9]/.test(form.password),
      special: /[^A-Za-z0-9]/.test(form.password)
    });
  }, [form.password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Check all validation criteria
    const isStrong = validation.length && validation.uppercase && validation.number && validation.special;

    if (!form.password || !form.confirmPassword) {
      setError('Please fill in both password fields.');
      return;
    }

    if (!isStrong) {
      setError('Please ensure your password meets all requirements.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }

    setLoading(true);
    // Simulate API call to reset password
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }, 1500);
  };

  const metCount = Object.values(validation).filter(Boolean).length;

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
            Enterprise AI<br />Knowledge Platform
          </h2>
          <p className="text-white/40 text-[14px] leading-relaxed max-w-[320px]">
            Access your organisation's private AI assistant. Query internal documents, get context-aware insights, and accelerate decision-making.
          </p>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.06] rounded-xl px-5 py-4">
            <ShieldCheck size={20} className="text-regenesys-gold shrink-0" />
            <div className="text-[11px] text-white/50 leading-relaxed">
              End-to-end encrypted. Your data never leaves your organisation's secure environment.
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Reset Password Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[420px] py-10"
        >
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ffcc00] to-[#008444] flex items-center justify-center text-white font-black text-sm shadow-lg">R</div>
              <span className="text-[14px] font-head font-bold text-regenesys-navy uppercase">Regenesys</span>
            </Link>
          </div>

          <h1 className="text-[28px] lg:text-[32px] font-bold text-regenesys-navy mb-2">Reset Password</h1>
          <p className="text-regenesys-muted text-[14px] mb-8">
            Create a new, strong password for {email}.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-[13px] px-4 py-3 rounded-xl mb-6">{error}</div>
          )}

          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-100 rounded-xl p-6 flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-green-800 font-bold mb-2">Password Reset Successful</h3>
              <p className="text-green-600/80 text-[14px]">
                Your password has been successfully updated. You can now sign in with your new password.
              </p>
              <p className="text-green-600/60 text-[12px] mt-4">
                Redirecting to sign in...
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-[12px] font-bold text-regenesys-navy/70 uppercase tracking-wider mb-2 block">New Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="Enter new password"
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

              {/* Password Requirements */}
              <div className="bg-gray-50/50 rounded-xl p-5 border border-gray-100 space-y-4">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[12px] font-bold text-regenesys-navy">Password strength</p>
                  <span className={`text-[12px] font-bold ${metCount === 4 ? 'text-green-600' : metCount >= 2 ? 'text-orange-500' : 'text-gray-500'}`}>
                    {metCount === 0 ? 'None' : metCount === 4 ? 'Strong' : metCount >= 2 ? 'Fair' : 'Weak'}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden flex gap-1">
                  <div className={`h-full transition-all duration-300 ${metCount >= 1 ? (metCount === 4 ? 'bg-green-500' : metCount >= 2 ? 'bg-orange-500' : 'bg-red-500') : 'bg-transparent'} w-1/4 rounded-full`} />
                  <div className={`h-full transition-all duration-300 ${metCount >= 2 ? (metCount === 4 ? 'bg-green-500' : 'bg-orange-500') : 'bg-transparent'} w-1/4 rounded-full`} />
                  <div className={`h-full transition-all duration-300 ${metCount >= 3 ? (metCount === 4 ? 'bg-green-500' : 'bg-yellow-500') : 'bg-transparent'} w-1/4 rounded-full`} />
                  <div className={`h-full transition-all duration-300 ${metCount >= 4 ? 'bg-green-500' : 'bg-transparent'} w-1/4 rounded-full`} />
                </div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-4 pt-2">
                  <div className={`text-[12px] flex items-center gap-2 transition-colors ${validation.length ? 'text-green-600' : 'text-regenesys-muted'}`}>
                    <CheckCircle2 size={14} className={validation.length ? 'opacity-100' : 'opacity-30'} />
                    <span>8+ characters</span>
                  </div>
                  <div className={`text-[12px] flex items-center gap-2 transition-colors ${validation.uppercase ? 'text-green-600' : 'text-regenesys-muted'}`}>
                    <CheckCircle2 size={14} className={validation.uppercase ? 'opacity-100' : 'opacity-30'} />
                    <span>1 uppercase</span>
                  </div>
                  <div className={`text-[12px] flex items-center gap-2 transition-colors ${validation.number ? 'text-green-600' : 'text-regenesys-muted'}`}>
                    <CheckCircle2 size={14} className={validation.number ? 'opacity-100' : 'opacity-30'} />
                    <span>1 number</span>
                  </div>
                  <div className={`text-[12px] flex items-center gap-2 transition-colors ${validation.special ? 'text-green-600' : 'text-regenesys-muted'}`}>
                    <CheckCircle2 size={14} className={validation.special ? 'opacity-100' : 'opacity-30'} />
                    <span>1 special char</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[12px] font-bold text-regenesys-navy/70 uppercase tracking-wider mb-2 block">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                    placeholder="Re-enter new password"
                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-[14px] outline-none focus:border-regenesys-purple focus:ring-2 focus:ring-regenesys-purple/10 transition-all placeholder:text-gray-400 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-regenesys-purple text-white rounded-xl font-bold text-[14px] hover:bg-regenesys-purple-dark transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Reset Password <ArrowRight size={16} /></>
                )}
              </button>
            </form>
          )}

          <div className="mt-10 pt-6 border-t border-gray-100 text-center">
            <Link to="/login" className="text-[13px] font-bold text-regenesys-navy hover:text-regenesys-purple transition-colors">
              ← Back to Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
