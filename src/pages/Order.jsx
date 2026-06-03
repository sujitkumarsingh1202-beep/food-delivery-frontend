import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MapComponent from '../components/MapComponent';
import { ShoppingBag, ChevronLeft, MapPin, Info, CreditCard } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Order = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const food = state?.food;

  if (!food) {
    navigate('/');
    return null;
  }

  const handlePlaceOrder = () => {
    if (!location) {
      toast.error('Please select a delivery location');
      return;
    }
    setLoading(true);
    // In a real app, you might save the order here or pass to payment
    setTimeout(() => {
      setLoading(false);
      navigate('/payment', { state: { food, location } });
    }, 800);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-slate-500 hover:text-primary-600 font-bold mb-8 transition-colors group"
      >
        <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
        Back to Menu
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Food Details & Map */}
        <div className="lg:col-span-2 space-y-10">
          {/* Food Details Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden">
              <img 
                src={food.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=500'} 
                alt={food.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-black text-slate-800 mb-2">{food.name}</h1>
                  <p className="text-slate-500 font-medium leading-relaxed">{food.description}</p>
                </div>
                <p className="text-2xl font-black text-primary-600">₹{food.price}</p>
              </div>
              
              <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap gap-4">
                <div className="flex items-center text-slate-600 text-sm font-bold bg-slate-50 px-3 py-1.5 rounded-lg">
                  <Info className="w-4 h-4 mr-2 text-primary-500" />
                  Preparation: 20-30 mins
                </div>
                <div className="flex items-center text-slate-600 text-sm font-bold bg-slate-50 px-3 py-1.5 rounded-lg">
                  <Info className="w-4 h-4 mr-2 text-primary-500" />
                  Free Delivery
                </div>
              </div>
            </div>
          </div>

          {/* Map Selection */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <MapComponent onLocationSelect={(loc) => setLocation(loc)} />
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-24">
            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center">
              <ShoppingBag className="w-6 h-6 text-primary-600 mr-2" />
              Order Summary
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Subtotal</span>
                <span>₹{food.price}</span>
              </div>
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Delivery Fee</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-slate-600 font-medium">
                <span>GST (5%)</span>
                <span>₹{(food.price * 0.05).toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-lg font-black text-slate-800">Total Amount</span>
                <span className="text-2xl font-black text-primary-600">₹{(food.price * 1.05).toFixed(2)}</span>
              </div>
            </div>

            {location && (
              <div className="mb-8 p-4 bg-primary-50 rounded-2xl border border-primary-100 animate-in zoom-in-95">
                <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-1">Delivering To</p>
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 text-primary-600 mr-2 mt-0.5 shrink-0" />
                  <p className="text-slate-700 text-sm font-bold line-clamp-2">{location.address}</p>
                </div>
              </div>
            )}

            <button 
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg active:scale-95 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Proceed to Payment</span>
                </>
              )}
            </button>
            
            <p className="text-center text-slate-400 text-xs mt-4 font-medium italic">
              Secure Checkout • 256-bit SSL Encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
