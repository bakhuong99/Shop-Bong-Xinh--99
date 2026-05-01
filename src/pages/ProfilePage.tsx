import React from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Settings, 
  ChevronRight, 
  Baby, 
  ShoppingBag, 
  Repeat, 
  MapPin, 
  CreditCard, 
  Bell, 
  LogOut, 
  Edit2, 
  Calendar,
  Weight,
  Droplet,
  ShieldCheck,
  Award,
  Gift,
  Star,
  ChevronDown
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Header } from '../components/layout/Header';
import { getBabyAgeText } from '../lib/babyUtils';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cn } from '../lib/utils';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, babyProfile, logout, isAdmin } = useAppContext();
  const [orderCount, setOrderCount] = React.useState(0);

  React.useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'orders'), where('userId', '==', user.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrderCount(snapshot.docs.length);
    });
    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="bg-surface min-h-screen flex flex-col items-center justify-center py-20 px-6 text-center font-sans">
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-gray-200 mb-8 shadow-sm border border-gray-50">
          <User size={64} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4">Mời ba mẹ đăng nhập</h2>
        <p className="text-gray-500 font-medium mb-10 max-w-md mx-auto text-lg leading-relaxed">Hãy đăng nhập để quản lý hành trình khôn lớn của bé và nhận hàng ngàn ưu đãi đặc quyền từ Shop Bống Xinh.</p>
        <button 
          onClick={() => navigate('/onboarding')} 
          className="btn-primary w-full max-w-xs !h-16 !rounded-2xl shadow-xl shadow-primary/20 text-lg font-black uppercase tracking-widest"
        >
          Đăng nhập ngay
        </button>
      </div>
    );
  }

  const menuGroups = [
    {
      title: 'Hành trình mua sắm',
      items: [
        { icon: <ShoppingBag size={22} />, label: 'Đơn hàng của tôi', desc: 'Theo dõi tình trạng đơn hàng', link: '/orders' },
        { icon: <Repeat size={22} />, label: 'Subscription', desc: 'Quản lý lịch giao định kỳ', link: '/subscriptions', badge: 'Tiết kiệm 15%' },
        { icon: <CreditCard size={22} />, label: 'Ví Voucher', desc: 'Mã giảm giá đã đổi', link: '/vouchers' },
        { icon: <MapPin size={22} />, label: 'Sổ địa chỉ', desc: 'Quản lý địa chỉ nhận hàng', link: '/address' },
      ]
    },
    {
      title: 'Tài khoản & Bảo mật',
      items: [
        { icon: <Bell size={22} />, label: 'Thông báo', desc: 'Tin khuyến mãi & đơn hàng', link: '/notifications' },
        { icon: <Settings size={22} />, label: 'Cài đặt', desc: 'Chỉnh sửa thông tin cá nhân', link: '/settings' },
        { icon: <ShieldCheck size={22} />, label: 'Bảo mật', desc: 'Đổi mật khẩu & xác minh', link: '/security' },
        { icon: <Star size={22} />, label: 'Đánh giá', desc: 'Sản phẩm đã mua', link: '/reviews' },
      ]
    }
  ];

  return (
    <div className="bg-surface min-h-screen py-12 font-sans">
      <div className="container">
        {/* Profile Header Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* User & Baby Summary */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-[3.5rem] p-8 md:p-12 shadow-sm border border-gray-50 relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
               <div className="relative group shrink-0">
                  <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center text-primary border-4 border-white shadow-xl overflow-hidden">
                    <User size={64} />
                  </div>
                  <button className="absolute bottom-1 right-1 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-gray-400 hover:text-primary transition-all border border-gray-50">
                    <Edit2 size={16} />
                  </button>
               </div>

               <div className="flex-1 text-center md:text-left relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                    <h1 className="text-3xl font-black text-gray-900">{user.name}</h1>
                    <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest inline-block md:inline-flex items-center gap-1.5 self-center">
                      <Award size={12} /> Thành viên Bạc
                    </span>
                  </div>
                  <p className="text-gray-400 font-bold mb-8">{user.email}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                     <div className="bg-surface rounded-2xl p-4">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Điểm tích lũy</div>
                        <div className="text-2xl font-black text-primary flex items-baseline gap-1">
                          {user.points || 0} <span className="text-[11px] uppercase">pts</span>
                        </div>
                     </div>
                     <div className="bg-surface rounded-2xl p-4">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Đơn hàng</div>
                        <div className="text-2xl font-black text-secondary">{orderCount}</div>
                     </div>
                     <div className="bg-surface rounded-2xl p-4 hidden md:block">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Hạng thành viên</div>
                        <div className="text-2xl font-black text-accent">Silver</div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Baby Health Card Desktop Layout */}
            {babyProfile ? (
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-primary rounded-[3rem] p-10 text-white shadow-2xl shadow-primary/20 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-40 -mt-40" />
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-white/20 rounded-[2rem] flex items-center justify-center backdrop-blur-md shadow-xl border border-white/20">
                           <Baby size={48} />
                        </div>
                        <div className="space-y-1">
                           <h2 className="text-3xl font-black">{babyProfile.name}</h2>
                           <div className="flex items-center gap-2 opacity-80">
                             <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                             <span className="text-[11px] font-black uppercase tracking-widest">Đang trong giai đoạn phát triển vàng</span>
                           </div>
                        </div>
                    </div>
                    
                    <div className="flex gap-8 items-center bg-white/10 p-2 rounded-3xl backdrop-blur-md border border-white/10">
                        <div className="flex flex-col items-center px-6 py-4">
                           <Calendar size={20} className="mb-2 opacity-60" />
                           <div className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Tuổi của bé</div>
                           <div className="text-lg font-black">{getBabyAgeText(babyProfile.dob)}</div>
                        </div>
                        <div className="w-px h-12 bg-white/10" />
                        <div className="flex flex-col items-center px-6 py-4">
                           <Weight size={20} className="mb-2 opacity-60" />
                           <div className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Cân nặng</div>
                           <div className="text-lg font-black">{babyProfile.weight} kg</div>
                        </div>
                        <div className="w-px h-12 bg-white/10" />
                        <div className="flex flex-col items-center px-6 py-4">
                           <Droplet size={20} className="mb-2 opacity-60" />
                           <div className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Đặc điểm da</div>
                           <div className="text-lg font-black">
                             {babyProfile.skinType === 'normal' ? 'Thường' : babyProfile.skinType === 'sensitive' ? 'Nhạy cảm' : 'Hăm tã'}
                           </div>
                        </div>
                    </div>

                    <Link to="/onboarding" className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all shadow-xl group border border-white/20 text-white">
                       <Edit2 size={24} className="group-hover:rotate-12 transition-transform" />
                    </Link>
                </div>
              </motion.div>
            ) : (
              <Link to="/onboarding" className="bg-white rounded-[3rem] p-10 border-2 border-dashed border-gray-100 flex flex-col items-center text-center hover:border-primary/20 hover:bg-primary/5 transition-all group">
                <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-200 group-hover:bg-primary/10 group-hover:text-primary transition-all mb-4">
                   <Baby size={48} />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Ba mẹ chưa tạo hồ sơ cho bé?</h3>
                <p className="text-gray-400 font-medium max-w-sm mb-6">Tạo hồ sơ ngay để nhận gợi ý size tã, loại sữa & thực phẩm phù hợp nhất theo từng giai đoạn phát triển.</p>
                <div className="btn-outline !h-12 !px-8 !rounded-xl text-xs font-black uppercase tracking-widest group-hover:bg-primary group-hover:text-white group-hover:border-primary">Tạo hồ sơ bé</div>
              </Link>
            )}
          </div>

          {/* Right Column: Rewards & Side Links */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-50">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <Gift size={18} className="text-secondary" /> Đổi thưởng
                  </h3>
                  <div className="text-[10px] font-black text-secondary bg-secondary/10 px-3 py-1 rounded-full uppercase">
                    {user.points || 0} pts
                  </div>
               </div>
               
               <div className="space-y-4">
                  <div className="bg-surface rounded-3xl p-6 border border-gray-50 space-y-4 group hover:border-secondary/20 transition-all cursor-pointer">
                     <div className="text-sm font-black text-gray-900">Voucher giảm giá 20k</div>
                     <div className="flex items-center justify-between">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tiêu tốn 500 điểm</div>
                        <button className="text-xs font-black text-secondary hover:underline underline-offset-4">Đổi ngay →</button>
                     </div>
                  </div>
                  <div className="bg-surface rounded-3xl p-6 border border-gray-50 space-y-4 opacity-50 grayscale">
                     <div className="text-sm font-black text-gray-900">Tặng đồ chơi cho bé</div>
                     <div className="flex items-center justify-between">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tiêu tốn 2500 điểm</div>
                        <span className="text-[10px] font-black text-gray-300">Chưa đủ điểm</span>
                     </div>
                  </div>
               </div>

               <div className="mt-10 pt-8 border-t border-gray-50">
                  <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-red-50 text-red-500 font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm">
                    <LogOut size={16} /> Đăng xuất tài khoản
                  </button>
               </div>
            </div>

            {isAdmin && (
              <Link to="/admin" className="bg-gray-900 rounded-[3rem] p-10 text-white shadow-2xl flex items-center justify-between group overflow-hidden relative">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
                 <div className="relative z-10">
                    <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Internal Management</div>
                    <h3 className="text-xl font-black">Hệ thống Quản trị</h3>
                 </div>
                 <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md group-hover:bg-primary transition-all relative z-10">
                    <ChevronRight size={24} />
                 </div>
              </Link>
            )}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="space-y-6">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.3em] ml-6">{group.title}</h3>
              <div className="grid grid-cols-1 gap-4">
                {group.items.map((item, iIdx) => (
                  <Link 
                    key={iIdx} 
                    to={item.link}
                    className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-50 flex items-center gap-6 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-0.5">
                        <span className="text-lg font-black text-gray-900 group-hover:text-primary transition-colors">{item.label}</span>
                        {item.badge && (
                          <span className="bg-green-100 text-green-600 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">{item.badge}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 font-bold">{item.desc}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-primary group-hover:text-white transition-all">
                       <ChevronRight size={20} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
