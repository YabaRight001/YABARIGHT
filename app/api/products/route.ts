import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Product } from '@/types';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function formatProduct(p: any): Product {
  let images: string[] = ['/logo.png'];
  try {
    if (typeof p.images === 'string') images = JSON.parse(p.images);
    else if (Array.isArray(p.images)) images = p.images;
  } catch (e) {}

  let sizes: string[] = ['Medium', 'Large'];
  try {
    if (typeof p.sizes === 'string') sizes = JSON.parse(p.sizes);
    else if (Array.isArray(p.sizes)) sizes = p.sizes;
  } catch (e) {}

  let bodyTypeFit = undefined;
  try {
    if (typeof p.bodyTypeFit === 'string' && p.bodyTypeFit) bodyTypeFit = JSON.parse(p.bodyTypeFit);
    else if (Array.isArray(p.bodyTypeFit)) bodyTypeFit = p.bodyTypeFit;
  } catch (e) {}

  return {
    id: p.id,
    sellerId: p.sellerId || 'admin-official',
    name: p.name,
    description: p.description,
    category: p.category,
    price: Number(p.price),
    originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
    condition: p.condition as any,
    size: p.size || 'Standard',
    sizes: sizes as any,
    gender: p.gender as any,
    neckSize: p.neckSize || undefined,
    waistSize: p.waistSize || undefined,
    bodyTypeFit: bodyTypeFit as any,
    brand: p.brand || 'YabaRight Official',
    material: p.material || 'Premium Quality',
    color: p.color || undefined,
    quantity: p.quantity ?? 10,
    sold: p.sold ?? 0,
    rating: p.rating ?? 5.0,
    trending: Boolean(p.trending),
    published: p.published !== false,
    images,
    createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
    updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date(),
  };
}

// Backup file sync
const dataFilePath = path.join(process.cwd(), 'data', 'products.json');
function syncFileBackup(products: Product[]) {
  try {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2), 'utf8');
  } catch (e) {
    console.warn('Backup file write warning:', e);
  }
}

export async function GET() {
  try {
    let dbProducts = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Auto-seed if database is brand new and empty
    if (dbProducts.length === 0 && fs.existsSync(dataFilePath)) {
      try {
        const fileData = fs.readFileSync(dataFilePath, 'utf8');
        const seedList: any[] = JSON.parse(fileData);

        if (Array.isArray(seedList) && seedList.length > 0) {
          // Ensure default admin user and vendor exist
          let defaultVendorId: string | null = null;
          try {
            const adminUser = await prisma.user.upsert({
              where: { email: 'yabarightofficial@gmail.com' },
              update: {},
              create: {
                id: 'usr-admin-01',
                name: 'Chief Admin',
                email: 'yabarightofficial@gmail.com',
                passwordHash: '$2a$10$wKq9lOQy5vVjA7sC5tS6fO8c7.N5e4F3g2h1i0j9k8l7m6n5o4p3q',
                role: 'ADMIN',
                status: 'active',
              },
            });

            const defaultVendor = await prisma.vendor.upsert({
              where: { userId: adminUser.id },
              update: {},
              create: {
                id: 'admin-official',
                userId: adminUser.id,
                shopName: 'YabaRight Official',
                isVerified: true,
                rating: 5.0,
                totalSales: 850,
              },
            });
            defaultVendorId = defaultVendor.id;
          } catch (vErr) {
            console.warn('Vendor upsert warning:', vErr);
          }

          for (const p of seedList) {
            await prisma.product.create({
              data: {
                id: p.id,
                sellerId: defaultVendorId,
                name: p.name,
                description: p.description || '',
                category: p.category || 'Clothing',
                price: Number(p.price) || 0,
                originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
                images: JSON.stringify(Array.isArray(p.images) ? p.images : [p.images || '/logo.png']),
                condition: p.condition || 'NEW',
                size: p.size || 'Standard',
                sizes: JSON.stringify(Array.isArray(p.sizes) ? p.sizes : ['Medium', 'Large']),
                gender: p.gender || 'Unisex',
                neckSize: p.neckSize || null,
                waistSize: p.waistSize || null,
                bodyTypeFit: Array.isArray(p.bodyTypeFit) ? JSON.stringify(p.bodyTypeFit) : null,
                brand: p.brand || 'YabaRight Official',
                material: p.material || 'Premium Quality',
                quantity: Number(p.quantity) || 10,
                sold: Number(p.sold) || 0,
                rating: Number(p.rating) || 5.0,
                trending: Boolean(p.trending),
                published: p.published !== false,
              },
            }).catch(() => {});
          }

          dbProducts = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
        }
      } catch (seedErr) {
        console.warn('Auto-seed products error:', seedErr);
      }
    }

    const products = dbProducts.map(formatProduct);
    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error: any) {
    console.error('Error fetching products from DB:', error);
    // Fallback to file if DB connection has issue
    if (fs.existsSync(dataFilePath)) {
      try {
        const fileData = fs.readFileSync(dataFilePath, 'utf8');
        const parsed = JSON.parse(fileData);
        return NextResponse.json({ success: true, products: parsed });
      } catch (fErr) {}
    }
    return NextResponse.json({ success: false, products: [] }, { status: 500 });
  }
}

