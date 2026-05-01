import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, LayoutPanelLeft, ArrowRight, Trash2, ChevronRight, Check, Star } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Product } from '../../types';
import { cn } from '../../lib/utils';
import { useCart } from '../../hooks/useCart';

export const CompareBar: React.FC = () => {
  const { compareItems, toggleCompare, clearCompare } = useAppContext();
  const [showModal, setShowModal] = useState(false);

  if (compareItems.length === 0) return null;

  return (
    <>
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 text-white rounded-[2rem] p-4 pr-6 flex items-center gap-6 shadow-2xl shadow-gray-900/40 border border-white/10 backdrop-blur-xl"
      >
        <div className="flex items-center gap-2 pl-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <LayoutPanelLeft size={20} />
            </div>
            <div className="hidden md:block">
                <div className="text-[10px] font-black text-primary uppercase tracking-widest leading-none mb-1">So sánh</div>
                <div className="text-sm font-black leading-none">{compareItems.length}/3 sản phẩm</div>
            </div>
        </div>

        <div className="flex items-center gap-3">
          {compareItems.map((product) => (
            <div key={product.id} className="relative group">
              <div className="w-14 h-14 rounded-2xl bg-white p-2 border border-white/20">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
              </div>
              <button 
                onClick={() => toggleCompare(product)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {[...Array(3 - compareItems.length)].map((_, i) => (
            <div key={i} className="w-14 h-14 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center text-white/5">
                <LayoutPanelLeft size={20} />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
           <button 
             onClick={clearCompare}
             className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-white transition-colors"
           >
             Xóa hết
           </button>
           <button 
             onClick={() => setShowModal(true)}
             disabled={compareItems.length < 2}
             className={cn(
               "btn-primary !h-12 !rounded-xl !px-6 text-[10px] font-black uppercase tracking-widest disabled:opacity-50 disabled:grayscale",
             )}
           >
             So sánh ngay
           </button>
        </div>
      </motion.div>

      {/* Compare Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-6xl bg-white rounded-[4rem] shadow-2xl p-12 overflow-x-auto max-h-[90vh] font-sans"
            >
               <div className="flex items-center justify-between mb-12">
                  <div>
                    <h3 className="text-4xl font-black text-gray-900 leading-tight">So sánh sản phẩm</h3>
                    <p className="text-gray-400 font-bold mt-2">Tìm ra sự lựa chọn tốt nhất cho bé yêu</p>
                  </div>
                  <button onClick={() => setShowModal(false)} className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all">
                    <X size={24} />
                  </button>
               </div>

               <div className="grid grid-cols-4 gap-8">
                  {/* Features Label Column */}
                  <div className="space-y-8 pt-[240px]">
                     {['Thương hiệu', 'Giá bán', 'Khuyến mãi', 'Đánh giá', 'Đặc điểm'].map((feat) => (
                       <div key={feat} className="h-16 flex items-center border-b border-gray-50">
                          <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">{feat}</span>
                       </div>
                     ))}
                  </div>

                  {/* Product Columns */}
                  {compareItems.map((product) => (
                    <div key={product.id} className="space-y-8 text-center group">
                       <div className="h-[200px] bg-surface rounded-[2rem] p-8 relative flex items-center justify-center">
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform" />
                          <button onClick={() => toggleCompare(product)} className="absolute top-4 right-4 w-10 h-10 bg-white rounded-xl shadow-sm text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                             <Trash2 size={18} />
                          </button>
                       </div>
                       
                       <div className="h-10">
                          <h4 className="text-sm font-black text-gray-900 line-clamp-1">{product.name}</h4>
                       </div>

                       <div className="h-16 flex items-center justify-center border-b border-gray-50 uppercase tracking-widest text-xs font-black text-gray-500">
                          {product.brand}
                       </div>
                       <div className="h-16 flex items-center justify-center border-b border-gray-50">
                          <span className="text-xl font-black text-primary">{product.price.toLocaleString()}đ</span>
                       </div>
                       <div className="h-16 flex items-center justify-center border-b border-gray-50">
                          {product.discount > 0 ? (
                            <span className="text-xs font-black text-secondary">-{product.discount}% OFF</span>
                          ) : (
                            <span className="text-xs font-bold text-gray-300">Không có</span>
                          )}
                       </div>
                       <div className="h-16 flex items-center justify-center border-b border-gray-50">
                          <div className="flex items-center gap-1">
                             <Star size={14} className="text-accent fill-accent" />
                             <span className="text-xs font-black text-gray-900">{product.rating}</span>
                          </div>
                       </div>
                       <div className="h-16 flex items-center justify-center border-b border-gray-50 text-[11px] font-medium text-gray-500 italic px-4">
                          {product.description?.slice(0, 50)}...
                       </div>

                       <div className="pt-4">
                          <button className="w-full btn-primary h-14 !rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20">Thêm vào giỏ</button>
                       </div>
                    </div>
                  ))}
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
