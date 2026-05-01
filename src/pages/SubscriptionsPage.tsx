import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Repeat, 
  ChevronRight, 
  Calendar, 
  Truck, 
  Pause, 
  Trash2, 
  AlertCircle,
  Plus,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { cn } from '../lib/utils';

export const SubscriptionsPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = React.useState([
    {
      id: 'sub-1',
      productName: 'Tã dán Moony Natural Size NB',
      productImage: 'https://picsum.photos/seed/moony1/100/100',
      frequency: 'Hàng tháng',
      nextDelivery: '15/05/2026',
      status: 'active',
      price: 310250, // 15% off 365000
      quantity: 2
    },
    {
      id: 'sub-2',
      productName: 'Sữa Meiji Growing Up Formula 800g',
      productImage: 'https://picsum.photos/seed/meiji1/100/100',
      frequency: '2 tuần / lần',
      nextDelivery: '02/05/2026',
      status: 'active',
      price: 391000, // 15% off 460000
      quantity: 1
    }
  ]);

  return (
    <div className="bg-surface min-h-screen pb-24 font-sans">
      <Header title="Subscribe & Save" showBack />

      <div className="p-4 flex flex-col gap-6">
        {/* Intro */}
        <section className="bg-primary rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-primary/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="relative z-10">
            <h2 className="text-xl font-extrabold mb-1">Tiết kiệm 15% dài lâu</h2>
            <p className="text-white/70 text-[11px] font-medium leading-relaxed max-w-[220px]">Bỉm và sữa luôn được giao đúng hẹn, không lo hết hàng, không cần đặt lại.</p>
          </div>
          <div className="absolute bottom-4 right-4 bg-white/20 p-2 rounded-2xl backdrop-blur-md">
            <Repeat size={32} className="text-white" />
          </div>
        </section>

        {/* List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Đang hoạt động ({subscriptions.length})</h3>
            <button className="text-xs font-bold text-primary flex items-center gap-1">
              <Plus size={14} /> Thêm mới
            </button>
          </div>

          <AnimatePresence>
            {subscriptions.map((sub, idx) => (
              <motion.div 
                key={sub.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="clay-card p-4 space-y-4"
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0">
                    <img 
                      src={sub.productImage} 
                      alt={sub.productName} 
                      className="w-16 h-16 object-contain mix-blend-multiply"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-extrabold text-secondary uppercase tracking-tighter mb-1 flex items-center gap-1">
                      <RefreshCw size={10} /> Định kỳ {sub.frequency}
                    </div>
                    <h4 className="text-sm font-extrabold text-gray-900 line-clamp-2 leading-tight mb-2">{sub.productName}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-extrabold text-primary">{sub.price.toLocaleString()}đ</span>
                      <span className="text-[10px] font-medium text-gray-400">Số lượng: {sub.quantity}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <Calendar size={12} /> Giao dự kiến
                    </div>
                    <div className="text-xs font-extrabold text-gray-900">{sub.nextDelivery}</div>
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <Truck size={12} /> Trạng thái
                    </div>
                    <div className="bg-green-100 text-green-600 text-[9px] font-extrabold px-2 py-0.5 rounded-full w-fit uppercase">
                      Chuẩn bị giao
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button className="flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-100 text-[11px] font-bold text-gray-500 hover:bg-gray-50 transition-colors">
                    <Pause size={14} /> Tạm dừng
                  </button>
                  <button className="flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-100 text-[11px] font-bold text-gray-500 hover:bg-gray-50 transition-colors">
                    <Trash2 size={14} /> Hủy gói
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </section>

        {/* Info Box */}
        <section className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
          <AlertCircle size={20} className="text-blue-500 shrink-0" />
          <div className="text-[11px] text-blue-700 leading-relaxed font-medium">
            Hệ thống sẽ gửi thông báo trước 3 ngày để bạn xác nhận trước khi tự động tạo đơn hàng và thanh toán. Bạn có thể bỏ qua bất kỳ kỳ giao nào nếu vẫn còn hàng.
          </div>
        </section>

        {/* Explore More */}
        <section className="text-center py-10">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-200">
            <ShoppingBag size={28} />
          </div>
          <h4 className="font-bold text-gray-900 text-sm mb-1">Thêm sản phẩm định kỳ?</h4>
          <p className="text-gray-500 text-xs mb-6">Tiết kiệm nhiều hơn với các thương hiệu bỉm tã khác</p>
          <Link to="/" className="text-primary font-extrabold text-sm flex items-center justify-center gap-2">
            Khám phá ngay <ChevronRight size={16} />
          </Link>
        </section>
      </div>
    </div>
  );
};
