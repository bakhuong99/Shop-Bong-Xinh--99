import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Star, ShoppingCart, Repeat, Check, ShieldCheck, Truck, RefreshCcw, Heart, Package, Info, ChevronRight, Share2 } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { cn } from '../lib/utils';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, getProductPrice } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [purchaseType, setPurchaseType] = useState<'one-time' | 'subscribe'>('one-time');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `products/${id}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="bg-surface min-h-screen">
        <div className="container py-20 text-center space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="aspect-square bg-white rounded-[3rem] animate-pulse" />
            <div className="space-y-6 text-left">
              <div className="h-4 bg-white rounded-full animate-pulse w-1/4" />
              <div className="h-10 bg-white rounded-full animate-pulse w-3/4" />
              <div className="h-6 bg-white rounded-full animate-pulse w-1/2" />
              <div className="h-32 bg-white rounded-[2rem] animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-surface min-h-screen flex flex-col items-center justify-center p-10 text-center">
        <Package size={64} className="text-gray-200 mb-4" />
        <h2 className="text-2xl font-black text-gray-900 mb-2">Không tìm thấy sản phẩm</h2>
        <button onClick={() => navigate('/')} className="btn-primary">Quay lại trang chủ</button>
      </div>
    );
  }

  const hasPromotion = product.promotionType && product.promotionType !== 'none' && product.promotionValue;
  
  let promoLabel = '';
  if (product.promotionType === 'percent' && product.promotionValue) {
    promoLabel = `Tiết kiệm ${product.promotionValue}%`;
  } else if (product.promotionType === 'fixed' && product.promotionValue) {
    promoLabel = `Giảm ${(product.promotionValue / 1000).toFixed(0)}k`;
  }

  const oneTimePrice = getProductPrice(product, 'one-time');
  const subscribePrice = getProductPrice(product, 'subscribe');
  
  const displayDiscount = promoLabel || (product.originalPrice ? `Tiết kiệm ${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%` : '');

  const handleAddToCart = () => {
    addItem(product, purchaseType, quantity);
    // Use a toast instead of alert if available, but for now:
    navigate('/cart');
  };

  return (
    <div className="bg-surface min-h-screen font-sans pb-20">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-100 py-4 mb-8 hidden md:block">
        <div className="container flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to={`/category/${product.category}`} className="hover:text-primary transition-colors">{product.category}</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative aspect-square bg-white rounded-[3.5rem] flex items-center justify-center p-12 overflow-hidden shadow-sm border border-gray-50">
              <motion.img 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-contain mix-blend-multiply"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-8 left-8 flex flex-col gap-3">
                {displayDiscount && (
                  <div className="bg-primary text-white font-black text-xs uppercase tracking-widest px-4 py-2 rounded-full shadow-lg shadow-primary/20">
                    {displayDiscount}
                  </div>
                )}
                <div className="bg-secondary text-white font-black text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg shadow-secondary/20">
                    Best Seller
                </div>
              </div>
              <div className="absolute top-8 right-8 flex flex-col gap-3">
                <button className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-gray-400 hover:text-primary transition-all">
                  <Heart size={22} />
                </button>
                <button className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-gray-400 hover:text-primary transition-all">
                  <Share2 size={22} />
                </button>
              </div>
            </div>

            {/* Thumbnails if any - for now placeholder */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square bg-white rounded-3xl border-2 border-transparent hover:border-primary/20 transition-all p-4 cursor-pointer">
                  <img src={product.imageUrl} alt="Thumbnail" className="w-full h-full object-contain mix-blend-multiply opacity-50 hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Info & Actions */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-primary uppercase tracking-[0.3em]">{product.brand}</span>
                <div className="h-1 w-1 bg-gray-200 rounded-full" />
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">SKU: BS-{product.id?.slice(0, 6)}</span>
              </div>
              <h1 className="text-4xl font-black text-gray-900 leading-[1.1]">{product.name}</h1>
              
              <div className="flex items-center gap-6 py-2">
                <div className="flex items-center gap-2">
                  <div className="flex text-accent">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} size={16} fill={i <= (product.rating || 5) ? "currentColor" : "none"} strokeWidth={i <= (product.rating || 5) ? 0 : 2} />
                    ))}
                  </div>
                  <span className="font-black text-lg text-gray-900">{(product.rating || 4.8).toFixed(1)}</span>
                </div>
                <div className="h-6 w-px bg-gray-100" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{product.reviewCount || 154} Đánh giá người dùng</span>
              </div>
            </div>

            {/* Purchase Options */}
            <div className="space-y-4 p-2 bg-white rounded-[3rem] border border-gray-50 shadow-sm">
              <label 
                onClick={() => setPurchaseType('one-time')}
                className={cn(
                  "relative flex items-center justify-between p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer group",
                  purchaseType === 'one-time' ? "border-primary bg-primary/5 shadow-inner" : "border-transparent bg-gray-50/50"
                )}
              >
                <div className="flex items-center gap-6">
                  <div className={cn(
                    "w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all",
                    purchaseType === 'one-time' ? "border-primary bg-white" : "border-gray-200"
                  )}>
                    {purchaseType === 'one-time' && <div className="w-3.5 h-3.5 bg-primary rounded-full shadow-lg" />}
                  </div>
                  <div>
                    <div className="text-base font-black text-gray-900">Mua lẻ một lần</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Giá tốt nhất thị trường</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-gray-900">{oneTimePrice.toLocaleString()}đ</div>
                  {(product.originalPrice || hasPromotion) && (
                    <div className="text-xs text-gray-300 line-through font-bold">{(product.originalPrice || product.price).toLocaleString()}đ</div>
                  )}
                </div>
              </label>

              {product.isSubscribeable && (
                <label 
                  onClick={() => setPurchaseType('subscribe')}
                  className={cn(
                    "relative flex items-center justify-between p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer group",
                    purchaseType === 'subscribe' ? "border-secondary bg-secondary/5 shadow-inner" : "border-transparent bg-gray-50/50"
                  )}
                >
                  <div className="flex items-center gap-6">
                    <div className={cn(
                      "w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all",
                      purchaseType === 'subscribe' ? "border-secondary bg-white" : "border-gray-200"
                    )}>
                      {purchaseType === 'subscribe' && <div className="w-3.5 h-3.5 bg-secondary rounded-full shadow-lg" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="text-base font-black text-gray-900">Subscribe & Save</div>
                        <div className="bg-secondary text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase">-15%</div>
                      </div>
                      <div className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mt-1">Giao định kỳ hàng tháng</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-secondary">{subscribePrice.toLocaleString()}đ</div>
                    <div className="text-xs text-gray-300 line-through font-bold">{oneTimePrice.toLocaleString()}đ</div>
                  </div>
                </label>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex flex-col md:flex-row gap-4 items-stretch">
              <div className="flex items-center bg-white rounded-2xl p-1.5 border border-gray-100 shadow-sm grow-0">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-12 h-12 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-900 font-black text-xl transition-all"
                >
                  -
                </button>
                <div className="w-14 text-center font-black text-lg text-gray-900">{quantity}</div>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-12 h-12 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-900 font-black text-xl transition-all"
                >
                  +
                </button>
              </div>

              <button 
                onClick={handleAddToCart}
                className={cn(
                  "flex-1 h-[60px] rounded-2xl font-black flex items-center justify-center gap-3 text-base uppercase tracking-widest transition-all active:scale-95 shadow-xl",
                  purchaseType === 'one-time' ? "bg-primary text-white shadow-primary/20 hover:bg-primary-dark" : "bg-secondary text-white shadow-secondary/20 hover:opacity-90"
                )}
              >
                {purchaseType === 'one-time' ? <ShoppingCart size={20} /> : <Repeat size={20} />}
                {purchaseType === 'one-time' ? 'Thêm vào giỏ hàng' : 'Đăng ký ngay'}
              </button>
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
              {[
                { icon: <Truck size={20} />, title: 'Giao hàng 2H', sub: 'Khu vực Bắc Ninh' },
                { icon: <ShieldCheck size={20} />, title: 'Chính hãng', sub: 'Đền 200% nếu giả' },
                { icon: <RefreshCcw size={20} />, title: '7 Ngày Đổi Trả', sub: 'Miễn phí thu hồi' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-5 bg-white rounded-3xl border border-gray-50 shadow-sm group hover:border-primary/10 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h5 className="font-black text-xs text-gray-900">{item.title}</h5>
                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Tabs Section */}
        <div className="mt-20">
          <div className="flex gap-8 border-b border-gray-100 mb-10 overflow-x-auto no-scrollbar">
            {[
              { id: 'desc', label: 'Mô tả chi tiết' },
              { id: 'specs', label: 'Thông số kỹ thuật' },
              { id: 'reviews', label: 'Đánh giá từ khách mẹ' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "pb-6 px-4 text-sm font-black uppercase tracking-widest transition-all relative whitespace-nowrap",
                  activeTab === tab.id ? "text-primary" : "text-gray-400 hover:text-gray-900"
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="detail-tab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-gray-50 min-h-[300px]">
            {activeTab === 'desc' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-8">
                  <h3 className="text-2xl font-black text-gray-900">Thông tin sản phẩm</h3>
                  <p className="text-gray-500 font-medium leading-relaxed whitespace-pre-line text-lg">
                    {product.description}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
                    {product.features?.map((f, i) => (
                      <div key={i} className="flex gap-4 items-start bg-surface p-6 rounded-3xl group">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0 mt-1">
                          <Check size={18} />
                        </div>
                        <span className="text-gray-800 font-bold leading-snug">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-4 bg-surface p-10 rounded-[2.5rem] h-fit">
                   <h4 className="font-black text-gray-900 mb-6 uppercase tracking-widest text-sm flex items-center gap-2">
                     <Info size={16} className="text-primary" /> Lưu ý khi sử dụng
                   </h4>
                   <ul className="space-y-4">
                     {[
                       'Bảo quản nơi khô ráo thoáng mát',
                       'Tránh ánh nắng trực tiếp',
                       'Kiểm tra hạn sử dụng trước khi dùng',
                       'Để xa tầm tay trẻ em'
                     ].map((item, i) => (
                       <li key={i} className="flex gap-3 text-sm font-bold text-gray-500 leading-relaxed">
                         <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                         {item}
                       </li>
                     ))}
                   </ul>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="max-w-3xl mx-auto space-y-4">
                {product.specs && Object.entries(product.specs).map(([k, v], i) => (
                  <div key={k} className={cn(
                    "flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl transition-all",
                    i % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                  )}>
                    <span className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1 md:mb-0">{k}</span>
                    <span className="text-base font-black text-gray-900">{v as string}</span>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">
                <Star size={48} className="mx-auto text-yellow-200 mb-6" />
                <h3 className="text-xl font-black text-gray-900 mb-2">Chưa có đánh giá nào</h3>
                <p className="text-gray-400 font-medium">Hãy là người đầu tiên chia sẻ cảm nhận về sản phẩm này nhé!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
