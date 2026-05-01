import { useState, useEffect } from 'react';
import { Product } from '../types';

interface CartItem {
  product: Product;
  quantity: number;
  purchaseType: 'one-time' | 'subscribe';
}

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      // Mock initial items
      const initialItems: CartItem[] = [
        {
          product: {
            id: '1',
            name: 'Tã dán Moony Natural Size NB 63 miếng',
            brand: 'Moony',
            category: 'Bỉm sữa',
            price: 365000,
            imageUrl: 'https://picsum.photos/seed/moony1/100/100',
            description: '',
            features: [],
            specs: {},
            rating: 4.8,
            reviewCount: 124,
            stock: 50
          },
          quantity: 2,
          purchaseType: 'one-time'
        }
      ];
      setItems(initialItems);
      localStorage.setItem('cart', JSON.stringify(initialItems));
    }
  }, []);

  const getProductPrice = (product: Product, type: 'one-time' | 'subscribe') => {
    let price = product.price;
    
    // Apply promotion if any
    if (product.promotionType === 'percent' && product.promotionValue) {
      price = product.price * (1 - product.promotionValue / 100);
    } else if (product.promotionType === 'fixed' && product.promotionValue) {
      price = Math.max(0, product.price - product.promotionValue);
    }

    // Apply subscription discount (stacks on top of promo or base price)
    if (type === 'subscribe') {
      price = price * 0.85;
    }

    return Math.round(price);
  };

  const total = items.reduce((acc, item) => {
    const price = getProductPrice(item.product, item.purchaseType);
    return acc + price * item.quantity;
  }, 0);

  const removeItem = (productId: string, type: 'one-time' | 'subscribe') => {
    const newItems = items.filter(i => !(i.product.id === productId && i.purchaseType === type));
    setItems(newItems);
    localStorage.setItem('cart', JSON.stringify(newItems));
  };

  const updateQuantity = (productId: string, type: 'one-time' | 'subscribe', quantity: number) => {
    const newItems = items.map(i => {
      if (i.product.id === productId && i.purchaseType === type) {
        return { ...i, quantity: Math.max(1, quantity) };
      }
      return i;
    });
    setItems(newItems);
    localStorage.setItem('cart', JSON.stringify(newItems));
  };

  const addItem = (product: Product, type: 'one-time' | 'subscribe', quantity: number = 1) => {
    const existing = items.find(i => i.product.id === product.id && i.purchaseType === type);
    let newItems;
    if (existing) {
      newItems = items.map(i => 
        (i.product.id === product.id && i.purchaseType === type)
          ? { ...i, quantity: i.quantity + quantity }
          : i
      );
    } else {
      newItems = [...items, { product, quantity, purchaseType: type }];
    }
    setItems(newItems);
    localStorage.setItem('cart', JSON.stringify(newItems));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  return { items, total, removeItem, updateQuantity, addItem, clearCart, getProductPrice };
};
