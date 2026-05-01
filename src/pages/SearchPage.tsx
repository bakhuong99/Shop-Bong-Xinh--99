import React, { useState, useMemo, useEffect } from 'react';
import { Search as SearchIcon, X, Filter, History, TrendingUp as ArrowUpRight, ArrowRight, PackageSearch } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/product/ProductCard';
import { Header } from '../components/layout/Header';
import { motion, AnimatePresence } from 'motion/react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export const SearchPage: React.FC = () => {
  const [queryTerm, setQueryTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : ['Bỉm Moony Natural', 'Sữa Meiji nội địa', 'Tã quần Huggies'];
  });

  useEffect(() => {
    const q = query(collection(db, 'products'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(prods);
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });
    return () => unsubscribe();
  }, []);

  const saveSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    const filtered = recentSearches.filter(s => s.toLowerCase() !== searchTerm.toLowerCase());
    const newHistory = [searchTerm, ...filtered].slice(0, 5);
    setRecentSearches(newHistory);
    localStorage.setItem('recentSearches', JSON.stringify(newHistory));
  };

  const suggestions = useMemo(() => {
    if (!queryTerm.trim()) return [];
    const q = queryTerm.toLowerCase();
    
    const matches: string[] = [];
    products.forEach(p => {
      if (p.name.toLowerCase().includes(q)) matches.push(p.name);
      if (p.brand.toLowerCase().includes(q)) matches.push(p.brand);
      if (p.category.toLowerCase().includes(q)) matches.push(p.category);
    });

    recentSearches.forEach(s => {
      if (s.toLowerCase().includes(q)) matches.push(s);
    });

    return Array.from(new Set(matches)).slice(0, 6);
  }, [queryTerm, recentSearches, products]);

  const results = useMemo(() => {
    if (queryTerm.trim().length < 2) return [];
    
    const q = queryTerm.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }, [queryTerm, products]);

  const handleSearchCommit = (term: string) => {
    setQueryTerm(term);
    saveSearch(term);
    setShowSuggestions(false);
  };

  return (
    <div className="bg-surface min-h-screen py-12 font-sans text-gray-900">
      <div className="container">
        {/* Search Header */}
        <div className="max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-black text-gray-900 mb-8 text-center">Tìm kiếm sản phẩm</h1>
          <div className="relative group">
            <SearchIcon size={24} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input 
              autoFocus
              type="text" 
              value={queryTerm}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => {
                setQueryTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearchCommit(queryTerm);
              }}
              placeholder="Ba mẹ muốn tìm bỉm, sữa hay đồ chơi cho bé..."
              className="w-full bg-white border-none rounded-[2rem] pl-16 pr-16 h-20 text-lg font-bold shadow-2xl shadow-primary/5 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
            />
            {queryTerm && (
              <button 
                onClick={() => {
                  setQueryTerm('');
                  setShowSuggestions(false);
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all"
              >
                <X size={20} />
              </button>
            )}

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && queryTerm.trim().length > 0 && suggestions.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-4 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[3rem] overflow-hidden z-[100] border border-gray-50"
                >
                  <div className="p-6 space-y-2">
                    {suggestions.map((s, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleSearchCommit(s)}
                        className="flex items-center gap-4 w-full px-6 py-4 text-left hover:bg-surface rounded-2xl transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:text-primary group-hover:bg-primary/10 transition-all">
                          <SearchIcon size={16} />
                        </div>
                        <span className="flex-1 text-sm font-black text-gray-600 group-hover:text-gray-900">{s}</span>
                        <ArrowUpRight size={16} className="text-gray-200 group-hover:text-gray-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {!queryTerm ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                key="default"
                className="grid grid-cols-1 md:grid-cols-2 gap-12"
              >
                {/* Recent Searches */}
                <div className="space-y-8">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Tìm kiếm gần đây</h3>
                    <button 
                      onClick={() => {
                        setRecentSearches([]);
                        localStorage.removeItem('recentSearches');
                      }} 
                      className="text-[10px] font-black text-primary/40 uppercase tracking-widest hover:text-primary transition-colors"
                    >
                      Xóa hết
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {recentSearches.map((s, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleSearchCommit(s)}
                        className="flex items-center gap-4 w-full text-left p-4 rounded-3xl bg-white border border-gray-50 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all group"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-surface flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                          <History size={18} />
                        </div>
                        <span className="flex-1 text-sm font-black text-gray-700 group-hover:text-gray-900">{s}</span>
                        <ArrowRight size={18} className="text-gray-200 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trending Tags */}
                <div className="space-y-8">
                  <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] px-2">Tìm kiếm phổ biến</h3>
                  <div className="flex flex-wrap gap-4 px-2">
                    {['Bỉm đêm cho bé', 'Sữa Enfamil số 1', 'Khăn ướt không mùi', 'Bỉm dán Newborn', 'Đồ dùng sơ sinh'].map((tag) => (
                      <button 
                        key={tag}
                        onClick={() => handleSearchCommit(tag)}
                        className="px-6 py-4 bg-white border border-gray-50 rounded-2xl text-xs font-black text-gray-600 hover:border-primary hover:text-primary hover:shadow-lg hover:shadow-primary/5 transition-all active:scale-95"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : results.length > 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key="results"
                className="space-y-10"
              >
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Tìm thấy {results.length} sản phẩm</h3>
                  <div className="flex items-center gap-3 text-[10px] font-black text-primary uppercase tracking-widest cursor-pointer hover:opacity-70 transition-opacity">
                    <Filter size={16} /> Lọc kết quả
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  <AnimatePresence mode="popLayout">
                    {results.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                key="empty"
                className="py-32 text-center"
              >
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-8 text-primary/10 shadow-sm border border-gray-50">
                  <PackageSearch size={64} />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4">Không tìm thấy kết quả</h3>
                <p className="text-gray-500 font-medium max-w-sm mx-auto text-lg leading-relaxed">Hãy thử tìm kiếm bằng từ khóa khác hoặc dạo xem các danh mục sản phẩm từ mẹ bé nhé.</p>
                <button 
                  onClick={() => setQueryTerm('')}
                  className="mt-10 btn-primary !h-16 !px-12 !rounded-2xl text-lg font-black uppercase tracking-widest shadow-xl shadow-primary/20"
                >
                  Xóa tìm kiếm
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
