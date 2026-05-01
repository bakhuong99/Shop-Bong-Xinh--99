import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, ChevronRight, Clock, MapPin, Repeat, X, Phone, User, ExternalLink, ShoppingBag, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { cn } from '../lib/utils';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAppContext } from '../context/AppContext';
import { Order } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export const OrdersPage: React.FC = () => {
  const { user } = useAppContext();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);

  React.useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    });

    return () => unsubscribe();
  }, [user]);

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'processing': return 'Đang chuẩn bị';
      case 'shipping': return 'Đang giao hàng';
      case 'completed': return 'Đã hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-600';
      case 'processing': return 'bg-blue-100 text-blue-600';
      case 'shipping': return 'bg-purple-100 text-purple-600';
      case 'completed': return 'bg-green-100 text-green-600';
      case 'cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'processing': return <Package size={16} />;
      case 'shipping': return <Truck size={16} />;
      case 'completed': return <CheckCircle2 size={16} />;
      case 'cancelled': return <AlertCircle size={16} />;
      default: return null;
    }
  };

  if (!user) {
    return (
      <div className="bg-surface min-h-screen flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-gray-200 mb-8 shadow-sm border border-gray-50">
           <User size={64} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4">Vui lòng đăng nhập</h2>
        <p className="text-gray-500 font-medium mb-10 max-w-md mx-auto">Ba mẹ cần đăng nhập để xem lịch sử đơn hàng và theo dõi hành trình hàng về cho bé.</p>
        <Link to="/onboarding" className="btn-primary px-12 !h-16 !rounded-2xl shadow-xl shadow-primary/20 text-lg font-black uppercase tracking-widest">Đăng nhập ngay</Link>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen py-12 font-sans text-gray-900">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
           <div>
              <h1 className="text-4xl font-black text-gray-900 leading-tight">Lịch sử đơn hàng</h1>
              <p className="text-gray-400 font-bold mt-2">Theo dõi và quản lý các món quà cho bé</p>
           </div>
           <div className="flex gap-4">
              <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-50 flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><ShoppingBag size={20} /></div>
                 <div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Tổng đơn</div>
                    <div className="text-xl font-black text-gray-900 leading-none">{orders.length}</div>
                 </div>
              </div>
           </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-[2.5rem] p-8 animate-pulse border border-gray-50">
                <div className="h-6 bg-gray-100 rounded-lg w-1/2 mb-6" />
                <div className="h-24 bg-gray-50 rounded-2xl mb-6" />
                <div className="h-12 bg-gray-100 rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {orders.map((order, idx) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50 flex flex-col group hover:shadow-xl hover:shadow-primary/5 transition-all"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Order ID</div>
                    <div className="text-sm font-black text-gray-900">#{order.id.slice(-8).toUpperCase()}</div>
                  </div>
                  <div className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
                    getStatusColor(order.status)
                  )}>
                    {getStatusIcon(order.status)}
                    {getStatusLabel(order.status)}
                  </div>
                </div>

                <div className="flex-1 space-y-4 mb-8">
                   <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary/20 shadow-sm">
                        <ShoppingBag size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-black text-gray-900 truncate">
                          {order.items.length} sản phẩm cho bé
                        </div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                          Mua ngày {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                   </div>

                   <div className="flex items-center justify-between px-2">
                      <div className="text-2xl font-black text-primary tracking-tight">{order.total.toLocaleString()}đ</div>
                      {order.items.some(i => (i as any).purchaseType === 'subscribe') && (
                        <div className="bg-secondary/10 text-secondary text-[9px] font-black px-3 py-1 rounded-lg flex items-center gap-1.5 uppercase tracking-wider">
                          <Repeat size={12} /> Định kỳ
                        </div>
                      )}
                   </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="flex-1 h-12 rounded-xl bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-gray-100 hover:text-gray-900 transition-all"
                  >
                    Chi tiết
                  </button>
                  <button className="flex-1 h-12 rounded-xl bg-primary text-white text-[10px] font-black shadow-lg shadow-primary/10 hover:shadow-primary/30 transition-all uppercase tracking-widest">
                    Mua lại
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && orders.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-primary/20 mx-auto mb-8 shadow-sm border border-gray-50">
              <Package size={64} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">Chưa có đơn hàng nào</h2>
            <p className="text-gray-500 font-medium mb-10 max-w-sm mx-auto text-lg leading-relaxed">Hãy bắt đầu hành trình chăm sóc bé yêu cùng Shop Bống Xinh ngay hôm nay nhé!</p>
            <Link to="/" className="btn-primary inline-flex px-12 !h-16 !rounded-2xl shadow-xl shadow-primary/20 text-lg font-black uppercase tracking-widest">Khám phá ngay</Link>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[4rem] shadow-2xl p-10 md:p-12 overflow-y-auto max-h-[90vh] font-sans"
            >
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-3xl font-black text-gray-900">Chi tiết đơn hàng</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Order #{selectedOrder.id.slice(-8).toUpperCase()}</span>
                    <span className={cn("px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest", getStatusColor(selectedOrder.status))}>
                      {getStatusLabel(selectedOrder.status)}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all shadow-sm"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-10">
                {/* Items List */}
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] px-2">Sản phẩm trong đơn</h4>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex gap-6 items-center p-4 rounded-3xl bg-surface border border-gray-50 transition-all hover:border-primary/20">
                        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center p-3 shrink-0 shadow-sm border border-gray-50">
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-lg font-black text-gray-900 truncate">{item.name}</div>
                          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                            {item.quantity} x {item.price.toLocaleString()}đ
                            {(item as any).purchaseType === 'subscribe' && <span className="ml-2 text-secondary">| Định kỳ</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-black text-primary tracking-tight">
                            {(item.price * item.quantity).toLocaleString()}đ
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 rounded-[3rem] bg-secondary/5 border border-secondary/10 space-y-6">
                    <h4 className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-4">Thông tin nhận hàng</h4>
                    <div className="space-y-5">
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-secondary shadow-sm"><User size={18} /></div>
                        <div className="text-sm font-black text-gray-700">{(selectedOrder as any).customerName || user.name}</div>
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-secondary shadow-sm"><Phone size={18} /></div>
                        <div className="text-sm font-black text-gray-700">{(selectedOrder as any).customerPhone || 'Không có SĐT'}</div>
                      </div>
                      <div className="flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-secondary shadow-sm shrink-0"><MapPin size={18} /></div>
                        <div className="text-sm font-bold text-gray-700 leading-relaxed">{selectedOrder.shippingAddress}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 rounded-[3rem] bg-gray-900 text-white shadow-2xl shadow-gray-900/20 flex flex-col justify-between">
                    <div className="space-y-6">
                       <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Thanh toán</h4>
                       <div className="space-y-4">
                          <div className="flex justify-between items-center">
                             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hình thức</span>
                             <span className="text-sm font-black">COD (Giao hàng thu hồ)</span>
                          </div>
                          <div className="flex justify-between items-center">
                             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phí ship</span>
                             <span className="text-sm font-black text-green-400">Miễn phí</span>
                          </div>
                       </div>
                    </div>
                    
                    <div className="pt-6 border-t border-white/10 mt-6 flex justify-between items-center">
                       <span className="text-xs font-black uppercase tracking-[0.2em]">Tổng thanh toán</span>
                       <span className="text-3xl font-black text-primary tracking-tight">{selectedOrder.total.toLocaleString()}đ</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
