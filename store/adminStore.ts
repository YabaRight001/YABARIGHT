import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, ProductCondition } from '@/types';
import { sampleProducts } from '@/lib/mockProducts';

export interface VendorProfile {
  id: string;
  name: string;
  shopName: string;
  email: string;
  phone: string;
  address: string;
  idType: 'National ID (NIN)' | "Voter's Card" | "Driver's License" | 'International Passport' | 'CAC Certificate';
  idNumber: string;
  isVerified: boolean;
  verifiedAt?: string;
  status: 'active' | 'suspended';
  joinedAt: string;
  rating: number;
  totalSales: number;
}

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'BUYER' | 'SELLER' | 'ADMIN' | 'AFFILIATE';
  status: 'active' | 'flagged' | 'banned';
  joinedAt: string;
  ordersCount: number;
}

interface AdminState {
  products: Product[];
  vendors: VendorProfile[];
  users: PlatformUser[];

  // Product Actions
  addProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'sold' | 'rating' | 'trending' | 'published' | 'sellerId'> & { sellerId?: string; rating?: number; trending?: boolean; published?: boolean }) => Product;
  deleteProduct: (productId: string) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;

  // Vendor Verification Actions (Jiji style)
  verifyVendor: (vendorId: string) => void;
  revokeVendor: (vendorId: string) => void;
  deleteVendor: (vendorId: string) => void;

  // User Moderation Actions
  addUser: (user: Partial<PlatformUser> & { id: string; name: string; email: string; role: 'BUYER' | 'SELLER' | 'ADMIN' | 'AFFILIATE' }) => void;
  deleteUser: (userId: string) => void;
  setUserStatus: (userId: string, status: 'active' | 'flagged' | 'banned') => void;

  // Category Actions
  categories: string[];
  addCategory: (categoryName: string) => void;
  deleteCategory: (categoryName: string) => void;

  // Image Preset Actions
  imagePresets: ImagePreset[];
  addImagePreset: (preset: { label: string; url: string }) => void;
  deleteImagePreset: (idOrUrl: string) => void;

  // Getters
  isSellerVerified: (sellerId: string) => boolean;
}

export interface ImagePreset {
  id: string;
  label: string;
  url: string;
}

export const initialCategories: string[] = [
  'Clothing',
  'Shoes',
  'Bags',
  'Shirts',
  'Suits',
  'Trousers',
  'Accessories',
  'Designer Items',
  'Vintage',
  'Traditional Wears',
];

export const initialImagePresets: ImagePreset[] = [
  { id: 'pre-1', label: 'Suit Blue', url: '/suit-blue-1.jpg' },
  { id: 'pre-2', label: 'Suit Grey', url: '/suit-grey-1.jpg' },
  { id: 'pre-3', label: 'Folded Shirts', url: '/folded-shirts-blue.jpg' },
  { id: 'pre-4', label: 'Casual Shirts', url: '/casual-shirts-colorful.jpg' },
  { id: 'pre-5', label: 'Leather Bag', url: '/bag-handbag.jpg' },
  { id: 'pre-6', label: 'Corporate Shoes', url: '/male-shoes-collection.jpg' },
  { id: 'pre-7', label: 'Jeans Stack', url: '/jeans-stack.jpg' },
  { id: 'pre-8', label: 'Heels Black', url: '/heels-black-pair.jpg' },
  { id: 'pre-9', label: 'Ballet Flats', url: '/female-shoe-flat.jpg' },
  { id: 'pre-10', label: 'Polo Shirts', url: '/polo-shirts.jpg' },
  { id: 'pre-11', label: 'Banner Suits', url: '/banner-suit-tie.jpg' },
];

const initialVendors: VendorProfile[] = [
  {
    id: 'seller-1',
    name: 'Zainab Heritage Fashion',
    shopName: 'Lagos Heritage Store',
    email: 'zainab@lagosheritage.ng',
    phone: '0803 456 7890',
    address: 'Tejuosho Ultra-Modern Market, Yaba, Lagos',
    idType: 'CAC Certificate',
    idNumber: 'RC-1849204',
    isVerified: true,
    verifiedAt: '2026-08-01',
    status: 'active',
    joinedAt: '2026-07-15',
    rating: 4.9,
    totalSales: 145,
  },
  {
    id: 'seller-2',
    name: 'Yaba Classics Leatherworks',
    shopName: 'Yaba Classics Official',
    email: 'info@yabaclassics.ng',
    phone: '0812 987 6543',
    address: 'Commercial Avenue, Sabo-Yaba, Lagos',
    idType: 'National ID (NIN)',
    idNumber: 'NIN-89218492019',
    isVerified: true,
    verifiedAt: '2026-08-05',
    status: 'active',
    joinedAt: '2026-07-20',
    rating: 4.8,
    totalSales: 98,
  },
  {
    id: 'seller-3',
    name: 'Kingsway Executive Footwear',
    shopName: 'Kingsway Shoes Yaba',
    email: 'kingsway@gmail.com',
    phone: '0705 111 2233',
    address: 'Alade Market, Ikeja, Lagos',
    idType: 'Driver\'s License',
    idNumber: 'DL-LAG-84920A',
    isVerified: false,
    status: 'active',
    joinedAt: '2026-08-10',
    rating: 4.6,
    totalSales: 42,
  },
  {
    id: 'seller-4',
    name: 'Chop Life Streetwear NG',
    shopName: 'Chop Life Collections',
    email: 'choplife@ymail.com',
    phone: '0814 333 4455',
    address: 'Ojuelegba Road, Surulere, Lagos',
    idType: 'National ID (NIN)',
    idNumber: 'NIN-47291840291',
    isVerified: false,
    status: 'active',
    joinedAt: '2026-08-14',
    rating: 4.2,
    totalSales: 19,
  },
];

