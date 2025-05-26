import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSignup = async () => {
    // Clear previous errors
    setErrors({});
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call for signup (replace with actual API call)
      // Example: await api.signup({ email, password });
      localStorage.setItem('user', JSON.stringify({ email: formData.email }));
      // In a real app, avoid storing sensitive data in localStorage
      // Instead, store a token or user ID returned from the server
      setTimeout(() => {
        // Simulate async operation
        navigate('/');
      }, 1500);
    } catch (error) {
      setErrors({ general: 'Signup failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="relative bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700 transform transition-all hover:scale-[1.01]">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-purple-600 rounded-t-2xl"></div>
        <div className="absolute -top-2 -right-2 w-16 h-16 bg-red-600 rounded-full blur-xl opacity-20"></div>
        <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-purple-600 rounded-full blur-xl opacity-20"></div>

        <div className="flex justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
          </svg>
        </div>

        <h2 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-red-400 to-purple-500 bg-clip-text text-transparent">
          Create Your Account
        </h2>
        <p className="text-gray-400 text-center mb-8">Please enter your details</p>

        <div className="space-y-6">
          {errors.general && (
            <p className="text-red-400 text-sm text-center">{errors.general}</p>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              className={`w-full p-3 rounded-lg bg-gray-700 border ${errors.email ? 'border-red-500' : 'border-gray-600'} focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all outline-none`}
              value={formData.email}
              onChange={handleInputChange}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-red-400 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              className={`w-full p-3 rounded-lg bg-gray-700 border ${errors.password ? 'border-red-500' : 'border-gray-600'} focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all outline-none`}
              value={formData.password}
              onChange={handleInputChange}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            {errors.password && (
              <p id="password-error" className="text-red-400 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              className={`w-full p-3 rounded-lg bg-gray-700 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-600'} focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all outline-none`}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
            />
            {errors.confirmPassword && (
              <p id="confirmPassword-error" className="text-red-400 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleSignup}
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
              isLoading
                ? 'bg-red-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 shadow-lg hover:shadow-red-500/20'
            }`}
          >
            {isLoading ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>

          <div className="relative flex items-center my-6">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="flex-shrink mx-4 text-gray-400">or</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z"/>
              </svg>
              LinkedIn
            </button>
            <button className="flex items-center justify-center py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div>

          <p className="text-center text-gray-400 text-sm">
            Already have an account?{' '}
            <a href="/login" className="text-red-400 hover:text-red-300 font-medium transition-all">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;