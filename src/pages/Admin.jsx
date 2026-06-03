import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Loader from '../components/Loader';
import { Plus, Trash2, Edit, ShoppingBag, Utensils, IndianRupee, Image as ImageIcon, Save, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Admin = () => {
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('foods');
  const [showAddForm, setShowAddForm] = useState(false);

  const [newFood, setNewFood] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: 'Fast Food'
  });

  // Edit food state
  const [editFood, setEditFood] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [foodsRes, ordersRes] = await Promise.all([
        api.get('/foods'),
        api.get('/orders')
      ]);
      setFoods(foodsRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    try {
      await api.post('/foods', newFood);
      toast.success('Food item added!');
      setShowAddForm(false);
      setNewFood({ name: '', description: '', price: '', imageUrl: '', category: 'Fast Food' });
      fetchData();
    } catch (error) {
      toast.error('Failed to add food');
    }
  };

  // Delete food
  const deleteFood = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/foods/${id}`);
        toast.success('Food deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  // Update food
  const updateFood = async () => {
    try {
      await api.put(`/foods/${editFood.id}`, editFood);
      toast.success('Updated successfully');
      setEditFood(null);
      fetchData();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800">Admin Panel</h1>
          <p className="text-slate-500 font-medium">Manage your restaurant and orders</p>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <button 
            onClick={() => setActiveTab('foods')}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'foods' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Manage Food
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'orders' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            All Orders
          </button>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : activeTab === 'foods' ? (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-slate-800 flex items-center">
              <Utensils className="w-6 h-6 mr-2 text-primary-600" />
              Menu Items
            </h2>
            <button 
              onClick={() => setShowAddForm(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-2xl flex items-center space-x-2 transition-all active:scale-95 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Dish</span>
            </button>
          </div>

          {showAddForm && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
              <div className="bg-white rounded-[2.5rem] p-8 max-w-xl w-full shadow-2xl animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-slate-800">New Food Item</h3>
                  <button onClick={() => setShowAddForm(false)} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddFood} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-600 ml-1">Dish Name</label>
                      <input 
                        type="text" 
                        required
                        value={newFood.name}
                        onChange={(e) => setNewFood({...newFood, name: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-600 ml-1">Price (₹)</label>
                      <input 
                        type="number" 
                        required
                        value={newFood.price}
                        onChange={(e) => setNewFood({...newFood, price: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 ml-1">Image URL</label>
                    <input 
                      type="text" 
                      value={newFood.imageUrl}
                      onChange={(e) => setNewFood({...newFood, imageUrl: e.target.value})}
                      placeholder="https://..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 ml-1">Description</label>
                    <textarea 
                      required
                      value={newFood.description}
                      onChange={(e) => setNewFood({...newFood, description: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 h-24"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-primary-200 active:scale-95"
                  >
                    Save Dish
                  </button>
                </form>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foods.map(food => (
              <div key={food.id} className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center space-x-4 group hover:shadow-md transition-all">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                  <img src={food.imageUrl || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold text-slate-800 line-clamp-1">{food.name}</h4>
                  <p className="text-primary-600 font-bold text-sm">₹{food.price}</p>
                </div>
                <div className="flex flex-col space-y-2">
                  <button 
                    className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl transition-colors"
                    onClick={() => setEditFood(food)}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => deleteFood(food.id)}
                    className="p-2 bg-slate-50 text-slate-400 hover:text-red-600 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Food Modal */}
          {editFood && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
              <div className="bg-white rounded-[2.5rem] p-8 max-w-xl w-full shadow-2xl animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-slate-800">Edit Food Item</h3>
                  <button onClick={() => setEditFood(null)} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={e => { e.preventDefault(); updateFood(); }} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-slate-700 font-bold mb-2">Name</label>
                      <input
                        className="w-full border border-slate-200 rounded-xl px-4 py-2"
                        value={editFood.name}
                        onChange={e => setEditFood({ ...editFood, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-2">Price</label>
                      <input
                        className="w-full border border-slate-200 rounded-xl px-4 py-2"
                        type="number"
                        value={editFood.price}
                        onChange={e => setEditFood({ ...editFood, price: e.target.value })}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-slate-700 font-bold mb-2">Description</label>
                      <textarea
                        className="w-full border border-slate-200 rounded-xl px-4 py-2"
                        value={editFood.description}
                        onChange={e => setEditFood({ ...editFood, description: e.target.value })}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-slate-700 font-bold mb-2">Image URL</label>
                      <input
                        className="w-full border border-slate-200 rounded-xl px-4 py-2"
                        value={editFood.imageUrl}
                        onChange={e => setEditFood({ ...editFood, imageUrl: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-4">
                    <button type="button" onClick={() => setEditFood(null)} className="bg-slate-200 text-slate-700 px-6 py-2 rounded-xl font-bold">Cancel</button>
                    <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded-xl font-bold">Update</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Order Info</th>
                <th className="px-6 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Address</th>
                <th className="px-6 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <p className="font-bold text-slate-800">{order.foodName}</p>
                    <p className="text-xs text-slate-400 font-medium">#{order.id}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="font-bold text-slate-700">{order.user?.name || 'Customer'}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm text-slate-500 font-medium line-clamp-1 max-w-[200px]">{order.deliveryAddress}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-black text-slate-800">
                    ₹{order.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="py-20 text-center text-slate-400 font-medium">
              No orders to display
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