const initialUsers: PlatformUser[] = [
  {
    id: 'usr-1',
    name: 'Adebayo Johnson',
    email: 'adebayo.j@yahoo.com',
    phone: '0802 333 9900',
    role: 'BUYER',
    status: 'active',
    joinedAt: '2026-08-01',
    ordersCount: 5,
  },
  {
    id: 'usr-2',
    name: 'Chinwe Okonkwo',
    email: 'chinwe.o@gmail.com',
    phone: '0813 444 8822',
    role: 'BUYER',
    status: 'active',
    joinedAt: '2026-08-04',
    ordersCount: 3,
  },
  {
    id: 'usr-3',
    name: 'Femi Badmus',
    email: 'femi.badmus@live.com',
    phone: '0708 999 1100',
    role: 'BUYER',
    status: 'flagged',
    joinedAt: '2026-08-12',
    ordersCount: 0,
  },
  {
    id: 'usr-4',
    name: 'Zainab Heritage Fashion',
    email: 'zainab@lagosheritage.ng',
    phone: '0803 456 7890',
    role: 'SELLER',
    status: 'active',
    joinedAt: '2026-07-15',
    ordersCount: 145,
  },
];

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      products: sampleProducts,
      vendors: initialVendors,
      users: initialUsers,
      categories: initialCategories,
      imagePresets: initialImagePresets,

      // Product Management
      addProduct: (data) => {
        const newProduct: Product = {
          id: `prod-${Date.now()}`,
          rating: 5.0,
          sold: 0,
          trending: true,
          published: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...data,
          sellerId: data.sellerId || 'admin-official',
        };
        set((state) => ({ products: [newProduct, ...state.products] }));
        return newProduct;
      },

      deleteProduct: (productId: string) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId),
        }));
      },

      updateProduct: (productId, updates) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId ? { ...p, ...updates, updatedAt: new Date() } : p
          ),
        }));
      },

      // Vendor Verification (Jiji style)
      verifyVendor: (vendorId: string) => {
        set((state) => ({
          vendors: state.vendors.map((v) =>
            v.id === vendorId
              ? { ...v, isVerified: true, verifiedAt: new Date().toISOString().split('T')[0] }
              : v
          ),
        }));
      },

      revokeVendor: (vendorId: string) => {
        set((state) => ({
          vendors: state.vendors.map((v) =>
            v.id === vendorId
              ? { ...v, isVerified: false, verifiedAt: undefined }
              : v
          ),
        }));
      },

      deleteVendor: (vendorId: string) => {
        set((state) => ({
          vendors: state.vendors.filter((v) => v.id !== vendorId),
          products: state.products.filter((p) => p.sellerId !== vendorId),
        }));
      },

      // User Moderation
      addUser: (userData) => {
        set((state) => {
          const existing = state.users.find((u) => u.email.toLowerCase() === userData.email.toLowerCase());
          if (existing) {
            return {
              users: state.users.map((u) =>
                u.email.toLowerCase() === userData.email.toLowerCase() ? { ...u, ...userData } : u
              ),
            };
          }
          const newUser: PlatformUser = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            phone: userData.phone || '0800 000 0000',
            role: userData.role,
            status: userData.status || 'active',
            joinedAt: userData.joinedAt || new Date().toISOString().split('T')[0],
            ordersCount: userData.ordersCount || 0,
          };
          return { users: [newUser, ...state.users] };
        });
      },

      deleteUser: (userId: string) => {
        set((state) => ({
          users: state.users.filter((u) => u.id !== userId),
        }));
      },

      setUserStatus: (userId, status) => {
        set((state) => ({
          users: state.users.map((u) => (u.id === userId ? { ...u, status } : u)),
        }));
      },

      // Category Management
      addCategory: (categoryName: string) => {
        const trimmed = categoryName.trim();
        if (!trimmed) return;
        set((state) => {
          const current = state.categories && state.categories.length > 0 ? state.categories : initialCategories;
          if (current.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
            return state;
          }
          return { categories: [...current, trimmed] };
        });
      },

      deleteCategory: (categoryName: string) => {
        set((state) => ({
          categories: (state.categories || initialCategories).filter(
            (c) => c.toLowerCase() !== categoryName.toLowerCase()
          ),
        }));
      },

      // Image Preset Management
      addImagePreset: (preset: { label: string; url: string }) => {
        if (!preset.url || !preset.label) return;
        const newPreset: ImagePreset = {
          id: `preset-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          label: preset.label.trim(),
          url: preset.url.trim(),
        };
        set((state) => ({
          imagePresets: [newPreset, ...(state.imagePresets || initialImagePresets)],
        }));
      },

      deleteImagePreset: (idOrUrl: string) => {
        set((state) => ({
          imagePresets: (state.imagePresets || initialImagePresets).filter(
            (p) => p.id !== idOrUrl && p.url !== idOrUrl
          ),
        }));
      },

      isSellerVerified: (sellerId: string) => {
        if (sellerId === 'admin-official') return true;
        const vendor = get().vendors.find((v) => v.id === sellerId);
        return vendor?.isVerified ?? false;
      },
    }),
    {
      name: 'yabaright-admin-store',
    }
  )
);
