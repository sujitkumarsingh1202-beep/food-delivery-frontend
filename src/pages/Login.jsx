import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, Lock, ArrowRight, User, Zap, Shield } from 'lucide-react';

/**
 * Login Component
 * Handles user authentication and redirects to dashboard on success.
 */
const Login = () => {
  // 1. State for form fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 2. Hooks for Auth and Navigation
  const { login } = useAuth();
  const navigate = useNavigate();

  // 3. Form Submission Handler
  const handleSubmit = async (e) => {
    // Prevent default form reload
    e.preventDefault();
    
    console.log('Login form submitted');

    // Basic Validation
    if (!username || !password) {
      toast.error('Please enter both username and password');
      return;
    }

    setLoading(true);
    
    try {
      // 4. Call Login API via AuthContext
      const result = await login(username, password);
      
      if (result.success) {
        toast.success('Login Successful! Welcome back.');
        console.log('Navigating to dashboard...');
        // 5. Redirect to Dashboard
        navigate('/dashboard');
      } else {
        // 6. Handle specific error messages from backend
        toast.error(result.message);
        console.error('Login failed:', result.message);
      }
    } catch (err) {
      toast.error('An unexpected error occurred. Please try again.');
      console.error('Unexpected login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-20 left-20 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Features */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
          <div>
            <h2 className="text-4xl font-black bg-gradient-to-r from-slate-800 to-primary-700 bg-clip-text text-transparent mb-4">
              Welcome to FoodDash
            </h2>
            <p className="text-lg text-slate-600 font-medium">Sign in to unlock amazing deals and fast delivery</p>
          </div>

          {/* Features List */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-1">Lightning Fast</h3>
                <p className="text-slate-600 text-sm">Delivery in 30 minutes or less</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-1">100% Secure</h3>
                <p className="text-slate-600 text-sm">Your data is protected with encryption</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-1">Easy Login</h3>
                <p className="text-slate-600 text-sm">Sign in with your username and password</p>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-600 font-semibold mb-3">Trusted by 50,000+ customers</p>
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 opacity-70 shadow-lg"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
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
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl font-black text-slate-800 mb-3">Welcome Back!</h1>
                  <p className="text-slate-600 font-medium">Sign in to order delicious food</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Username Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Username</label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/50 to-pink-500/50 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                        <input 
                          type="text" 
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Enter your username"
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-0 focus:border-primary-500 transition-all font-medium text-slate-800 placeholder-slate-400"
                          autoComplete="username"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/50 to-pink-500/50 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                        <input 
                          type={showPassword ? 'text' : 'password'} 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-0 focus:border-primary-500 transition-all font-medium text-slate-800 placeholder-slate-400"
                          autoComplete="current-password"
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
                  </div>

                  {/* Remember & Forgot */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 accent-primary-600 rounded cursor-pointer"
                      />
                      <span className="text-sm text-slate-600 font-medium">Remember me</span>
                    </label>
                    <Link to="/forgot" className="text-sm text-primary-600 font-bold hover:text-primary-700 transition-colors">
                      Forgot Password?
                    </Link>
                  </div>

                  {/* Login Button */}
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
                        <span>Sign In</span>
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

                {/* Sign Up Link */}
                <div className="text-center">
                  <p className="text-slate-600 font-medium mb-3">
                    Don't have an account?{' '}
                  </p>
                  <Link 
                    to="/signup" 
                    className="w-full py-4 px-4 border-2 border-primary-600 text-primary-600 font-bold rounded-2xl hover:bg-primary-50 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    Create Account
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
              <Shield className="w-4 h-4" />
              <span>Your login is secured with 256-bit encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
