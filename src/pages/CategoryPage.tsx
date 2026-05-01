import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { SlidersHorizontal, X, LayoutGrid, ListFilter, PackageSearch, ChevronDown, Check, Baby } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { CompareBar } from '../components/product/CompareBar';
import { useAppContext } from '../context/AppContext';
import { cn } from '../lib/utils';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const { babyProfile } = useAppContext();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'rating'>('rating');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const q = id && id !== 'all'
        ? query(collection(db, 'products'), where('category', '==', id))
        : collection(db, 'products');

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(prods);
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });
    return () => unsubscribe();
  }, [id]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    if (selectedBrand) {
      result = result.filter(p => p.brand === selectedBrand);
    }

    if (priceRange) {
      result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    }

    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [products, selectedBrand, sortBy, priceRange]);

  const brands = useMemo(() => {
    return Array.from(new Set(products.map(p => p.brand)));
  }, [products]);

  const priceFilters = [
    { label: 'Dưới 200.000đ', range: [0, 200000] as [number, number] },
    { label: '200k - 500k', range: [200000, 500000] as [number, number] },
    { label: '500k - 1tr', range: [500000, 1000000] as [number, number] },
    { label: 'Trên 1 triệu', range: [1000000, 99999999] as [number, number] }
  ];

  const sortOptions = [
    { id: 'rating', label: 'Xếp hạng tốt nhất' },
    { id: 'price_asc', label: 'Giá từ thấp đến cao' },
    { id: 'price_desc', label: 'Giá từ cao xuống thấp' }
  ];

  return (
    <div className="bg-surface min-h-screen font-sans">
      {/* Category Header */}
      <div className="bg-white border-b border-gray-100 py-12 mb-8">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
                <Link to="/" className="hover:underline">Home</Link>
                <ChevronDown size={12} className="-rotate-90" />
                <span>Categories</span>
                <ChevronDown size={12} className="-rotate-90" />
                <span className="text-gray-400">{id || 'Tất cả'}</span>
              </div>
              <h1 className="text-4xl font-black text-gray-900">{id || 'Tất cả sản phẩm'}</h1>
              <p className="text-gray-500 font-medium">{filteredProducts.length} sản phẩm phù hợp được tìm thấy</p>
            </div>

            {babyProfile && (
              <div className="bg-primary/5 rounded-[2rem] p-6 border border-primary/10 flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <Baby size={28} />
                </div>
                <div>
                  <h4 className="font-black text-sm text-primary">Dành riêng cho {babyProfile.name}</h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Dựa trên {babyProfile.weight}kg & {babyProfile.skinType}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-72 shrink-0 space-y-10 sticky top-36 h-fit pb-12">
            {/* Sorting */}
            <div className="space-y-4">
              <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest flex items-center gap-2">
                <ListFilter size={16} className="text-primary" /> Sắp xếp theo
              </h3>
              <div className="space-y-2">
                {sortOptions.map(opt => (
                  <button 
                    key={opt.id}
                    onClick={() => setSortBy(opt.id as any)}
                    className={cn(
                      "w-full text-left px-5 py-3.5 rounded-2xl text-sm font-bold transition-all border-2 flex items-center justify-between",
                      sortBy === opt.id ? "bg-primary/5 border-primary text-primary" : "bg-white border-transparent text-gray-500 hover:border-gray-200"
                    )}
                  >
                    {opt.label}
                    {sortBy === opt.id && <Check size={16} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-4">
              <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-secondary" /> Lọc theo giá
              </h3>
              <div className="space-y-2">
                <button 
                  onClick={() => setPriceRange(null)}
                  className={cn(
                    "w-full text-left px-5 py-3.5 rounded-2xl text-sm font-bold transition-all border-2 flex items-center justify-between",
                    priceRange === null ? "bg-secondary/5 border-secondary text-secondary" : "bg-white border-transparent text-gray-500 hover:border-gray-200"
                  )}
                >
                  Tất cả giá
                  {priceRange === null && <Check size={16} />}
                </button>
                {priceFilters.map((p, i) => (
                  <button 
                    key={i}
                    onClick={() => setPriceRange(p.range)}
                    className={cn(
                      "w-full text-left px-5 py-3.5 rounded-2xl text-sm font-bold transition-all border-2 flex items-center justify-between",
                      JSON.stringify(priceRange) === JSON.stringify(p.range) ? "bg-secondary/5 border-secondary text-secondary" : "bg-white border-transparent text-gray-500 hover:border-gray-200"
                    )}
                  >
                    {p.label}
                    {JSON.stringify(priceRange) === JSON.stringify(p.range) && <Check size={16} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            {brands.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest flex items-center gap-2">
                  <LayoutGrid size={16} className="text-accent" /> Thương hiệu
                </h3>
                <div className="flex flex-wrap gap-2">
                  {brands.map(brand => (
                    <button 
                      key={brand}
                      onClick={() => setSelectedBrand(selectedBrand === brand ? null : brand)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-bold transition-all border-2",
                        selectedBrand === brand ? "bg-accent/10 border-accent text-accent" : "bg-white border-gray-100 text-gray-500 hover:border-gray-300"
                      )}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 pb-32">
            {/* Mobile Filter Trigger */}
            <div className="lg:hidden flex gap-4 mb-8">
               <button 
                onClick={() => setShowMobileFilters(true)}
                className="flex-1 btn-outline !bg-white !rounded-2xl !h-14 font-black text-sm gap-3"
               >
                 <SlidersHorizontal size={18} /> Lọc & Sắp xếp
               </button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-96 bg-gray-100 rounded-[2.5rem] animate-pulse" />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="py-32 text-center bg-white rounded-[3rem] border border-dashed border-gray-200">
                <PackageSearch size={64} className="mx-auto text-gray-200 mb-6" />
                <h3 className="text-xl font-black text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-gray-400 font-medium">Ba mẹ hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm nhé.</p>
                <button 
                  onClick={() => {
                    setSelectedBrand(null);
                    setPriceRange(null);
                    setSortBy('rating');
                  }}
                  className="mt-10 btn-primary !h-14 !px-8 !rounded-xl"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal Replacement... */}
      <CompareBar />
    </div>
  );
};
