const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding SQLite database...');

  // 1. Seed System Admin
  const adminPasswordHash = await bcrypt.hash('admin1234', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'yabarightofficial@gmail.com' },
    update: {
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
    create: {
      id: 'usr-admin-01',
      name: 'Chief Admin',
      email: 'yabarightofficial@gmail.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      phone: '0806 308 1972',
      avatar: '/logo.png',
      status: 'active',
    },
  });
  console.log('Admin user seeded:', admin.email);

  // 1b. Seed Admin Vendor Account
  const adminVendor = await prisma.vendor.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      id: 'admin-official',
      userId: admin.id,
      shopName: 'YabaRight Official',
      address: 'Tejuosho Market / Yaba Central, Lagos',
      idType: 'CAC Certificate',
      idNumber: 'RC-YABARIGHT-001',
      isVerified: true,
      verifiedAt: new Date(),
      rating: 5.0,
      totalSales: 850,
    },
  });
  console.log('Admin official vendor seeded:', adminVendor.id);

  // 2. Seed Verified Vendor
  const sellerPasswordHash = await bcrypt.hash('seller123', 10);
  const sellerUser = await prisma.user.upsert({
    where: { email: 'seller@yabaright.ng' },
    update: {
      passwordHash: sellerPasswordHash,
      role: 'SELLER',
    },
    create: {
      id: 'usr-seller-01',
      name: 'Zainab Heritage Fashion',
      email: 'seller@yabaright.ng',
      passwordHash: sellerPasswordHash,
      role: 'SELLER',
      phone: '0803 456 7890',
      avatar: '/logo.png',
      status: 'active',
    },
  });

  const vendor = await prisma.vendor.upsert({
    where: { userId: sellerUser.id },
    update: {},
    create: {
      id: 'seller-1',
      userId: sellerUser.id,
      shopName: 'Lagos Heritage Store',
      address: 'Tejuosho Ultra-Modern Market, Yaba, Lagos',
      idType: 'CAC Certificate',
      idNumber: 'RC-1849204',
      isVerified: true,
      verifiedAt: new Date(),
      rating: 4.9,
      totalSales: 145,
    },
  });
  console.log('Vendor seeded:', vendor.shopName);

  // 3. Seed Affiliate
  const affiliate = await prisma.affiliate.upsert({
    where: { email: 'affiliate@yabaright.ng' },
    update: {},
    create: {
      id: 'aff-01',
      code: 'YABA-PRO1',
      fullName: 'Tunde Afolabi',
      email: 'affiliate@yabaright.ng',
      phone: '0804 000 0004',
      totalEarnings: 45000,
      pendingEarnings: 12000,
      paidEarnings: 33000,
    },
  });
  console.log('Affiliate seeded:', affiliate.code);

  // 4. Seed Products from data/products.json
  const dataFilePath = path.join(process.cwd(), 'data', 'products.json');
  if (fs.existsSync(dataFilePath)) {
    const raw = fs.readFileSync(dataFilePath, 'utf8');
    const products = JSON.parse(raw);

    for (const p of products) {
      await prisma.product.upsert({
        where: { id: p.id },
        update: {
          name: p.name,
          description: p.description,
          category: p.category,
          price: Number(p.price) || 0,
          originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
          condition: p.condition || 'NEW',
          size: p.size || 'Standard',
          sizes: Array.isArray(p.sizes) ? JSON.stringify(p.sizes) : JSON.stringify(['Medium', 'Large']),
          gender: p.gender || 'Unisex',
          neckSize: p.neckSize || null,
          waistSize: p.waistSize || null,
          bodyTypeFit: Array.isArray(p.bodyTypeFit) ? JSON.stringify(p.bodyTypeFit) : null,
          brand: p.brand || 'YabaRight Official',
          material: p.material || 'Premium Quality',
          color: p.color || null,
          quantity: Number(p.quantity) || 10,
          sold: Number(p.sold) || 0,
          rating: Number(p.rating) || 5.0,
          trending: Boolean(p.trending),
          published: p.published !== false,
          images: Array.isArray(p.images) ? JSON.stringify(p.images) : JSON.stringify(['/logo.png']),
        },
        create: {
          id: p.id,
          sellerId: p.sellerId === 'seller-1' ? 'seller-1' : 'admin-official',
          name: p.name,
          description: p.description || '',
          category: p.category || 'Clothing',
          price: Number(p.price) || 0,
          originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
          condition: p.condition || 'NEW',
          size: p.size || 'Standard',
          sizes: Array.isArray(p.sizes) ? JSON.stringify(p.sizes) : JSON.stringify(['Medium', 'Large']),
          gender: p.gender || 'Unisex',
          neckSize: p.neckSize || null,
          waistSize: p.waistSize || null,
          bodyTypeFit: Array.isArray(p.bodyTypeFit) ? JSON.stringify(p.bodyTypeFit) : null,
          brand: p.brand || 'YabaRight Official',
          material: p.material || 'Premium Quality',
          color: p.color || null,
          quantity: Number(p.quantity) || 10,
          sold: Number(p.sold) || 0,
          rating: Number(p.rating) || 5.0,
          trending: Boolean(p.trending),
          published: p.published !== false,
          images: Array.isArray(p.images) ? JSON.stringify(p.images) : JSON.stringify(['/logo.png']),
        },
      });
    }
    console.log(`Seeded ${products.length} products into SQLite database.`);
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
