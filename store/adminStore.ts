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

  // Gift Shop Pricing Management (for Product Managers)
  giftPricings: GiftItemPricing[];
  updateGiftPrice: (id: string, updates: Partial<GiftItemPricing>) => void;
  addGiftPricing: (item: GiftItemPricing) => void;
  deleteGiftPricing: (id: string) => void;

  // Getters
  isSellerVerified: (sellerId: string) => boolean;
}

export interface GiftItemPricing {
  id: string;
  type: string;
  name: string;
  category: string;
  basePrice: number;
  customizationFee: number;
  estimatedDays: number;
  image: string;
  description: string;
  isAvailable: boolean;
  colorOptions?: string[];
  placeholderText?: string;
  defaultText?: string;
}

export interface ImagePreset {
  id: string;
  label: string;
  url: string;
}

export const initialGiftPricings: GiftItemPricing[] = [
  {
    id: 'jersey',
    type: 'Jersey',
    name: 'Customized Club / Country Jersey',
    category: 'Gift Items',
    basePrice: 12500,
    customizationFee: 1500,
    estimatedDays: 2,
    image: '/custom-jersey.jpg',
    description: 'Custom sports jersey with official vinyl back name & squad number print.',
    isAvailable: true,
    colorOptions: ['Forest Green', 'Royal Blue', 'Classic White', 'Crimson Red'],
    placeholderText: 'E.g. KANU 4, BABA 01, OMA 7',
    defaultText: 'ADEBAYO 10',
  },
  {
    id: 'mug',
    type: 'Mug',
    name: 'Custom Photo & Personal Message Ceramic Mug',
    category: 'Gift Items',
    basePrice: 4500,
    customizationFee: 500,
    estimatedDays: 1,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    description: 'High-gloss 11oz ceramic mug with heat-sealed photo, quote, or monogram.',
    isAvailable: true,
    colorOptions: ['Pure White', 'Matte Black', 'Gold Rim'],
    placeholderText: 'E.g. QUEEN OF MY HEART, DR. TUNDE',
    defaultText: 'BEST DAD IN LAGOS',
  },
  {
    id: 'tshirt',
    type: 'Tshirt',
    name: 'Personalized Heavyweight Cotton Graphic Tee',
    category: 'Gift Items',
    basePrice: 7999,
    customizationFee: 1000,
    estimatedDays: 2,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    description: '240GSM combed cotton tee with high-definition DTF graphic or text print.',
    isAvailable: true,
    colorOptions: ['Onyx Black', 'Vintage Cream', 'Steel Grey'],
    placeholderText: 'E.g. BIG WINS ONLY, 1994 VINTAGE',
    defaultText: 'BLESSED & FOCUSED',
  },
  {
    id: 'caps',
    type: 'Caps',
    name: 'Custom Monogram Embroidered Streetwear Cap',
    category: 'Gift Items',
    basePrice: 6500,
    customizationFee: 1000,
    estimatedDays: 2,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
    description: 'Structured 6-panel streetwear cap with 3D puff embroidery.',
    isAvailable: true,
    colorOptions: ['Midnight Black', 'Desert Khaki', 'Navy'],
    placeholderText: 'E.g. LAGOS 26, LAX, INITIALS',
    defaultText: 'LAGOS 26',
  },
  {
    id: 'phone_case',
    type: 'Phone case',
    name: 'Personalized Shockproof Hybrid Phone Case',
    category: 'Gift Items',
    basePrice: 4999,
    customizationFee: 500,
    estimatedDays: 1,
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80',
    description: 'Military-grade drop-tested case with laser-printed monogram or photo.',
    isAvailable: true,
    colorOptions: ['Clear Hybrid', 'Matte Carbon', 'Frosted Smoke'],
    placeholderText: 'E.g. iPhone 15 Pro / AMINAT K.',
    defaultText: 'AMINAT K.',
  },
  {
    id: 'folder',
    type: 'Folder',
    name: 'Executive Debossed Leather Document Folder',
    category: 'Gift Items',
    basePrice: 9500,
    customizationFee: 1500,
    estimatedDays: 2,
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80',
    description: 'PU vegan leather document folder with laser-engraved metallic nameplate.',
    isAvailable: true,
    colorOptions: ['Classic Black', 'Cognac Brown', 'Navy Blue'],
    placeholderText: 'E.g. BARR. TUNDE JOHNSON',
    defaultText: 'BARR. TUNDE JOHNSON',
  },
  {
    id: 'books',
    type: 'Books',
    name: 'Gold-Foil Hardcover Journal & Book Gift Set',
    category: 'Gift Items',
    basePrice: 5500,
    customizationFee: 1000,
    estimatedDays: 1,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    description: '200-page lined journal with gold-foil stamped custom title & ribbon.',
    isAvailable: true,
    colorOptions: ['Emerald Green', 'Royal Navy', 'Burgundy Wine'],
    placeholderText: 'E.g. BOOK OF PURPOSE 2026',
    defaultText: 'BOOK OF PURPOSE 2026',
  },
  {
    id: 'pen',
    type: 'Pen',
    name: 'Laser-Engraved Executive Gold-Trim Pen Box',
    category: 'Gift Items',
    basePrice: 4500,
    customizationFee: 500,
    estimatedDays: 1,
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80',
    description: 'Weighted brass ballpoint pen with 24K gold accents in velvet box.',
    isAvailable: true,
    colorOptions: ['Matte Black & Gold', 'Gloss Silver & Gold', 'Pure Gold Tone'],
    placeholderText: 'E.g. DR. BOLANLE S.',
    defaultText: 'DR. BOLANLE S.',
  },
  {
    id: 'bracelets',
    type: 'Bracelets',
    name: 'Custom Name Magnetic Couple Charm Bracelets',
    category: 'Gift Items',
    basePrice: 5999,
    customizationFee: 1000,
    estimatedDays: 1,
    image: 'https://images.unsplash.com/photo-1611591475837-7f8976b97664?auto=format&fit=crop&w=800&q=80',
    description: 'Dual stone bead bracelets with engraved custom charms & magnetic link.',
    isAvailable: true,
    colorOptions: ['Duo Onyx & Howlite', 'Triple Black Stone', 'Rose Quartz & Onyx'],
    placeholderText: 'E.g. CHIDI ♡ IFEOMA',
    defaultText: 'CHIDI ♡ IFEOMA',
  },
];

