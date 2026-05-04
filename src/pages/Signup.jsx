import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2, Check, Film, Bookmark, PlayCircle } from 'lucide-react';

const PasswordStrength = ({ password }) => {
  const checks = [
    { label: '8+ characters', pass: password.length >= 8 },
    { label: 'Uppercase letter', pass: /[A-Z]/.test(password) },
    { label: 'Number', pass: /[0-9]/.test(password) },
  ];
  const strength = checks.filter(c => c.pass).length;
  const colors = ['#e50914', '#f59e0b', '#22c55e'];
  const labels = ['Weak', 'Fair', 'Strong'];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{ background: i < strength ? colors[strength - 1] : 'rgba(255,255,255,0.08)' }} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {checks.map((check, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className={`w-3 h-3 rounded-full flex items-center justify-center transition-all`}
                style={{ background: check.pass ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${check.pass ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.1)'}` }}>
                {check.pass && <Check className="w-2 h-2 text-green-400" />}
              </div>
              <span className="text-xs" style={{ color: check.pass ? '#4ade80' : '#6b7280' }}>{check.label}</span>
            </div>
          ))}
        </div>
        {strength > 0 && (
          <span className="text-xs font-semibold" style={{ color: colors[strength - 1] }}>
            {labels[strength - 1]}
          </span>
        )}
      </div>
    </div>
  );
};

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify({ email: formData.email }));
      window.dispatchEvent(new Event('userChanged'));
      navigate('/dashboard');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #080810 0%, #0a0a14 100%)' }}>

      {/* Background orbs */}
      <div className="absolute top-10 right-20 w-72 h-72 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #e50914, transparent)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-10 left-20 w-64 h-64 rounded-full opacity-8 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent)', filter: 'blur(50px)' }} />

      <div className="w-full max-w-md relative z-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <span className="text-4xl font-black"
              style={{
                background: 'linear-gradient(135deg, #ff4444, #e50914, #b8070f)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 16px rgba(229,9,20,0.5))',
              }}>
              MyFlix
            </span>
          </Link>
          <p className="text-gray-500 text-sm mt-2">Join thousands of movie lovers</p>
        </div>

        {/* Card */}
        <div className="skeu-card p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-white mb-1">Create account</h1>
            <p className="text-gray-400 text-sm">Start streaming for free today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="text-gray-300 text-sm font-semibold mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="skeu-input w-full pl-11 pr-4 py-3.5 text-sm"
                  style={{ borderColor: errors.email ? 'rgba(229,9,20,0.5)' : undefined }}
                />
              </div>
              {errors.email && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                  <p className="text-red-400 text-xs">{errors.email}</p>
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-gray-300 text-sm font-semibold mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="skeu-input w-full pl-11 pr-12 py-3.5 text-sm"
                  style={{ borderColor: errors.password ? 'rgba(229,9,20,0.5)' : undefined }}
                />
                <button type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <PasswordStrength password={formData.password} />
              {errors.password && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                  <p className="text-red-400 text-xs">{errors.password}</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-gray-300 text-sm font-semibold mb-2 block">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="skeu-input w-full pl-11 pr-12 py-3.5 text-sm"
                  style={{ borderColor: errors.confirmPassword ? 'rgba(229,9,20,0.5)' : formData.confirmPassword && formData.password === formData.confirmPassword ? 'rgba(34,197,94,0.4)' : undefined }}
                />
                <button type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <div className="absolute right-10 top-1/2 -translate-y-1/2">
                    <Check className="w-4 h-4 text-green-400" />
                  </div>
                )}
              </div>
              {errors.confirmPassword && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                  <p className="text-red-400 text-xs">{errors.confirmPassword}</p>
                </div>
              )}
            </div>

            {/* Terms */}
            <p className="text-gray-600 text-xs leading-relaxed">
              By creating an account, you agree to our{' '}
              <span className="text-red-400 cursor-pointer hover:text-red-300">Terms of Service</span>
              {' '}and{' '}
              <span className="text-red-400 cursor-pointer hover:text-red-300">Privacy Policy</span>
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="skeu-btn w-full py-4 rounded-xl text-white font-bold text-base flex items-center justify-center gap-3 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Free Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <span className="text-gray-600 text-xs uppercase tracking-wider">or</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flat-btn flex items-center justify-center gap-2 py-3 rounded-xl text-gray-300 text-sm font-medium hover:text-white transition-all">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>
            <button className="flat-btn flex items-center justify-center gap-2 py-3 rounded-xl text-gray-300 text-sm font-medium hover:text-white transition-all">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
          </div>

          {/* Login link */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-red-400 hover:text-red-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* Perks */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { icon: Film, label: 'Movies & TV' },
            { icon: Bookmark, label: 'Watchlist' },
            { icon: PlayCircle, label: 'Continue Watching' },
          ].map(({ icon: Icon, label }, i) => (
            <div key={i} className="flat-card p-3 text-center">
              <Icon className="w-4 h-4 text-red-400 mx-auto mb-1" />
              <span className="text-gray-500 text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Signup;
