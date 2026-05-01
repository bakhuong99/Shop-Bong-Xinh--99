import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, ShoppingBag, User, Heart } from 'lucide-react';
import { cn } from '../../lib/utils';

export const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 pb-safe pt-2 z-50 md:hidden">
      <div className="flex justify-between items-center max-w-lg mx-auto">
        <NavLink to="/" className={({ isActive }) => cn("flex flex-col items-center gap-1 p-2 min-w-[64px]", isActive ? "text-primary" : "text-gray-400")}>
          <Home size={24} />
          <span className="text-[10px] font-medium">Trang chủ</span>
        </NavLink>
        <NavLink to="/search" className={({ isActive }) => cn("flex flex-col items-center gap-1 p-2 min-w-[64px]", isActive ? "text-primary" : "text-gray-400")}>
          <Search size={24} />
          <span className="text-[10px] font-medium">Tìm kiếm</span>
        </NavLink>
        <NavLink to="/cart" className={({ isActive }) => cn("flex flex-col items-center gap-1 p-2 min-w-[64px] relative", isActive ? "text-primary" : "text-gray-400")}>
          <ShoppingBag size={24} />
          <span className="text-[10px] font-medium">Giỏ hàng</span>
          <span className="absolute top-1 right-3 bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">2</span>
        </NavLink>
        <NavLink to="/wishlist" className={({ isActive }) => cn("flex flex-col items-center gap-1 p-2 min-w-[64px]", isActive ? "text-primary" : "text-gray-400")}>
          <Heart size={24} />
          <span className="text-[10px] font-medium">Yêu thích</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => cn("flex flex-col items-center gap-1 p-2 min-w-[64px]", isActive ? "text-primary" : "text-gray-400")}>
          <User size={24} />
          <span className="text-[10px] font-medium">Cá nhân</span>
        </NavLink>
      </div>
    </nav>
  );
};
