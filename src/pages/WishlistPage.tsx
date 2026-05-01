import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../services/mockData';
import { ProductCard } from '../components/product/ProductCard';
import { Header } from '../components/layout/Header';

export const WishlistPage: React.FC = () => {
  // Mock wishlist items
  const wishlist = MOCK_PRODUCTS.slice(0, 1);

  if (wishlist.length === 0) {
    return (
      <div className="bg-white min-h-screen flex flex-col">
        <Header title="Yêu thích" showBack />
        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
          <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center text-pink-200 mb-6 font-sans">
            <Heart size={48} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Chưa có sản phẩm yêu thích</h2>
          <p className="text-gray-500 text-sm mb-8">Hãy lưu lại những sản phẩm bạn quan tâm để dễ dàng theo dõi và mua sắm sau nhé!</p>
          <Link to="/" className="btn-primary w-full max-w-[240px]">Khám phá ngay</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen pb-24 font-sans">
      <Header title="Yêu thích" showBack />

      <div className="p-4 flex flex-col gap-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Sản phẩm đã lưu ({wishlist.length})</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Recommendations */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Có thể bạn sẽ thích</h3>
            <Link to="/" className="text-primary font-bold text-xs">Xem thêm</Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {MOCK_PRODUCTS.slice(2, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
