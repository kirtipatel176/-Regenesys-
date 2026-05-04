import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = login(form.email, form.password);
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

      {/* Right Panel — Login Form */}
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

          <h1 className="text-[28px] lg:text-[32px] font-bold text-regenesys-navy mb-2">Welcome back</h1>
          <p className="text-regenesys-muted text-[14px] mb-8">Sign in to access your Enterprise AI workspace.</p>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-[13px] px-4 py-3 rounded-xl mb-6">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="Enter your password"
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
              className="w-full py-3.5 bg-regenesys-purple text-white rounded-xl font-bold text-[14px] hover:bg-regenesys-purple-dark transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setForm({ email: 'admin@regenesys.com', password: 'admin123' });
                setTimeout(() => document.querySelector('form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })), 100);
              }}
              className="w-full py-3.5 bg-white border border-gray-200 text-regenesys-navy rounded-xl font-bold text-[14px] hover:bg-gray-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Quick Test Access (Admin)
            </button>
          </form>

          <p className="text-center text-[13px] text-regenesys-muted mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-regenesys-purple font-bold hover:underline">Create Account</Link>
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

export default Login;
