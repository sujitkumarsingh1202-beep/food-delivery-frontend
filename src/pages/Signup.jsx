import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, Lock, User, ArrowRight, Check, Sparkles } from 'lucide-react';

/**
 * Signup Component
 * Handles user registration with validation and error reporting.
 */
const Signup = () => {
  // 1. Unified form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // 2. Hooks
  const { signup } = useAuth();
  const navigate = useNavigate();

  // 3. Simple Client-side Validation
  const validateForm = () => {
    if (!formData.username.trim()) {
      toast.error('Username is required');
      return false;
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return false;
    }
    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return false;
    }
    return true;
  };

  // 4. Form Submission Handler
  const handleSubmit = async (e) => {
    // Prevent default form reload
    e.preventDefault();
    
    console.log('Signup form submitted:', formData);

    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // 5. Call Signup API via AuthContext
      // This sends { username, email, password } to match backend DTO
      const result = await signup(formData);
      
      if (result.success) {
        toast.success('Account created successfully! Please login.');
        navigate('/login');
      } else {
        // 6. Display error from backend (e.g. Email already exists)
        toast.error(result.message);
      }
    } catch (err) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 5. Input Change Helper
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    const pwd = formData.password;
    if (pwd.length === 0) return 0;
    if (pwd.length < 8) return 1;
    if (pwd.length < 12) return 2;
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return 3;
    return 3;
  };

  const strength = getPasswordStrength();
  const strengthColor = ['bg-slate-200', 'bg-red-500', 'bg-yellow-500', 'bg-green-500'];
  const strengthText = ['', 'Weak', 'Medium', 'Strong'];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden py-12">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-20 right-20 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Benefits */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
          <div>
            <h2 className="text-4xl font-black bg-gradient-to-r from-slate-800 to-primary-700 bg-clip-text text-transparent mb-4">
              Join FoodDash Today
            </h2>
            <p className="text-lg text-slate-600 font-medium">Get exclusive deals and fast food delivery at your fingertips</p>
          </div>

          {/* Benefits List */}
          <div className="space-y-5">
            <div className="flex items-start gap-4 group">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-1">Instant Account</h3>
                <p className="text-slate-600 text-sm">Create your account in seconds</p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-1">Exclusive Offers</h3>
                <p className="text-slate-600 text-sm">Get 30% off on your first order</p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-1">Personalized</h3>
                <p className="text-slate-600 text-sm">Tailored recommendations for you</p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="p-3 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all">
                <ArrowRight className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-1">Fast Delivery</h3>
                <p className="text-slate-600 text-sm">Hot meals delivered in 30 minutes</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-200">
            <div>
              <div className="text-3xl font-black text-primary-600">50K+</div>
              <p className="text-sm text-slate-600 font-medium">Happy Users</p>
            </div>
            <div>
              <div className="text-3xl font-black text-primary-600">4.8★</div>
              <p className="text-sm text-slate-600 font-medium">Average Rating</p>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="flex items-center justify-center animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
          <div className="w-full max-w-md">
            {/* Card */}
            <div className="bg-white/95 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-slate-200 relative overflow-hidden">
              {/* Gradient border effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-10">
                  <div className="inline-flex p-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg mb-6">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl font-black text-slate-800 mb-3">Create Account</h1>
                  <p className="text-slate-600 font-medium">Join our community of food lovers</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Username Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Username</label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/50 to-pink-500/50 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                        <input 
                          name="username"
                          type="text" 
                          value={formData.username}
                          onChange={handleChange}
                          placeholder="johndoe"
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-0 focus:border-primary-500 transition-all font-medium text-slate-800 placeholder-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/50 to-pink-500/50 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                        <input 
                          name="email"
                          type="email" 
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-0 focus:border-primary-500 transition-all font-medium text-slate-800 placeholder-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/50 to-pink-500/50 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                        <input 
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="At least 8 characters"
                          className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-0 focus:border-primary-500 transition-all font-medium text-slate-800 placeholder-slate-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                    </div>

                    {/* Password Strength Indicator */}
                    {formData.password.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex gap-1">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-all ${
                                i < strength ? strengthColor[strength] : 'bg-slate-200'
                              }`}
                            ></div>
                          ))}
                        </div>
                        <p className="text-xs text-slate-600 font-medium">
                          Strength: <span className={`font-bold ${strength === 3 ? 'text-green-600' : strength === 2 ? 'text-yellow-600' : 'text-red-600'}`}>{strengthText[strength]}</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Terms Checkbox */}
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="w-5 h-5 accent-primary-600 rounded cursor-pointer mt-0.5"
                    />
                    <span className="text-sm text-slate-600 font-medium group-hover:text-slate-800 transition-colors">
                      I agree to the{' '}
                      <Link to="/terms" className="text-primary-600 font-bold hover:underline">Terms and Conditions</Link>
                    </span>
                  </label>

                  {/* Signup Button */}
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full btn-gradient text-white font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 relative overflow-hidden group"
                  >
                    {/* Button shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500" style={{ transform: 'translateX(-100%)' }}></div>
                    
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="my-6 relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white text-slate-500 font-medium">or</span>
                  </div>
                </div>

                {/* Sign In Link */}
                <div className="text-center">
                  <p className="text-slate-600 font-medium mb-3">
                    Already have an account?
                  </p>
                  <Link 
                    to="/login" 
                    className="w-full py-4 px-4 border-2 border-primary-600 text-primary-600 font-bold rounded-2xl hover:bg-primary-50 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Privacy Badge */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
              <Lock className="w-4 h-4" />
              <span>Your data is encrypted and protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
