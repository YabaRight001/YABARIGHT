import { ProductCondition, type Product } from '@/types';

// All online dummy products removed as requested - only authentic admin & vendor uploads are displayed
export const sampleProducts: Product[] = [];

export const getProductById = (productId: string) =>
  sampleProducts.find((product) => product.id === productId);
