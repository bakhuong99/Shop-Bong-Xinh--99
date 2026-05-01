import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ChevronRight, 
  Package, 
  Image as ImageIcon,
  DollarSign,
  Tag,
  Layers,
  Save,
  X,
  Users as UsersIcon,
  ShoppingBag,
  Award,
  PlusCircle,
  TrendingUp
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, User, Brand } from '../types';
import { useAppContext } from '../context/AppContext';
import { Navigate } from 'react-router-dom';
import { cn } from '../lib/utils';

import { MOCK_PRODUCTS, BRANDS as SEED_BRANDS } from '../services/mockData';

const CATEGORIES = ["Bỉm sữa", "Đồ dùng sơ sinh", "Thực phẩm ăn dặm", "Đồ dùng cho mẹ bầu và sau sinh"];

export const AdminDashboard: React.FC = () => {
  const { isAdmin, isLoading: contextLoading } = useAppContext();
  const [activeTab, setActiveTab] = useState<'inventory' | 'customers' | 'brands' | 'settings'>('inventory');
  
  // Inventory State
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Customers State
  const [customers, setCustomers] = useState<User[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [pointsAdjust, setPointsAdjust] = useState(0);

  // Brands State
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isAddingBrand, setIsAddingBrand] = useState(false);
  const [brandName, setBrandName] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    imageUrl: '',
    category: 'Bỉm sữa' as any,
    brand: '',
    stock: 0,
    description: '',
    isSubscribeable: true,
    promotionType: 'none',
    promotionValue: 0
  });

  const seedData = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn nạp dữ liệu mẫu? Thao tác này sẽ thêm nhiều sản phẩm và nhãn hàng mới.")) return;
    setIsSeeding(true);
    try {
      // Seed Brands
      for (const bName of SEED_BRANDS) {
        if (!brands.some(b => b.name === bName)) {
          await addDoc(collection(db, 'brands'), { name: bName });
        }
      }
      
      // Seed Products
      for (const prod of MOCK_PRODUCTS) {
        const { id, ...prodData } = prod;
        await addDoc(collection(db, 'products'), prodData);
      }
      
      alert("Đã nạp dữ liệu mẫu thành công!");
    } catch (error) {
      console.error("Seeding failed:", error);
      alert("Lỗi khi nạp dữ liệu.");
    } finally {
      setIsSeeding(false);
    }
  };

  useEffect(() => {
    const unsubProd = onSnapshot(query(collection(db, 'products'), orderBy('category')), (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    });

    const unsubCust = onSnapshot(query(collection(db, 'users'), orderBy('createdAt', 'desc')), (snapshot) => {
      setCustomers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User)));
    });

    const unsubBrands = onSnapshot(query(collection(db, 'brands'), orderBy('name')), (snapshot) => {
      setBrands(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Brand)));
    });

    setIsLoading(false);
    return () => {
      unsubProd();
      unsubCust();
      unsubBrands();
    };
  }, []);

  if (contextLoading) return null;
  if (!isAdmin) return <Navigate to="/" replace />;

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), formData);
      } else {
        await addDoc(collection(db, 'products'), formData);
      }
      resetProductForm();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Lỗi khi lưu sản phẩm.");
    }
  };

  const handleProductDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      await deleteDoc(doc(db, 'products', id));
    }
  };

  const resetProductForm = () => {
    setFormData({
      name: '', price: 0, imageUrl: '', category: 'Bỉm sữa' as any, brand: '', stock: 0, description: '', isSubscribeable: true, promotionType: 'none', promotionValue: 0
    });
    setIsAddingProduct(false);
    setEditingId(null);
  };

  const handleAdjustPoints = async () => {
    if (!selectedCustomer) return;
    await updateDoc(doc(db, 'users', selectedCustomer.id), { points: increment(pointsAdjust) });
    setPointsAdjust(0);
    setSelectedCustomer(null);
  };

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName) return;
    await addDoc(collection(db, 'brands'), { name: brandName });
    setBrandName('');
    setIsAddingBrand(false);
  };

  const startEdit = (product: Product) => {
    setFormData(product);
    setEditingId(product.id);
    setIsAddingProduct(true);
  };

  return (
    <div className="bg-surface min-h-screen pb-24 font-sans text-gray-900">
      <Header title="Quản trị hệ thống" showBack />

      <div className="sticky top-16 bg-white/80 backdrop-blur-md z-[60] flex px-4 border-b border-gray-50">
        {[
          { id: 'inventory', label: 'Kho hàng', icon: Package },
          { id: 'customers', label: 'Khách hàng', icon: UsersIcon },
          { id: 'brands', label: 'Nhãn hàng', icon: Tag },
          { id: 'settings', label: 'Hệ thống', icon: RefreshCcw }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={cn("flex-1 flex flex-col items-center py-4 gap-1 relative", activeTab === tab.id ? "text-primary" : "text-gray-300")}>
            <tab.icon size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
            {activeTab === tab.id && <motion.div layoutId="adm-tab" className="absolute bottom-0 left-4 right-4 h-1 bg-primary rounded-t-full" />}
          </button>
        ))}
      </div>

      <div className="p-4">
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <section className="grid grid-cols-2 gap-4">
              <div className="clay-card !p-4">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Cần bổ sung</div>
                <div className="text-2xl font-black text-red-500">{products.filter(p => (p.stock || 0) < 5).length}</div>
              </div>
              <div className="clay-card !p-4">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Số mặt hàng</div>
                <div className="text-2xl font-black text-secondary">{products.length}</div>
              </div>
            </section>
            <button onClick={() => setIsAddingProduct(true)} className="w-full btn-primary !h-14 !rounded-2xl"><PlusCircle size={20} /> Thêm sản phẩm</button>
            <div className="space-y-3">
              {products.map(p => (
                <div key={p.id} className="clay-card flex gap-4 items-center">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl p-1 shrink-0"><img src={p.imageUrl} className="mix-blend-multiply w-full h-full object-contain" referrerPolicy="no-referrer" /></div>
                  <div className="flex-1 min-w-0"><div className="text-sm font-bold text-gray-900 truncate">{p.name}</div><div className="text-[10px] text-gray-400 font-bold uppercase">{p.price.toLocaleString()}đ • {p.stock} pcs</div></div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(p)} className="p-2 text-primary bg-primary/5 rounded-lg"><Edit2 size={16} /></button>
                    <button onClick={() => handleProductDelete(p.id)} className="p-2 text-red-400 bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="space-y-4">
            <div className="bg-secondary/5 p-6 rounded-[2rem] border border-secondary/10 mb-6 font-sans">
              <div className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">Hội viên Shop Bống Xinh</div>
              <div className="text-3xl font-black text-secondary">{customers.length} <span className="text-xs text-secondary/50 font-bold">Thành viên</span></div>
            </div>
            {customers.map(c => (
              <div key={c.id} className="clay-card flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black uppercase text-xs">{c.name.charAt(0)}</div>
                  <div><div className="text-sm font-black text-gray-900">{c.name}</div><div className="text-[10px] text-gray-400 font-bold">{c.email}</div></div>
                </div>
                <div className="text-right"><div className="text-sm font-black text-primary">{c.points || 0} điểm</div><button onClick={() => setSelectedCustomer(c)} className="text-[9px] font-black text-secondary uppercase underline tracking-widest">Sửa điểm</button></div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'brands' && (
          <div className="space-y-6">
            <button onClick={() => setIsAddingBrand(true)} className="w-full h-16 bg-white border-2 border-dashed border-gray-200 rounded-3xl flex items-center justify-center gap-2 text-gray-400 font-bold hover:border-primary hover:text-primary transition-all"><Plus size={20} /> Thêm nhãn hàng</button>
            <div className="grid grid-cols-2 gap-4">
              {brands.map(b => (
                <div key={b.id} className="clay-card flex flex-col items-center gap-3 py-6">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300"><ImageIcon size={20} /></div>
                  <div className="text-xs font-black text-gray-900 uppercase tracking-widest">{b.name}</div>
                  <button onClick={async () => await deleteDoc(doc(db, 'brands', b.id))} className="text-[9px] text-red-300 font-bold">Xóa</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black mb-2">Quản lý dữ liệu</h3>
              <p className="text-sm text-gray-500 mb-6 font-medium">Nạp dữ liệu mẫu để bắt đầu trải nghiệm ứng dụng nhanh chóng.</p>
              <button 
                onClick={seedData} 
                disabled={isSeeding}
                className="w-full btn-secondary !h-14 disabled:opacity-50"
              >
                {isSeeding ? 'Đang nạp...' : 'Nạp dữ liệu mẫu'}
              </button>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black mb-2">Thông tin Admin</h3>
              <p className="text-sm text-gray-500 font-medium">Email: bakhuong1010@gmail.com</p>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-sm rounded-[3rem] p-8">
              <h3 className="text-xl font-black text-gray-900 mb-2">Điều chỉnh điểm</h3>
              <p className="text-xs text-gray-400 font-bold mb-6">{selectedCustomer.name}</p>
              <input type="number" className="input-field text-center text-2xl font-black mb-4" placeholder="0" value={pointsAdjust} onChange={e => setPointsAdjust(Number(e.target.value))} />
              <div className="flex gap-3">
                <button onClick={() => setSelectedCustomer(null)} className="flex-1 h-14 rounded-2xl bg-gray-50 text-gray-400 font-black text-xs">HỦY</button>
                <button onClick={handleAdjustPoints} className="flex-1 h-14 rounded-2xl bg-primary text-white font-black text-xs shadow-xl shadow-primary/20">LƯU</button>
              </div>
            </motion.div>
          </div>
        )}
        {isAddingBrand && (
          <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-sm rounded-[3rem] p-8">
              <h3 className="text-xl font-black text-gray-900 mb-6">Nhãn hiệu mới</h3>
              <input className="input-field mb-6" placeholder="Tên (VD: Pampers)" value={brandName} onChange={e => setBrandName(e.target.value)} />
              <div className="flex gap-3">
                <button onClick={() => {setIsAddingBrand(false); setBrandName('');}} className="flex-1 h-14 rounded-2xl bg-gray-50 text-gray-400 font-black text-xs">HỦY</button>
                <button onClick={handleAddBrand} className="flex-1 h-14 rounded-2xl bg-secondary text-white font-black text-xs shadow-xl shadow-secondary/20">THÊM</button>
              </div>
            </motion.div>
          </div>
        )}
        {isAddingProduct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center">
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="bg-white w-full max-w-lg rounded-t-[3rem] p-8 overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between mb-8"><h3 className="text-xl font-black">{editingId ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h3><button onClick={resetProductForm}><X size={24} /></button></div>
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <input required className="input-field" placeholder="Tên sản phẩm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <input required type="number" className="input-field" placeholder="Giá" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                  <input required type="number" className="input-field" placeholder="Kho" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} />
                </div>
                <select className="input-field" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select className="input-field" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} required>
                  <option value="">Chọn nhãn hàng</option>
                  {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                </select>
                <input required className="input-field" placeholder="URL Ảnh" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
                <textarea className="input-field min-h-[100px]" placeholder="Mô tả" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                <button type="submit" className="w-full btn-primary !h-16 !rounded-3xl shadow-xl shadow-primary/20">{editingId ? 'Cập nhật' : 'Thêm mới'}</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