function persistBase64Image(urlOrData: string): string {
  if (!urlOrData || typeof urlOrData !== 'string' || !urlOrData.startsWith('data:image/')) {
    return urlOrData;
  }
  const matches = urlOrData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) return urlOrData;

  try {
    const mimeType = matches[1];
    const base64Data = matches[2];
    const ext = mimeType.split('/')[1] === 'jpeg' ? 'jpg' : (mimeType.split('/')[1] || 'jpg');
    const filename = `product-${Date.now()}-${Math.random().toString(36).substring(2, 6)}.${ext}`;
    const buffer = Buffer.from(base64Data, 'base64');

    const dirs = [
      path.join(process.cwd(), 'public', 'uploads'),
      path.join(process.platform === 'win32' ? path.join(process.cwd(), 'public', 'uploads') : '/tmp', 'uploads'),
    ];

    for (const dir of dirs) {
      try {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, filename), buffer);
        return `/uploads/${filename}`;
      } catch (e) {}
    }
  } catch (err) {
    console.warn('Failed to extract base64 to file:', err);
  }
  return urlOrData;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const productId = body.id || `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    
    // Safely resolve seller/vendor ID to prevent foreign key errors
    let validSellerId: string | null = null;
    if (body.sellerId) {
      const existingVendor = await prisma.vendor.findUnique({ where: { id: body.sellerId } });
      if (existingVendor) {
        validSellerId = existingVendor.id;
      }
    }
    if (!validSellerId) {
      const defaultAdmin = await prisma.vendor.findUnique({ where: { id: 'admin-official' } });
      if (defaultAdmin) {
        validSellerId = defaultAdmin.id;
      } else {
        const anyVendor = await prisma.vendor.findFirst();
        if (anyVendor) validSellerId = anyVendor.id;
      }
    }

    let rawImages = Array.isArray(body.images) && body.images.length > 0 
      ? body.images 
      : [body.imageUrl || '/logo.png'];

    const imagesArray = rawImages.map(persistBase64Image);

    const sizesArray = Array.isArray(body.sizes) && body.sizes.length > 0
      ? body.sizes
      : ['Medium', 'Large'];

    const newDbProduct = await prisma.product.create({
      data: {
        id: productId,
        sellerId: validSellerId,
        name: body.name,
        description: body.description || '',
        category: body.category || 'Clothing',
        price: Number(body.price) || 0,
        originalPrice: body.originalPrice ? Number(body.originalPrice) : Math.round((Number(body.price) || 0) * 1.5),
        images: JSON.stringify(imagesArray),
        condition: body.condition || 'NEW',
        size: body.size || 'Standard',
        sizes: JSON.stringify(sizesArray),
        gender: body.gender || 'Unisex',
        neckSize: body.neckSize || null,
        waistSize: body.waistSize || null,
        bodyTypeFit: body.bodyTypeFit ? JSON.stringify(body.bodyTypeFit) : null,
        brand: body.brand || 'YabaRight Official',
        material: body.material || 'Premium Quality',
        quantity: Number(body.quantity) || 10,
        sold: 0,
        rating: 5.0,
        trending: true,
        published: true,
      },
    });

    const formatted = formatProduct(newDbProduct);

    // Sync backup
    prisma.product.findMany({ orderBy: { createdAt: 'desc' } }).then((all) => {
      syncFileBackup(all.map(formatProduct));
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      product: formatted,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product in DB:', error);
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

    await prisma.product.delete({
      where: { id: productId },
    });

    // Sync backup
    prisma.product.findMany({ orderBy: { createdAt: 'desc' } }).then((all) => {
      syncFileBackup(all.map(formatProduct));
    }).catch(() => {});

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

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.price !== undefined) updateData.price = Number(body.price);
    if (body.originalPrice !== undefined) updateData.originalPrice = Number(body.originalPrice);
    if (body.condition !== undefined) updateData.condition = body.condition;
    if (body.size !== undefined) updateData.size = body.size;
    if (body.gender !== undefined) updateData.gender = body.gender;
    if (body.neckSize !== undefined) updateData.neckSize = body.neckSize;
    if (body.waistSize !== undefined) updateData.waistSize = body.waistSize;
    if (body.brand !== undefined) updateData.brand = body.brand;
    if (body.material !== undefined) updateData.material = body.material;
    if (body.quantity !== undefined) updateData.quantity = Number(body.quantity);
    if (body.images) {
      const imgList = Array.isArray(body.images) ? body.images : [body.images];
      updateData.images = JSON.stringify(imgList.map(persistBase64Image));
    }
    if (body.sizes) updateData.sizes = JSON.stringify(body.sizes);
    if (body.bodyTypeFit) updateData.bodyTypeFit = JSON.stringify(body.bodyTypeFit);

    const updated = await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    const formatted = formatProduct(updated);

    // Sync backup
    prisma.product.findMany({ orderBy: { createdAt: 'desc' } }).then((all) => {
      syncFileBackup(all.map(formatProduct));
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      product: formatted,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