export const initialCategories: string[] = [
  'Sneakers',
  'Trainers',
  'Shirts',
  'Ties',
  'Trade',
  'Gadgets',
  'Laptops',
  'Jeans',
  'Pant Trousers',
  'Gift Items',
  'Aso Ebi',
  'Suits',
  'Bags',
  'Clothing',
  'Accessories',
];

export const initialImagePresets: ImagePreset[] = [
  { id: 'pre-1', label: 'Suit Blue', url: '/suit-blue-1.jpg' },
  { id: 'pre-2', label: 'Suit Grey', url: '/suit-grey-1.jpg' },
  { id: 'pre-3', label: 'Folded Shirts', url: '/folded-shirts-blue.jpg' },
  { id: 'pre-4', label: 'Casual Shirts', url: '/casual-shirts-colorful.jpg' },
  { id: 'pre-5', label: 'Leather Bag', url: '/bag-handbag.jpg' },
  { id: 'pre-6', label: 'Corporate Shoes', url: '/male-shoes-collection.jpg' },
  { id: 'pre-7', label: 'Jeans Stack', url: '/jeans-stack.jpg' },
  { id: 'pre-8', label: 'Sneakers Retro', url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80' },
  { id: 'pre-9', label: 'Trainers Runner', url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80' },
  { id: 'pre-10', label: 'Laptop MacBook', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80' },
  { id: 'pre-11', label: 'Gadgets Earbuds', url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80' },
  { id: 'pre-12', label: 'Ties Silk Pack', url: '/banner-suit-tie.jpg' },
  { id: 'pre-13', label: 'Pant Trousers', url: '/formal-pant-trousers.jpg' },
  { id: 'pre-14', label: 'Custom Jersey', url: '/custom-jersey.jpg' },
  { id: 'pre-15', label: 'Custom Mug', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80' },
  { id: 'pre-16', label: 'Custom Tshirt', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80' },
  { id: 'pre-17', label: 'Custom Cap', url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80' },
  { id: 'pre-18', label: 'Phone Case', url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80' },
  { id: 'pre-19', label: 'Executive Pen', url: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80' },
  { id: 'pre-20', label: 'Aso Ebi Swiss Lace', url: '/swiss-voile-lace.jpg' },
  { id: 'pre-21', label: 'Aso Ebi Velvet Sequin', url: '/velvet-sequin-lace.jpg' },
  { id: 'pre-22', label: 'Gele Headtie', url: '/auto-gele-headtie.jpg' },
  { id: 'pre-23', label: 'Men Agbada Set', url: '/nigerian-agbada-set.jpg' },
  { id: 'pre-24', label: 'Agbada Fabric & Cap', url: '/agbada-fabric-cap.jpg' },
  { id: 'pre-25', label: 'Boubou Gown', url: '/boubou-gown.jpg' },
  { id: 'pre-26', label: 'Coral Beads', url: '/african-coral-beads.jpg' },
  { id: 'pre-27', label: 'iPhone 13 Pro', url: '/iphone-13-pro-blue.jpg' },
  { id: 'pre-28', label: 'Samsung S22 Ultra', url: '/samsung-s22-ultra.jpg' },
  { id: 'pre-29', label: 'Swap Pass Card', url: '/swap-pass-voucher.jpg' },
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

      // Gift Shop Pricing Management
      giftPricings: initialGiftPricings,

      updateGiftPrice: (id: string, updates: Partial<GiftItemPricing>) => {
        set((state) => {
          const current = state.giftPricings && state.giftPricings.length > 0 ? state.giftPricings : initialGiftPricings;
          return {
            giftPricings: current.map((item) => (item.id === id ? { ...item, ...updates } : item)),
          };
        });
      },

      addGiftPricing: (item: GiftItemPricing) => {
        set((state) => ({
          giftPricings: [...(state.giftPricings && state.giftPricings.length > 0 ? state.giftPricings : initialGiftPricings), item],
        }));
      },

      deleteGiftPricing: (id: string) => {
        set((state) => ({
          giftPricings: (state.giftPricings && state.giftPricings.length > 0 ? state.giftPricings : initialGiftPricings).filter(
            (item) => item.id !== id
          ),
        }));
      },

      isSellerVerified: (sellerId: string) => {
        if (sellerId === 'admin-official') return true;
        const vendor = get().vendors?.find((v) => v.id === sellerId);
        return vendor?.isVerified ?? false;
      },
    }),
    {
      name: 'yabaright-admin-store',
      onRehydrateStorage: () => (state) => {
        if (state) {
          const current = state.categories || [];
          const missing = initialCategories.filter(
            (c) => !current.some((x) => x.toLowerCase() === c.toLowerCase())
          );
          if (missing.length > 0) {
            state.categories = [...current, ...missing];
          }

          if (!state.giftPricings || state.giftPricings.length === 0) {
            state.giftPricings = initialGiftPricings;
          } else {
            // Migrate any legacy jerzy id to jersey & update image
            state.giftPricings = state.giftPricings.map((g) =>
              g.id === 'jerzy' || g.id === 'jersey'
                ? { ...g, id: 'jersey', type: 'Jersey', image: '/custom-jersey.jpg' }
                : g
            );
            // Ensure any newly added default items are present
            const currentGifts = state.giftPricings;
            const missingGifts = initialGiftPricings.filter(
              (g) => !currentGifts.some((x) => x.id === g.id)
            );
            if (missingGifts.length > 0) {
              state.giftPricings = [...currentGifts, ...missingGifts];
            }
          }

          // Migrate any cached products with old contradictory images to authentic Nigerian images
          const imageMigrationMap: Record<string, string[]> = {
            'prod-9': ['/nigerian-agbada-set.jpg'],
            'prod-10': ['/african-coral-beads.jpg'],
            'prod-11': ['/boubou-gown.jpg'],
            'prod-16': ['/formal-pant-trousers.jpg'],
            'prod-19': ['/swap-pass-voucher.jpg'],
            'prod-20': ['/custom-jersey.jpg'],
            'prod-29': ['/swiss-voile-lace.jpg'],
            'prod-30': ['/velvet-sequin-lace.jpg'],
            'prod-31': ['/auto-gele-headtie.jpg'],
            'prod-32': ['/agbada-fabric-cap.jpg'],
            'prod-phone-1': ['/iphone-13-pro-blue.jpg'],
            'prod-phone-2': ['/samsung-s22-ultra.jpg'],
          };

          if (state.products && state.products.length > 0) {
            state.products = state.products.map((p) => {
              if (imageMigrationMap[p.id]) {
                return { ...p, images: imageMigrationMap[p.id] };
              }
              return p;
            });
          }
        }
      },
    }
  )
);
