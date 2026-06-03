import React from 'react';
import { ShoppingCart, Star, Flame, Clock } from 'lucide-react';

const FoodCard = ({ food, onOrder }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div 
      className="relative group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-100 flex flex-col h-full card-hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient overlay background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-primary-600/0 group-hover:from-primary-500/10 group-hover:to-primary-600/10 z-0 transition-all duration-500"></div>

      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={food.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=500'} 
          alt={food.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
        />
        
        {/* Image overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Badge Container - Top Right */}
        <div className="absolute top-4 right-4 flex gap-2">
          <div className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-lg flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-bold text-slate-800">4.5</span>
          </div>
          <div className="bg-primary-600/90 backdrop-blur-md px-3 py-2 rounded-2xl shadow-lg flex items-center gap-1">
            <Flame className="w-4 h-4 text-white" />
            <span className="text-xs font-bold text-white">Hot Deal</span>
          </div>
        </div>

        {/* Delivery time - Bottom left */}
        <div className={`absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-2 rounded-2xl flex items-center gap-1 shadow-lg transition-all duration-500 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <Clock className="w-4 h-4 text-slate-600" />
          <span className="text-xs font-bold text-slate-700">30 min</span>
        </div>
      </div>
      
      {/* Content Container */}
      <div className="p-6 flex flex-col flex-grow relative z-10">
        <div className="flex justify-between items-start gap-2 mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-black text-slate-800 line-clamp-1 group-hover:text-primary-600 transition-colors">
              {food.name}
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-1">Premium Quality</p>
          </div>
          <span className="text-2xl font-black bg-gradient-to-br from-primary-600 to-primary-700 bg-clip-text text-transparent whitespace-nowrap">
            ₹{food.price}
          </span>
        </div>
        
        <p className="text-slate-600 text-sm mb-6 line-clamp-2 flex-grow font-medium leading-relaxed">
          {food.description}
        </p>

        {/* Rating and reviews - More visible */}
        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-1">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3.5 h-3.5 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} 
                />
              ))}
            </div>
            <span className="text-xs text-slate-600 font-bold ml-1">(128)</span>
          </div>
        </div>
        
        {/* Order Button */}
        <button 
          onClick={() => onOrder(food)}
          className="w-full btn-gradient text-white font-bold py-4 px-4 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 active:scale-95 relative overflow-hidden group/btn"
        >
          {/* Button shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover/btn:opacity-20 transition-opacity duration-500" style={{ transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)' }}></div>
          
          <ShoppingCart className="w-5 h-5 transition-transform duration-300 group-hover/btn:scale-110" />
          <span>Order Now</span>
        </button>
      </div>

      {/* Floating elements - for extra visual appeal */}
      <div className="absolute -top-1 -right-1 w-20 h-20 bg-primary-400/10 rounded-full blur-2xl group-hover:bg-primary-500/20 transition-all duration-500"></div>
      <div className="absolute -bottom-1 -left-1 w-16 h-16 bg-primary-500/10 rounded-full blur-2xl group-hover:bg-primary-600/20 transition-all duration-500"></div>
    </div>
  );
};

export default FoodCard;
