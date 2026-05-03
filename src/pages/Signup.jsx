import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, ArrowRight, ShieldCheck, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = signup(form.name, form.email, form.password);
      setLoading(false);
      if (result.success) {
        navigate('/private-gpt');
      } else {
        setError(result.error);
      }
    }, 600);
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

      {/* Right Panel — Signup Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[420px]"
        >
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ffcc00] to-[#008444] flex items-center justify-center text-white font-black text-sm shadow-lg">R</div>
              <span className="text-[14px] font-head font-bold text-regenesys-navy uppercase">Regenesys</span>
            </Link>
          </div>

          <h1 className="text-[28px] lg:text-[32px] font-bold text-regenesys-navy mb-2">Create your account</h1>
          <p className="text-regenesys-muted text-[14px] mb-8">Get started with Regenesys Enterprise AI.</p>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-[13px] px-4 py-3 rounded-xl mb-6">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Min 6 characters"
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
              <input
                type="password"
                value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Re-enter your password"
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-[14px] outline-none focus:border-regenesys-purple focus:ring-2 focus:ring-regenesys-purple/10 transition-all placeholder:text-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-regenesys-purple text-white rounded-xl font-bold text-[14px] hover:bg-regenesys-purple-dark transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create Account <UserPlus size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-[13px] text-regenesys-muted mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-regenesys-purple font-bold hover:underline">Sign In</Link>
          </p>

          <div className="mt-10 pt-6 border-t border-gray-100 text-center">
            <Link to="/" className="text-[12px] text-regenesys-muted hover:text-regenesys-navy transition-colors">
              ← Back to Regenesys Corporate Education
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
