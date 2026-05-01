import { Product } from '../types';

export const BRANDS = ['Moony', 'Huggies', 'Pampers', 'Bobby', 'Meiji', 'Enfamil', 'Similac'];
export const CATEGORIES = [
  { id: 'Bỉm sữa', name: 'Bỉm sữa', icon: 'Baby' },
  { id: 'Đồ dùng sơ sinh', name: 'Đồ dùng sơ sinh', icon: 'Milk' },
  { id: 'Thực phẩm ăn dặm', name: 'Thực phẩm ăn dặm', icon: 'ShoppingBag' },
  { id: 'Đồ dùng cho mẹ bầu và sau sinh', name: 'Đồ dùng cho mẹ bầu và sau sinh', icon: 'Heart' }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Tã dán Moony Natural Size NB 63 miếng',
    brand: 'Moony',
    category: 'Bỉm sữa',
    size: 'NB',
    skinType: 'sensitive',
    price: 365000,
    originalPrice: 420000,
    stock: 50,
    imageUrl: 'https://picsum.photos/seed/moony1/400/400',
    description: 'Tã dán cao cấp với bề mặt bông hữu cơ, phù hợp cho trẻ sơ sinh có làn da nhạy cảm.',
    features: ['Bông hữu cơ Natural Cotton', 'Rãnh rốn OHESO', 'Thấm hút 12 giờ'],
    specs: { 'Số miếng': '63', 'Cân nặng': '< 5kg', 'Loại': 'Tã dán' },
    rating: 4.8,
    reviewCount: 124
  },
  {
    id: '2',
    name: 'Tã quần Huggies Platinum Nature Made Size M 58 miếng',
    brand: 'Huggies',
    category: 'Bỉm sữa',
    size: 'M',
    skinType: 'sensitive',
    price: 385000,
    originalPrice: 450000,
    stock: 30,
    imageUrl: 'https://picsum.photos/seed/huggies1/400/400',
    description: 'Dòng tã cao cấp nhất của Huggies với tinh chất tràm trà tự nhiên.',
    features: ['Sợi thiên nhiên nhập khẩu', 'Không gây kích ứng da', 'Lõi bông siêu mỏng'],
    specs: { 'Số miếng': '58', 'Cân nặng': '6 - 11kg', 'Loại': 'Tã quần' },
    rating: 4.9,
    reviewCount: 89
  },
  {
    id: '3',
    name: 'Sữa Meiji Growing Up Formula 800g (1-3 tuổi)',
    brand: 'Meiji',
    category: 'Bỉm sữa',
    price: 460000,
    stock: 100,
    imageUrl: 'https://picsum.photos/seed/meiji1/400/400',
    description: 'Sữa công thức giúp bé phát triển toàn diện chiều cao và trí não.',
    features: ['Bổ sung DHA & ARA', 'Tăng cường hệ miễn dịch', 'Vị thanh mát giống sữa mẹ'],
    specs: { 'Trọng lượng': '800g', 'Độ tuổi': '1 - 3 tuổi' },
    rating: 4.7,
    reviewCount: 256
  },
  {
    id: '4',
    name: 'Tã quần Bobby Lõi Nén Thần Kỳ Size L 54 miếng',
    brand: 'Bobby',
    category: 'Bỉm sữa',
    size: 'L',
    price: 285000,
    originalPrice: 320000,
    stock: 0,
    imageUrl: 'https://picsum.photos/seed/bobby1/400/400',
    description: 'Thiết kế mỏng nhẹ nhưng thấm hút vượt trội.',
    features: ['Lõi nén 3mm', 'Bề mặt 3000 lỗ thấm siêu tốc', 'Màng đáy thoát ẩm'],
    specs: { 'Số miếng': '54', 'Cân nặng': '9 - 14kg', 'Loại': 'Tã quần' },
    rating: 4.5,
    reviewCount: 412
  }
];
