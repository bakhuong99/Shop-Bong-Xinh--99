import React from 'react';
import { Product } from '../../types';
import { ShoppingCart, Repeat, Star, Eye, LayoutPanelLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAppContext } from '../../context/AppContext';
import { cn } from '../../lib/utils';
import { useCart } from '../../hooks/useCart';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleCompare, compareItems } = useAppContext();
  const { addItem } = useCart();
  const isComparing = compareItems.some(p => p.id === product.id);

  const hasPromotion = product.promotionType && product.promotionType !== 'none' && product.promotionValue;
  
  let finalPrice = product.price;
  let promoLabel = '';

  if (product.promotionType === 'percent' && product.promotionValue) {
    finalPrice = product.price * (1 - product.promotionValue / 100);
    promoLabel = `-${product.promotionValue}%`;
  } else if (product.promotionType === 'fixed' && product.promotionValue) {
    finalPrice = Math.max(0, product.price - product.promotionValue);
    promoLabel = `-${(product.promotionValue / 1000).toFixed(0)}k`;
  }

  const showOriginalPrice = product.originalPrice || hasPromotion;
  const displayOriginalPrice = product.originalPrice || (hasPromotion ? product.price : undefined);
  const displayDiscount = promoLabel || (product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) + '%' : '');

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 'one-time');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-[2.5rem] overflow-hidden group border border-gray-50 flex flex-col h-full shadow-sm hover:shadow-xl transition-all duration-300 relative"
    >
      <div className="relative aspect-[4/5] bg-gray-50/50 m-3 rounded-[2rem] overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 p-4"
          referrerPolicy="no-referrer"
        />
        
        {/* Hover Overlay Actions */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button 
             onClick={handleToggleCompare}
             className={cn(
               "w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl transition-all transform translate-y-4 group-hover:translate-y-0 duration-300",
               isComparing ? "bg-secondary text-white" : "bg-white text-gray-900 hover:bg-secondary hover:text-white"
             )}
             title="So sánh"
          >
            <LayoutPanelLeft size={20} />
          </button>
          <Link to={`/product/${product.id}`} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-900 shadow-xl hover:bg-primary hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75">
            <Eye size={20} />
          </Link>
          <button 
            onClick={handleAddToCart}
            className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-900 shadow-xl hover:bg-primary hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-150"
          >
            <ShoppingCart size={20} />
          </button>
        </div>

        {displayDiscount && (
          <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">
            {displayDiscount}
          </div>
        )}
        
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-gray-900 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest">Hết hàng</span>
          </div>
        )}
      </div>

      <div className="px-6 pb-6 flex flex-col flex-1">
        <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">{product.brand}</div>
        <Link to={`/product/${product.id}`} className="text-base font-bold text-gray-900 line-clamp-2 leading-snug mb-4 group-hover:text-primary transition-colors">
          {product.name}
        </Link>
        
        <div className="flex items-center gap-2 mb-6">
            <div className="flex text-accent">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} size={10} fill={i <= (product.rating || 5) ? "currentColor" : "none"} strokeWidth={i <= (product.rating || 5) ? 0 : 2} />
                ))}
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
              ({product.reviewCount || 12} reviews)
            </span>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-black text-gray-900 leading-none">{Math.round(finalPrice).toLocaleString()}đ</span>
            {showOriginalPrice && (
              <span className="text-[11px] text-gray-300 line-through font-bold mt-1">{displayOriginalPrice?.toLocaleString()}đ</span>
            )}
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all group-hover:bg-primary group-hover:text-white"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
