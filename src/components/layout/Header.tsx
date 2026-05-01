import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, ChevronLeft, Phone, Heart, Baby } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useCart } from '../../hooks/useCart';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, showBack }) => {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const { items, total } = useCart();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 left-0 right-0 bg-white border-b border-gray-50 z-40 h-20 flex items-center shadow-sm">
      <div className="container flex items-center justify-between gap-4">
        {/* Logo Section */}
        <div className="flex items-center gap-4">
          {showBack && (
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 md:hidden">
              <ChevronLeft size={24} className="text-gray-900" />
            </button>
          )}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <Baby size={28} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tighter text-gray-900 leading-none">SHOP BỐNG XINH</span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-0.5">Premium Store</span>
            </div>
          </Link>
        </div>

        {/* Search Bar - Desktop Only */}
        <form onSubmit={handleSearch} className="flex-1 max-w-lg relative hidden lg:block">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ba mẹ muốn tìm sữa, bỉm gì cho bé?"
            className="w-full bg-gray-50 border-2 border-gray-100/50 rounded-2xl px-6 py-3.5 text-sm font-medium focus:outline-none focus:border-primary focus:bg-white transition-all pr-12 shadow-sm"
          />
          <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors">
            <Search size={20} />
          </button>
        </form>

        {/* Action Items */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden lg:flex flex-col items-end mr-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Hotline 24/7</span>
            <a href="tel:0984158568" className="text-sm font-black text-secondary">0984.158.568</a>
          </div>

          <Link to="/wishlist" className="p-2.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all hidden sm:flex">
            <Heart size={24} />
          </Link>

          <Link to="/profile" className="flex items-center gap-3 p-2 group">
            <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
              <User size={22} />
            </div>
            <div className="hidden xl:flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tài khoản</span>
              <span className="text-sm font-black text-gray-900 group-hover:text-primary transition-colors">
                {user ? user.name : 'Đăng nhập'}
              </span>
            </div>
          </Link>

          <Link to="/cart" className="flex items-center gap-3 p-2 bg-primary/5 rounded-2xl border border-primary/10 group hover:bg-primary transition-all ml-2">
            <div className="relative">
              <ShoppingBag size={24} className="text-primary group-hover:text-white transition-colors" />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-[10px] font-black px-1.5 py-0.5 rounded-full ring-2 ring-white shadow-sm">
                  {items.length}
                </span>
              )}
            </div>
            <div className="hidden lg:flex flex-col">
              <span className="text-[10px] font-bold text-primary group-hover:text-white/80 uppercase tracking-widest transition-colors leading-none">Giỏ hàng</span>
              <span className="text-sm font-black text-primary group-hover:text-white transition-colors">
                {total.toLocaleString()}đ
              </span>
            </div>
          </Link>
          
          <button className="lg:hidden p-2 text-gray-500" onClick={() => navigate('/search')}>
            <Search size={22} />
          </button>
        </div>
      </div>
    </header>
  );
};
