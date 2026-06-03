import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { CreditCard, Smartphone, Banknote, CheckCircle2, ChevronLeft, ArrowRight, ShieldCheck } from 'lucide-react';

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const food = state?.food;
  const location = state?.location;

  if (!food || !location) {
    navigate('/');
    return null;
  }

  const handlePayment = async () => {
    if (paymentMethod === 'UPI' && !upiId) {
      toast.error('Please enter UPI ID');
      return;
    }
    if (paymentMethod === 'CARD' && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvc)) {
      toast.error('Please fill in card details');
      return;
    }

    setLoading(true);
    try {
      // 1. Place the order
      const orderData = {
        items: `1x ${food.name}`, // Backend expects a string for items
        totalAmount: food.price * 1.05,
        deliveryAddress: location.address,
        locationId: location.id // This is the ID returned from POST /location
      };

      const orderResponse = await api.post('/orders', orderData);
      const savedOrder = orderResponse.data;
      
      // 2. Process the payment
      const paymentRequest = {
        orderId: savedOrder.id,
        paymentMethod: paymentMethod,
        amount: savedOrder.totalAmount
      };

      await api.post('/payment', paymentRequest);
      
      // Simulate transaction ID for UI
      setTransactionId('TXN' + Math.random().toString(36).substr(2, 9).toUpperCase());
      setSuccess(true);
      toast.success('Payment successful!');
    } catch (error) {
      console.error('Payment/Order error:', error);
      toast.error(error.response?.data?.message || 'Order placement failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 max-w-lg w-full text-center animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 mb-2">Order Confirmed!</h1>
          <p className="text-slate-500 font-medium mb-8">Your food is being prepared and will be delivered shortly.</p>
          
          <div className="bg-slate-50 rounded-3xl p-6 text-left space-y-4 mb-10 border border-slate-100">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold text-xs uppercase">Transaction ID</span>
              <span className="text-slate-700 font-mono font-bold">{transactionId}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-200/60">
              <span className="text-slate-400 font-bold text-xs uppercase">Order For</span>
              <span className="text-slate-800 font-bold">{food.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold text-xs uppercase">Amount Paid</span>
              <span className="text-primary-600 font-black">₹{(food.price * 1.05).toFixed(2)}</span>
            </div>
          </div>

          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl transition-all hover:bg-slate-800 active:scale-95 shadow-xl shadow-slate-200"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-slate-500 hover:text-primary-600 font-bold mb-8 transition-colors group"
      >
        <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
        Order Details
      </button>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Payment Selection */}
        <div className="md:col-span-3 space-y-8">
          <h1 className="text-3xl font-black text-slate-800">Select Payment</h1>
          
          <div className="space-y-4">
            <label 
              className={`flex items-center p-5 rounded-3xl border-2 transition-all cursor-pointer ${
                paymentMethod === 'UPI' ? 'border-primary-600 bg-primary-50 shadow-md' : 'border-slate-100 bg-white hover:border-slate-200'
              }`}
            >
              <input type="radio" className="hidden" checked={paymentMethod === 'UPI'} onChange={() => setPaymentMethod('UPI')} />
              <div className={`p-3 rounded-2xl mr-4 ${paymentMethod === 'UPI' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                <Smartphone className="w-6 h-6" />
              </div>
              <div className="flex-grow">
                <p className="font-black text-slate-800">UPI / GPay / PhonePe</p>
                <p className="text-xs text-slate-500 font-medium">Pay instantly using your UPI ID</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'UPI' ? 'border-primary-600' : 'border-slate-300'}`}>
                {paymentMethod === 'UPI' && <div className="w-3 h-3 bg-primary-600 rounded-full"></div>}
              </div>
            </label>

            {paymentMethod === 'UPI' && (
              <div className="ml-5 p-6 bg-white rounded-3xl border border-primary-200 animate-in slide-in-from-top-2">
                <input 
                  type="text" 
                  placeholder="Enter your UPI ID (e.g. user@okaxis)"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-medium"
                />
              </div>
            )}

            <label 
              className={`flex items-center p-5 rounded-3xl border-2 transition-all cursor-pointer ${
                paymentMethod === 'CARD' ? 'border-primary-600 bg-primary-50 shadow-md' : 'border-slate-100 bg-white hover:border-slate-200'
              }`}
            >
              <input type="radio" className="hidden" checked={paymentMethod === 'CARD'} onChange={() => setPaymentMethod('CARD')} />
              <div className={`p-3 rounded-2xl mr-4 ${paymentMethod === 'CARD' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                <CreditCard className="w-6 h-6" />
              </div>
              <div className="flex-grow">
                <p className="font-black text-slate-800">Credit / Debit Card</p>
                <p className="text-xs text-slate-500 font-medium">All major cards supported</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'CARD' ? 'border-primary-600' : 'border-slate-300'}`}>
                {paymentMethod === 'CARD' && <div className="w-3 h-3 bg-primary-600 rounded-full"></div>}
              </div>
            </label>

            {paymentMethod === 'CARD' && (
              <div className="ml-5 p-6 bg-white rounded-3xl border border-primary-200 animate-in slide-in-from-top-2 space-y-4">
                <input 
                  type="text" 
                  placeholder="Card Number"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-medium"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-medium"
                  />
                  <input 
                    type="text" 
                    placeholder="CVV"
                    value={cardDetails.cvc}
                    onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-medium"
                  />
                </div>
              </div>
            )}

            <label 
              className={`flex items-center p-5 rounded-3xl border-2 transition-all cursor-pointer ${
                paymentMethod === 'COD' ? 'border-primary-600 bg-primary-50 shadow-md' : 'border-slate-100 bg-white hover:border-slate-200'
              }`}
            >
              <input type="radio" className="hidden" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
              <div className={`p-3 rounded-2xl mr-4 ${paymentMethod === 'COD' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                <Banknote className="w-6 h-6" />
              </div>
              <div className="flex-grow">
                <p className="font-black text-slate-800">Cash on Delivery</p>
                <p className="text-xs text-slate-500 font-medium">Pay when your food arrives</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'COD' ? 'border-primary-600' : 'border-slate-300'}`}>
                {paymentMethod === 'COD' && <div className="w-3 h-3 bg-primary-600 rounded-full"></div>}
              </div>
            </label>
          </div>
        </div>

        {/* Amount Summary */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200 border border-slate-100 sticky top-24">
            <h2 className="text-xl font-black text-slate-800 mb-8">Payment Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-slate-500 font-bold text-sm">
                <span>Grand Total</span>
                <span className="text-2xl font-black text-slate-900">₹{(food.price * 1.05).toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl mb-8 border border-slate-100">
              <div className="flex items-center text-green-600 font-bold text-xs mb-2">
                <ShieldCheck className="w-4 h-4 mr-1" />
                SECURE TRANSACTION
              </div>
              <p className="text-slate-500 text-xs font-medium">Your payment details are encrypted and never stored on our servers.</p>
            </div>

            <button 
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-black py-4 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-xl shadow-primary-200 active:scale-95 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Pay Now</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
