import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { MessageCircle, Phone, Facebook, Instagram, Youtube, MapPin, Mail, ChevronRight } from 'lucide-react';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface font-sans">
      {/* Top Banner */}
      <div className="bg-primary text-white py-2 text-center text-xs font-bold px-4">
        <p>🎉 Ưu đãi tháng Vàng: Giảm đến 50% cho các dòng bỉm nhập khẩu! <Link to="/category/bim-sua" className="underline ml-1">Mua ngay</Link></p>
      </div>

      <Header />
      
      {/* Navigation - Desktop Only */}
      <nav className="bg-white border-b border-gray-100 hidden md:block sticky top-16 z-30">
        <div className="container flex items-center gap-8 h-14">
          <div className="bg-secondary text-white px-6 h-full flex items-center gap-2 font-black text-sm cursor-pointer hover:bg-opacity-90">
            <div className="flex flex-col gap-0.5">
              <div className="w-4 h-0.5 bg-white"></div>
              <div className="w-4 h-0.5 bg-white"></div>
              <div className="w-4 h-0.5 bg-white"></div>
            </div>
            DANH MỤC SẢN PHẨM
          </div>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm font-bold text-gray-700 hover:text-primary transition-colors">Trang chủ</Link>
            <Link to="/category/bim-sua" className="text-sm font-bold text-gray-700 hover:text-primary transition-colors">Bỉm sữa</Link>
            <Link to="/category/do-dung-so-sinh" className="text-sm font-bold text-gray-700 hover:text-primary transition-colors">Đồ dùng sơ sinh</Link>
            <Link to="/category/thuc-pham-an-dam" className="text-sm font-bold text-gray-700 hover:text-primary transition-colors">Thực phẩm ăn dặm</Link>
            <Link to="/category/khuyen-mai" className="text-sm font-bold text-accent flex items-center gap-1 animate-pulse">
              Tin Khuyến Mãi 🔥
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer - Desktop Only */}
      <footer className="bg-white border-t border-gray-100 pt-16 pb-8 hidden md:block">
        <div className="container grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white font-black text-2xl">B</span>
              </div>
              <span className="font-black text-2xl tracking-tighter text-gray-900">SHOP BỐNG XINH</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Đồng hành cùng hàng triệu bà mẹ Việt Nam trên chặng đường nuôi dưỡng và chăm sóc thiên thần nhỏ.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary/10 hover:text-primary transition-all">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary/10 hover:text-primary transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary/10 hover:text-primary transition-all">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs mb-6">Chính Sách</h4>
            <ul className="space-y-4">
              {['Mua hàng & Thanh toán', 'Giao hàng & Lắp đặt', 'Đổi / Trả / Bảo hành', 'Khách hàng thân thiết'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm font-bold text-gray-500 hover:text-primary transition-colors flex items-center gap-1 group">
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs mb-6">Thông Tin</h4>
            <ul className="space-y-4">
              {['Giới thiệu SHOP BỐNG XINH', 'Cam kết chất lượng', 'Tin tức & Mẹo hay', 'Tuyển dụng'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm font-bold text-gray-500 hover:text-primary transition-colors flex items-center gap-1 group">
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs mb-6">Liên Hệ</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-gray-500">
                <MapPin size={18} className="text-secondary shrink-0" />
                <span>Phường Mão Điền - Bắc Ninh</span>
              </li>
              <li className="flex gap-3 text-sm text-gray-500">
                <Phone size={18} className="text-secondary shrink-0" />
                <span>Số điện thoại: 0984.158.568</span>
              </li>
              <li className="flex gap-3 text-sm text-gray-500">
                <Mail size={18} className="text-secondary shrink-0" />
                <span>Zalo: 0984.158.568</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-8 text-center">
          <p className="text-xs text-gray-400 font-bold">
            &copy; {new Date().getFullYear()} Hệ thống mẹ và bé SHOP BỐNG XINH. Đã đăng ký bản quyền.
          </p>
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden">
        <BottomNav />
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
        <a 
          href="tel:0984158568" 
          className="w-14 h-14 bg-secondary text-white rounded-full flex items-center justify-center shadow-xl shadow-secondary/30 transition-transform active:scale-90 hover:scale-110"
        >
          <Phone size={24} />
        </a>
        <a 
          href="https://zalo.me/0984158568" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-14 h-14 bg-[#0068ff] text-white rounded-full flex items-center justify-center shadow-xl shadow-blue-500/30 transition-transform active:scale-90 hover:scale-110"
        >
          <MessageCircle size={28} />
        </a>
      </div>
    </div>
  );
};
