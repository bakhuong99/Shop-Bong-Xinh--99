import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Baby, ArrowRight, Sparkles, Phone, Package, 
  Truck, ShieldCheck, RefreshCcw, Headset, 
  Zap, ChevronRight, ShoppingBag, Eye 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ProductCard } from '../components/product/ProductCard';
import { useAppContext } from '../context/AppContext';
import { collection, query, limit, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

const CATEGORY_ITEMS = [
  { id: 'cat-1', name: 'Bỉm sữa', icon: '🍼', color: 'bg-blue-50', count: 120 },
  { id: 'cat-2', name: 'Đồ sơ sinh', icon: '👶', color: 'bg-pink-50', count: 85 },
  { id: 'cat-3', name: 'Ăn dặm', icon: '🥣', color: 'bg-orange-50', count: 64 },
  { id: 'cat-4', name: 'Cho mẹ', icon: '🤱', color: 'bg-purple-50', count: 42 },
  { id: 'cat-5', name: 'Đồ chơi', icon: '🧸', color: 'bg-yellow-50', count: 96 },
  { id: 'cat-6', name: 'Thời trang', icon: '👕', color: 'bg-green-50', count: 110 }
];

const BRANDS = [
  { name: 'Moony', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop' },
  { name: 'Meiji', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop' },
  { name: 'Huggies', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop' },
  { name: 'Pampers', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop' },
  { name: 'Enfamil', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop' },
  { name: 'Similac', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop' }
];

export const Home: React.FC = () => {
  const { babyProfile } = useAppContext();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState({ hours: 2, minutes: 45, seconds: 10 });

  useEffect(() => {
    const q = query(collection(db, 'products'), limit(8));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(prods);
      setFlashSaleProducts(prods.slice(0, 4));
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="flex flex-col pb-20 font-sans">
      
      {/* Hero Section */}
      <section className="bg-white pt-6 pb-12">
        <div className="container overflow-visible">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[480px]">
            {/* Main Carousel-like Banner */}
            <div className="lg:col-span-8 relative rounded-[2.5rem] overflow-hidden bg-primary group shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1544126592-807daa2b567b?q=80&w=2070&auto=format&fit=crop" 
                alt="Main Banner" 
                className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent flex flex-col justify-center p-12">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="max-w-md space-y-6"
                >
                  <span className="inline-block bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-2">
                    Premium Collection 2026
                  </span>
                  <h2 className="text-white text-5xl font-black leading-[1.1] drop-shadow-lg">
                    Sản phẩm tốt nhất <br />
                    <span className="text-white/80">cho sự phát triển của bé</span>
                  </h2>
                  <p className="text-white/90 text-lg font-medium leading-relaxed drop-shadow">
                    SHOP BỐNG XINH cam kết cung cấp 100% sản phẩm chính hãng, an toàn tuyệt đối.
                  </p>
                  <div className="flex gap-4">
                    <button onClick={() => navigate('/search')} className="btn-primary !px-8 !py-4 shadow-2xl">
                      Khám phá ngay <ArrowRight size={20} />
                    </button>
                    <button onClick={() => navigate('/category/top-deals')} className="btn-outline !bg-white/10 !text-white !border-white/20 backdrop-blur-sm px-8">
                      Xem ưu đãi
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Side Banners */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="flex-1 relative rounded-[2.5rem] overflow-hidden bg-secondary group shadow-lg cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1515488764276-beab7607c1e6?q=80&w=1500&auto=format&fit=crop" 
                  alt="Side Banner 1" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80"
                />
                <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black/50 to-transparent">
                  <h3 className="text-white text-xl font-black mb-2">Bỉm mềm nhẹ nhàng</h3>
                  <p className="text-white/80 text-xs font-bold uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                    Xem ngay <ChevronRight size={14} />
                  </p>
                </div>
              </div>
              <div className="flex-1 relative rounded-[2.5rem] overflow-hidden bg-accent group shadow-lg cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1500&auto=format&fit=crop" 
                  alt="Side Banner 2" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80"
                />
                <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black/50 to-transparent">
                  <h3 className="text-white text-xl font-black mb-2">Dinh dưỡng mỗi ngày</h3>
                  <p className="text-white/80 text-xs font-bold uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                    Mua ngay <ChevronRight size={14} />
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12 bg-white rounded-[2rem] p-8 shadow-sm border border-gray-50 flex-wrap relative z-10 -mb-20 mx-auto max-w-[90%]">
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-6">
                <Truck size={24} />
              </div>
              <div>
                <h4 className="font-black text-sm text-gray-900">Giao hàng siêu tốc</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Nhận hàng trong 2H</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all transform group-hover:rotate-6">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="font-black text-sm text-gray-900">100% Chính hãng</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Nguồn gốc rõ ràng</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all transform group-hover:rotate-6">
                <RefreshCcw size={24} />
              </div>
              <div>
                <h4 className="font-black text-sm text-gray-900">Đổi trả miễn phí</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Trong vòng 7 ngày</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-400 group-hover:bg-purple-400 group-hover:text-white transition-all transform group-hover:rotate-6">
                <Headset size={24} />
              </div>
              <div>
                <h4 className="font-black text-sm text-gray-900">Hỗ trợ 24/7</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Tư vấn nhiệt tình</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="bg-surface pt-32 pb-16">
        <div className="container">
          <div className="flex items-end justify-between mb-8">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Shop By Category</span>
              <h2 className="text-3xl font-black text-gray-900">Danh Mục Nổi Bật</h2>
            </div>
            <Link to="/search" className="text-xs font-bold text-gray-400 hover:text-primary transition-all flex items-center gap-1 uppercase tracking-widest">
              Xem tất cả <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {CATEGORY_ITEMS.map((cat) => (
              <Link 
                key={cat.id} 
                to={`/category/${cat.name}`} 
                className="bg-white rounded-[2rem] p-6 text-center group border border-transparent hover:border-primary/20 hover:shadow-xl transition-all"
              >
                <div className={`w-20 h-20 ${cat.color} rounded-full flex items-center justify-center text-4xl mx-auto mb-4 group-hover:scale-110 transition-transform shadow-sm`}>
                  {cat.icon}
                </div>
                <h3 className="text-sm font-black text-gray-900 mb-1">{cat.name}</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{cat.count} sản phẩm</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Sale */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary-dark overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="container relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between mb-12 gap-8 text-center lg:text-left">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-xl animate-bounce">
                <Zap size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white leading-tight">GIỜ VÀNG GIÁ SỐC</h2>
                <p className="text-white/80 font-bold text-sm uppercase tracking-widest mt-1">Nhanh tay, số lượng có hạn!</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-black/20 backdrop-blur-md px-8 py-5 rounded-[2rem] border border-white/10">
              <span className="text-white/60 font-black text-xs uppercase tracking-widest mr-4">Kết thúc sau</span>
              <div className="flex items-center gap-3">
                {[
                  { label: 'Giờ', val: countdown.hours },
                  { label: 'Phút', val: countdown.minutes },
                  { label: 'Giây', val: countdown.seconds }
                ].map((unit, i) => (
                  <React.Fragment key={unit.label}>
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-primary text-2xl font-black shadow-lg">
                        {unit.val.toString().padStart(2, '0')}
                      </div>
                      <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest mt-2">{unit.label}</span>
                    </div>
                    {i < 2 && <span className="text-white text-2xl font-black mb-6">:</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {flashSaleProducts.map((product) => (
              <div key={product.id} className="relative group">
                <ProductCard product={product} />
                <div className="absolute top-4 left-4 bg-secondary text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg z-20">
                  GIẢM 20%
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="container text-center mb-12">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] block mb-2">Our Best Collection</span>
          <h2 className="text-4xl font-black text-gray-900">Sản phẩm nổi bật</h2>
          <div className="w-20 h-1.5 bg-primary rounded-full mx-auto mt-6" />
        </div>

        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="h-[400px] bg-gray-50 rounded-[2.5rem] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="mt-16 text-center">
            <Link to="/search" className="btn-outline inline-flex px-12 !rounded-2xl border-gray-200">
              Xem tất cả sản phẩm <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Personalization Section */}
      {!babyProfile && (
        <section className="container py-12">
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-secondary p-12 rounded-[3.5rem] flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden shadow-2xl shadow-secondary/20"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="w-24 h-24 bg-white/20 rounded-[2rem] flex items-center justify-center text-white shrink-0">
              <Baby size={56} strokeWidth={1.5} />
            </div>
            <div className="flex-1 text-center lg:text-left space-y-2">
              <h3 className="font-black text-white text-3xl">Cá nhân hóa cho bé?</h3>
              <p className="text-white/80 text-lg font-medium">Tạo hồ sơ để nhận gợi ý tã, sữa chuẩn nhất theo cân nặng và độ tuổi của bé.</p>
            </div>
            <Link to="/onboarding" className="lg:w-auto w-full btn-primary !bg-white !text-secondary !h-16 !px-12 !rounded-2xl shadow-xl hover:!bg-gray-50">
              Bắt đầu ngay <Sparkles size={24} />
            </Link>
          </motion.div>
        </section>
      )}

      {/* Brand Trust & Slider */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.4em] mb-4">Trusted Worldwide</h3>
            <h4 className="text-2xl font-black text-gray-900">Hợp tác cùng những thương hiệu hàng đầu</h4>
          </div>
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-60 hover:opacity-100 transition-opacity">
            {BRANDS.map(brand => (
              <img key={brand.name} src={brand.logo} alt={brand.name} className="h-10 object-contain grayscale hover:grayscale-0 transition-all cursor-pointer" />
            ))}
          </div>

          <div className="mt-20 max-w-4xl mx-auto bg-white rounded-[3rem] p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="w-16 h-16 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-lg">
                  <img src={`https://i.pravatar.cc/150?img=${i+40}`} alt="User" />
                </div>
              ))}
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-xl font-black text-gray-900">Hơn 20,000+ mẹ bỉm đã tin dùng</p>
              <p className="text-gray-500 font-medium">Gia nhập cộng đồng Bống Xinh để nhận nhiều ưu đãi và kiến thức bổ ích.</p>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-primary font-black text-2xl">4.9/5</div>
                <div className="flex text-accent gap-0.5">
                  {[1, 2, 3, 4, 5].map(i => <Sparkles size={12} key={i} />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
