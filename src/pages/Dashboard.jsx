import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { ShoppingBag, Clock, MapPin, CreditCard, ChevronRight, User, XCircle, CheckCircle, Package } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // 2. DASHBOARD AUTO SWITCH (USER vs ADMIN)
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const endpoint = user?.role === 'ADMIN' ? '/orders' : '/orders/my';
      const response = await api.get(endpoint);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  // 3. ADMIN PANEL FEATURES (Update Status)
  const updateStatus = async (e, id, newStatus) => {
    e.stopPropagation();
    setUpdatingId(id);
    try {
      // API: PUT /api/orders/{id}/status?status=...
      await api.put(`/orders/${id}/status?status=${newStatus}`);
      toast.success(`Order marked as ${newStatus}`);
      fetchOrders(); // Refresh list
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  // 4. USER FEATURES (Cancel Order)
  const cancelOrder = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    setUpdatingId(id);
    try {
      await api.put(`/orders/${id}/cancel`);
      toast.success('Order cancelled');
      fetchOrders();
    } catch (error) {
      console.error('Cancel failed:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel');
    } finally {
      setUpdatingId(null);
    }
  };

  // 6. UI IMPROVEMENTS
  const getStatusStyles = (status) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-100 text-green-700 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'PREPARING': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const viewOrder = (order) => {
    alert(`Order Details:\n\nOrder ID: ${order.id}\nItems: ${order.items}\nTotal: ₹${order.totalAmount}\nAddress: ${order.deliveryAddress}\nStatus: ${order.status}\nDate: ${order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar */}
        <div className="w-full md:w-80 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 text-center">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-12 h-12 text-primary-600" />
            </div>
            <h2 className="text-2xl font-black text-slate-800">{user?.username}</h2>
            <div className={`inline-block mt-4 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${user?.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-500'}`}>
              {user?.role}
            </div>
          </div>

          {user?.role !== 'ADMIN' && (
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl">
              <h3 className="text-lg font-black mb-4">Saved Locations</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary-500 shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-sm">Default Delivery Address</p>
                    <p className="text-xs text-slate-400">Set during checkout</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-grow space-y-6">
          <h1 className="text-3xl font-black text-slate-800 mb-8 flex items-center">
            <ShoppingBag className="w-8 h-8 text-primary-600 mr-3" />
            {user?.role === 'ADMIN' ? 'All System Orders' : 'Your Orders'}
          </h1>

          {loading ? (
            <Loader />
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div 
                  key={order.id} 
                  onClick={() => viewOrder(order)}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-primary-100 transition-all group cursor-pointer"
                >
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                        <ShoppingBag className="w-8 h-8 text-slate-300 group-hover:text-primary-400" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 text-lg line-clamp-1">{order.items}</h4>
                        <div className="flex items-center text-slate-400 text-xs font-bold mt-1 uppercase tracking-tighter">
                          <Clock className="w-3 h-3 mr-1" />
                          {/* 5. FIX DATE ISSUE */}
                          {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
                        </div>
                        {user?.role === 'ADMIN' && (
                          <p className="text-[10px] font-bold text-slate-400 mt-1">User ID: {order.userId} | Order ID: #{order.id}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-slate-800 font-black text-lg">₹{order.totalAmount}</p>
                        <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest border ${getStatusStyles(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2">
                        {user?.role === 'ADMIN' ? (
                          <>
                            {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                              <>
                                <button 
                                  onClick={(e) => updateStatus(e, order.id, 'PREPARING')}
                                  disabled={updatingId === order.id}
                                  className="p-2.5 bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white rounded-xl transition-all"
                                  title="Mark Preparing"
                                >
                                  <Package className="w-5 h-5" />
                                </button>
                                <button 
                                  onClick={(e) => updateStatus(e, order.id, 'DELIVERED')}
                                  disabled={updatingId === order.id}
                                  className="p-2.5 bg-green-50 text-green-500 hover:bg-green-500 hover:text-white rounded-xl transition-all"
                                  title="Mark Delivered"
                                >
                                  <CheckCircle className="w-5 h-5" />
                                </button>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            {order.status === 'PENDING' && (
                              <button 
                                onClick={(e) => cancelOrder(e, order.id)}
                                disabled={updatingId === order.id}
                                className="p-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                                title="Cancel Order"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            )}
                          </>
                        )}
                      </div>

                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-600">No orders found</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
