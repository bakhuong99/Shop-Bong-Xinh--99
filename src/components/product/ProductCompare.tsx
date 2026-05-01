import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, ShoppingCart, Repeat } from 'lucide-react';
import { Product } from '../../types';
import { cn } from '../../lib/utils';

interface ProductCompareProps {
  products: Product[];
  onClose: () => void;
}

export const ProductCompare: React.FC<ProductCompareProps> = ({ products, onClose }) => {
  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      className="fixed inset-0 z-[100] bg-white flex flex-col font-sans"
    >
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">So sánh sản phẩm</h3>
        <button onClick={onClose} className="p-2 bg-gray-50 rounded-full text-gray-400">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 p-6 min-w-max">
          {products.map((product) => (
            <div key={product.id} className="w-48 flex flex-col gap-6">
              {/* Product Header */}
              <div className="space-y-3">
                <div className="aspect-square bg-gray-50 rounded-2xl p-4 flex items-center justify-center">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-contain mix-blend-multiply"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-sm font-extrabold text-gray-900 line-clamp-2 leading-tight h-10">
                  {product.name}
                </div>
                <div className="text-lg font-black text-primary">
                  {product.price.toLocaleString()}đ
                </div>
              </div>

              {/* Specs */}
              <div className="space-y-6">
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Thương hiệu</div>
                  <div className="text-sm font-bold text-gray-700">{product.brand}</div>
                </div>
                
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Đặc điểm chính</div>
                  <ul className="space-y-1.5">
                    {product.features.slice(0, 3).map((f, i) => (
                      <li key={i} className="text-[11px] font-medium text-gray-600 flex items-start gap-1.5 leading-snug">
                        <Check size={12} className="text-green-500 shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key}>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{key}</div>
                    <div className="text-xs font-bold text-gray-700">{value}</div>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="mt-auto pt-6 space-y-2">
                <button className="w-full btn-primary !h-11 !text-[11px]">
                  <ShoppingCart size={16} /> Mua ngay
                </button>
                <button className="w-full btn-secondary !bg-secondary/10 !text-secondary !h-11 !text-[11px]">
                  <Repeat size={16} /> Subscribe
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
