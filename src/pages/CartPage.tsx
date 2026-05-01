import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Trash2, Repeat, ArrowRight, CreditCard, ChevronRight, User, Phone, MapPin, Loader2, Minus, Plus, ShoppingCart, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAppContext } from '../context/AppContext';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cn } from '../lib/utils';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const { items, total, removeItem, updateQuantity, clearCart, getProductPrice } = useCart();
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderInfo, setOrderInfo] = useState({
    name: user?.name || '',
    phone: '',
    address: ''
  });

  const handleCheckout = () => {
    if (items.length === 0) return;
    setStep('checkout');
  };

  const submitOrder = async () => {
    if (!user) {
      alert("Vui lòng đăng nhập để đặt hàng!");
      return;
    }

    if (!orderInfo.name || !orderInfo.phone || !orderInfo.address) {
      alert("Vui lòng nhập đầy đủ thông tin giao hàng!");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        userId: user.id,
        items: items.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          price: getProductPrice(item.product, item.purchaseType),
          quantity: item.quantity,
          imageUrl: item.product.imageUrl,
          purchaseType: item.purchaseType
        })),
        total,
        status: 'pending',
        paymentMethod: 'cod',
        shippingAddress: `${orderInfo.address} - SĐT: ${orderInfo.phone} - Người nhận: ${orderInfo.name}`,
        customerName: orderInfo.name,
        customerPhone: orderInfo.phone,
        createdAt: Date.now(),
      };

      try {
        await addDoc(collection(db, 'orders'), orderData);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'orders');
      }
      
      const pointsEarned = Math.floor(total / 100);
      try {
        await updateDoc(doc(db, 'users', user.id), {
          points: increment(pointsEarned)
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${user.id}`);
      }
      
      setStep('success');
      clearCart();
    } catch (error) {
      console.error("Order error:", error);
      alert("Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && step === 'cart') {
    return (
      <div className="bg-surface min-h-screen flex flex-col py-20">
        <div className="container flex-1 flex flex-col items-center justify-center p-10 text-center">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-primary/20 mb-8 shadow-sm border border-gray-50">
            <ShoppingBag size={64} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">Giỏ hàng đang trống</h2>
          <p className="text-gray-500 font-medium mb-10 max-w-md mx-auto">Dạo quanh Shop Bống Xinh để chọn những món đồ xinh nhất cho bé nhé!</p>
          <Link to="/" className="btn-primary px-12 !rounded-2xl shadow-xl shadow-primary/20">Quay lại mua sắm</Link>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="bg-surface min-h-screen py-20">
        <div className="container max-w-2xl text-center space-y-8 bg-white p-16 rounded-[4rem] shadow-sm border border-gray-50">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 mx-auto shadow-inner">
            <CheckCircle2 size={48} />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-gray-900 leading-tight">Đặt hàng thành công!</h1>
            <p className="text-gray-500 font-medium text-lg leading-relaxed px-10">Cảm ơn ba mẹ đã tin tưởng Shop Bống Xinh. Chúng mình sẽ liên hệ sớm nhất để xác nhận đơn hàng.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 pt-6">
            <button onClick={() => navigate('/orders')} className="flex-1 btn-outline !rounded-2xl !h-16 font-black uppercase tracking-widest">Xem đơn hàng</button>
            <button onClick={() => navigate('/')} className="flex-1 btn-primary !rounded-2xl !h-16 font-black uppercase tracking-widest">Tiếp tục mua sắm</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen py-12 font-sans">
      <div className="container">
        {/* Stepper */}
        <div className="max-w-3xl mx-auto mb-16 px-4">
           <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 z-0" />
              <div className={cn("absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-500", step === 'cart' ? 'w-0' : 'w-full')} />
              
              {[
                { id: 'cart', label: 'Giỏ hàng', icon: <ShoppingCart size={20} /> },
                { id: 'checkout', label: 'Thanh toán', icon: <CreditCard size={20} /> },
                { id: 'done', label: 'Hoàn thiện', icon: <CheckCircle2 size={20} /> }
              ].map((s, i) => (
                <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
                   <div className={cn(
                     "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                     (step === s.id || (step === 'checkout' && s.id === 'cart')) ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110" : "bg-white text-gray-300 border-2 border-gray-50"
                   )}>
                     {s.icon}
                   </div>
                   <span className={cn(
                     "text-[10px] font-black uppercase tracking-[0.2em]",
                     (step === s.id || (step === 'checkout' && s.id === 'cart')) ? "text-primary" : "text-gray-300"
                   )}>{s.label}</span>
                </div>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            <AnimatePresence mode="wait">
              {step === 'cart' ? (
                <motion.section 
                  key="cart"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-50"
                >
                  <h2 className="text-2xl font-black text-gray-900 mb-8">Sản phẩm trong giỏ ({items.length})</h2>
                  <div className="space-y-8">
                    {items.map((item) => (
                      <div key={`${item.product.id}-${item.purchaseType}`} className="flex flex-col md:flex-row gap-8 items-center border-b border-gray-50 pb-8 last:border-0 last:pb-0 group">
                        <div className="w-32 h-32 bg-surface rounded-[2rem] flex items-center justify-center shrink-0 p-4 border border-gray-50/50">
                          <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform" />
                        </div>
                        
                        <div className="flex-1 space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <Link to={`/product/${item.product.id}`} className="text-lg font-black text-gray-900 hover:text-primary transition-colors leading-tight">{item.product.name}</Link>
                              <div className="flex items-center gap-2 mt-2">
                                {item.purchaseType === 'subscribe' ? (
                                  <span className="bg-secondary/10 text-secondary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                                    <Repeat size={12} /> Hợp đồng định kỳ
                                  </span>
                                ) : (
                                  <span className="bg-gray-100 text-gray-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">Mua lẻ một lần</span>
                                )}
                              </div>
                            </div>
                            <button onClick={() => removeItem(item.product.id, item.purchaseType)} className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm">
                              <Trash2 size={18} />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center bg-surface p-1.5 rounded-2xl border border-gray-100 gap-4">
                              <button onClick={() => updateQuantity(item.product.id, item.purchaseType, item.quantity - 1)} className="w-10 h-10 rounded-xl bg-white text-gray-900 shadow-sm flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
                                <Minus size={18} />
                              </button>
                              <span className="w-8 text-center font-black text-gray-900">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.product.id, item.purchaseType, item.quantity + 1)} className="w-10 h-10 rounded-xl bg-white text-gray-900 shadow-sm flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
                                <Plus size={18} />
                              </button>
                            </div>
                            <div className="text-xl font-black text-primary">
                              {(getProductPrice(item.product, item.purchaseType) * item.quantity).toLocaleString()}đ
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.section>
              ) : (
                <motion.section 
                  key="checkout"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-50 space-y-8">
                    <h2 className="text-2xl font-black text-gray-900">Thông tin nhận hàng</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Người nhận</label>
                        <div className="relative">
                          <User size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                          <input 
                            type="text" 
                            className="w-full h-16 pl-14 pr-6 bg-surface border-transparent rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold"
                            placeholder="Tên ba mẹ..."
                            value={orderInfo.name}
                            onChange={e => setOrderInfo({...orderInfo, name: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Số điện thoại</label>
                        <div className="relative">
                          <Phone size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                          <input 
                            type="tel" 
                            className="w-full h-16 pl-14 pr-6 bg-surface border-transparent rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold"
                            placeholder="Số liên hệ..."
                            value={orderInfo.phone}
                            onChange={e => setOrderInfo({...orderInfo, phone: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Địa chỉ giao hàng</label>
                      <div className="relative">
                        <MapPin size={20} className="absolute left-5 top-6 text-gray-300" />
                        <textarea 
                          className="w-full min-h-[120px] pt-6 pl-14 pr-6 bg-surface border-transparent rounded-3xl focus:ring-2 focus:ring-primary/20 font-bold resize-none"
                          placeholder="Địa chỉ cụ thể (Số nhà, tên đường...)"
                          value={orderInfo.address}
                          onChange={e => setOrderInfo({...orderInfo, address: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-50 space-y-8">
                     <h2 className="text-2xl font-black text-gray-900">Phương thức thanh toán</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-primary/5 border-2 border-primary rounded-[2rem] p-6 flex items-center justify-between relative overflow-hidden">
                           <div className="flex items-center gap-4 relative z-10">
                              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                <CreditCard size={24} />
                              </div>
                              <div>
                                <span className="block font-black text-gray-900">COD</span>
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Thanh toán khi nhận</span>
                              </div>
                           </div>
                           <CheckCircle2 size={24} className="text-primary relative z-10" />
                        </div>
                        <div className="bg-gray-50 border-2 border-transparent rounded-[2rem] p-6 flex items-center justify-between opacity-50 grayscale cursor-not-allowed">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-300">
                                <MapPin size={24} />
                              </div>
                              <div>
                                <span className="block font-black text-gray-400">VNPay</span>
                                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Sắp ra mắt</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-4 sticky top-36">
            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-50 space-y-8">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">Tóm tắt đơn hàng</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-bold uppercase tracking-widest">Tạm tính ({items.length} món)</span>
                  <span className="text-gray-900 font-black">{total.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-bold uppercase tracking-widest">Phí vận chuyển</span>
                  <span className="text-green-500 font-black">Miễn phí</span>
                </div>
                <div className="h-px bg-gray-50" />
                <div className="flex justify-between items-center text-xl">
                  <span className="text-gray-900 font-black uppercase tracking-widest">Tổng cộng</span>
                  <span className="text-primary font-black tracking-tight">{total.toLocaleString()}đ</span>
                </div>
              </div>

              {step === 'cart' ? (
                <button 
                  onClick={handleCheckout}
                  className="w-full btn-primary !h-16 !rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all group"
                >
                  Thanh toán ngay
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <div className="space-y-4">
                   <button 
                    onClick={submitOrder}
                    disabled={isSubmitting}
                    className="w-full btn-primary !h-16 !rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <ShieldCheck size={20} />}
                    Xác nhận đơn hàng
                  </button>
                  <button 
                    onClick={() => setStep('cart')}
                    className="w-full text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] hover:text-primary transition-colors"
                  >
                    Quay lại chỉnh sửa
                  </button>
                </div>
              )}

              <div className="pt-6 text-center space-y-4">
                 <div className="flex items-center justify-center gap-2">
                    <ShieldCheck size={14} className="text-secondary" />
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Thanh toán an toàn 100%</span>
                 </div>
                 <p className="text-[9px] text-gray-300 font-medium leading-relaxed">Bằng cách xác nhận đơn hàng, ba mẹ đồng ý với các Điều khoản & Chính sách của Shop Bống Xinh</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
