import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import FoodCard from '../components/FoodCard';
import Loader from '../components/Loader';
import { Search, SlidersHorizontal, Utensils, Zap, Heart, TrendingUp } from 'lucide-react';

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await api.get('/foods');
        setFoods(response.data);
      } catch (error) {
        console.error('Error fetching foods:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  const handleOrder = (food) => {
    navigate('/order', { state: { food } });
  };

  const filteredFoods = foods.filter(food => 
    food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    food.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [
    { name: 'All', icon: '🍕' },
    { name: 'Fast Food', icon: '🍔' },
    { name: 'Italian', icon: '🍝' },
    { name: 'Desserts', icon: '🍰' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient and animations */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-primary-900 opacity-95"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 left-20 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        {/* Background image with overlay */}
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1400" 
            className="w-full h-full object-cover opacity-20"
            alt="Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-transparent"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            {/* Animated badge */}
            <div className="inline-flex items-center gap-2 mb-8 animate-in fade-in slide-in-up duration-500">
              <div className="flex items-center gap-2 px-4 py-2 bg-primary-500/20 backdrop-blur-md rounded-full border border-primary-400/50">
                <Zap className="w-4 h-4 text-primary-300" />
                <span className="text-sm font-bold text-primary-200">Fast Delivery • Fresh Food</span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight animate-in fade-in slide-in-up duration-700 delay-100">
              Deliciousness<br /> 
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-pink-500 bg-clip-text text-transparent">
                Delivered to You
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-slate-300 mb-10 font-medium leading-relaxed animate-in fade-in slide-in-up duration-700 delay-200">
              Explore a wide range of cuisines and get them delivered hot and fresh at your doorstep in 30 minutes.
            </p>
            
            {/* Search Box */}
            <div className="relative max-w-md animate-in fade-in slide-in-up duration-700 delay-300">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600/50 to-pink-600/50 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search pizza, burger, pasta..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-white/95 backdrop-blur-md rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-400 text-slate-800 font-bold shadow-2xl placeholder-slate-400 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Section Header */}
        <div className="mb-12 animate-in fade-in slide-in-up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-4xl font-black bg-gradient-to-r from-slate-800 to-primary-600 bg-clip-text text-transparent">
                  Popular Dishes
                </h2>
              </div>
              <p className="text-slate-600 font-semibold text-lg">Handpicked favorites trending this week</p>
            </div>

            {/* Category Buttons */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => (
                <button 
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`whitespace-nowrap px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                    selectedCategory === cat.name
                      ? 'btn-gradient text-white shadow-xl'
                      : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-primary-500 hover:text-primary-600'
                  }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
              <button className="p-3 bg-white text-slate-600 rounded-full border-2 border-slate-200 hover:border-primary-600 hover:bg-primary-50 transition-all">
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-6 mb-8">
            <div className="glass rounded-2xl p-4 md:p-6 text-center">
              <div className="text-2xl md:text-3xl font-black text-primary-600 mb-1">{filteredFoods.length}+</div>
              <p className="text-xs md:text-sm text-slate-600 font-semibold">Delicious Foods</p>
            </div>
            <div className="glass rounded-2xl p-4 md:p-6 text-center">
              <div className="text-2xl md:text-3xl font-black text-primary-600 mb-1">30 min</div>
              <p className="text-xs md:text-sm text-slate-600 font-semibold">Fast Delivery</p>
            </div>
            <div className="glass rounded-2xl p-4 md:p-6 text-center">
              <div className="text-2xl md:text-3xl font-black text-primary-600 mb-1">4.8★</div>
              <p className="text-xs md:text-sm text-slate-600 font-semibold">Top Rated</p>
            </div>
          </div>
        </div>

        {/* Food Grid */}
        {loading ? (
          <Loader />
        ) : filteredFoods.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredFoods.map((food, index) => (
              <div key={food.id} className="animate-in fade-in slide-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                <FoodCard 
                  food={food} 
                  onOrder={handleOrder}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gradient-to-br from-slate-100 to-slate-50 rounded-3xl border-2 border-dashed border-slate-300 animate-in fade-in">
            <div className="mb-6 inline-flex p-4 bg-white rounded-2xl shadow-lg">
              <Heart className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-700 mb-2">No dishes found</h3>
            <p className="text-slate-500 font-medium">Try searching for something else or browse our categories</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
