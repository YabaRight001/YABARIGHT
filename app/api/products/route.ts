import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Product } from '@/types';

const dataFilePath = path.join(process.cwd(), 'data', 'products.json');

// In-memory fallback cache in case filesystem is read-only (e.g. serverless)
let inMemoryProducts: Product[] = [];

function loadProducts(): Product[] {
  try {
    if (fs.existsSync(dataFilePath)) {
      const fileData = fs.readFileSync(dataFilePath, 'utf8');
      if (fileData.trim()) {
        const parsed = JSON.parse(fileData);
        if (Array.isArray(parsed)) {
          inMemoryProducts = parsed;
          return parsed;
        }
      }
    }
  } catch (error) {
    console.error('Error reading products file:', error);
  }
  return inMemoryProducts;
}

function saveProducts(products: Product[]): boolean {
  inMemoryProducts = products;
  try {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.warn('Could not write to products.json (read-only environment), kept in memory cache:', error);
    return false;
  }
}

export async function GET() {
  const products = loadProducts();
  return NextResponse.json({
    success: true,
    products,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const products = loadProducts();

    const newProduct: Product = {
      id: body.id || `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sellerId: body.sellerId || 'admin-official',
      name: body.name,
      description: body.description || '',
      category: body.category || 'Clothing',
      price: Number(body.price) || 0,
      originalPrice: body.originalPrice ? Number(body.originalPrice) : Math.round((Number(body.price) || 0) * 1.5),
      images: Array.isArray(body.images) && body.images.length > 0 ? body.images : [body.imageUrl || '/logo.png'],
      condition: body.condition || 'NEW',
      size: body.size || 'Standard',
      sizes: body.sizes || ['Medium', 'Large'],
      gender: body.gender || 'Unisex',
      neckSize: body.neckSize || '15.5"',
      waistSize: body.waistSize || '32"',
      bodyTypeFit: body.bodyTypeFit || ['Medium', 'Large'],
      brand: body.brand || 'YabaRight Official',
      material: body.material || 'Premium Quality',
      quantity: Number(body.quantity) || 10,
      sold: 0,
      rating: 5.0,
      trending: true,
      published: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updated = [newProduct, ...products];
    saveProducts(updated);

    return NextResponse.json({
      success: true,
      product: newProduct,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to create product',
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('id');

    if (!productId) {
      return NextResponse.json({ success: false, message: 'Product ID required' }, { status: 400 });
    }

    const products = loadProducts();
    const updated = products.filter((p) => p.id !== productId);
    saveProducts(updated);

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const productId = body.id;

    if (!productId) {
      return NextResponse.json({ success: false, message: 'Product ID required' }, { status: 400 });
    }

    const products = loadProducts();
    const updated = products.map((p) =>
      p.id === productId ? { ...p, ...body, updatedAt: new Date() } : p
    );
    saveProducts(updated);

    return NextResponse.json({
      success: true,
      product: updated.find((p) => p.id === productId),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
