import { ProductCondition, type Product } from '@/types';
import productsData from '@/data/products.json';

export const sampleProducts: Product[] = (productsData as unknown as Product[]) || [];

export const getProductById = (productId: string) =>
  sampleProducts.find((product) => product.id === productId);

