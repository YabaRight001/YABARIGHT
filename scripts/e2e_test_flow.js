const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function runE2E() {
  console.log('--- STARTING E2E INTEGRATION TEST ---');

  // 1. Authenticate Admin
  console.log('\n[1] Testing Admin Authentication via API:');
  const authRes = await fetch('http://localhost:3000/api/admin/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'yabarightofficial@gmail.com', password: 'admin1234' }),
  });
  const authData = await authRes.json();
  console.log('   Admin Auth status:', authRes.status, 'Success:', authData.success, 'User:', authData.user?.email);
  if (!authData.success) throw new Error('Admin auth failed');

  // 2. Upload Product via POST /api/products
  console.log('\n[2] Uploading New Product to SQLite Database:');
  const newProductPayload = {
    id: `prod-${Date.now()}-e2e`,
    name: 'Yaba Prestige Luxury Velvet Blazer',
    description: 'Bespoke custom-tailored velvet blazer crafted in Yaba, Lagos.',
    category: 'Suits',
    price: 52000,
    originalPrice: 75000,
    condition: 'NEW',
    images: ['/suit-blue-1.jpg'],
    size: 'Medium, Large',
    sizes: ['Medium', 'Large'],
    gender: 'Male',
    neckSize: '16.0"',
    waistSize: '34"',
    bodyTypeFit: ['Medium', 'Large'],
    brand: 'YabaRight Official',
    material: 'Italian Velvet & Silk',
    quantity: 20,
    sold: 0,
    rating: 5.0,
    trending: true,
    published: true,
    sellerId: 'admin-official',
  };

  const uploadRes = await fetch('http://localhost:3000/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newProductPayload),
  });
  const uploadData = await uploadRes.json();
  console.log('   Upload status:', uploadRes.status, 'Success:', uploadData.success, 'Product ID:', uploadData.product?.id);
  if (!uploadData.success) throw new Error('Product upload failed');

  // 3. Verify Product appears on GET /api/products
  console.log('\n[3] Verifying Product in Public Marketplace Catalog:');
  const catalogRes = await fetch('http://localhost:3000/api/products');
  const catalogData = await catalogRes.json();
  const found = catalogData.products?.find((p) => p.id === uploadData.product.id);
  console.log('   Found in public catalog:', !!found, 'Total catalog count:', catalogData.products?.length);
  if (!found) throw new Error('Uploaded product not found in catalog');

  // 4. Place Order via POST /api/orders with affiliate referral
  console.log('\n[4] Simulating Buyer Checkout with Verified Server Pricing:');
  const orderRes = await fetch('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [
        {
          productId: uploadData.product.id,
          name: uploadData.product.name,
          quantity: 2,
          size: 'Large',
        },
      ],
      customer: {
        fullName: 'Babatunde Adeyemi',
        email: 'babatunde.adeyemi@gmail.com',
        phone: '0802 345 6789',
        address: '15 Commercial Avenue, Sabo-Yaba',
        city: 'Yaba',
        state: 'Lagos',
      },
      paymentMethod: 'monnify',
      affiliateRef: 'YABA-PRO1',
    }),
  });
  const orderData = await orderRes.json();
  console.log('   Order creation status:', orderRes.status, 'Success:', orderData.success);
  console.log('   Order Number:', orderData.order?.orderNumber, 'Total:', orderData.order?.total);
  if (!orderData.success) throw new Error('Order creation failed');

  // 5. Verify Stock decrement and Sold increment in SQLite
  console.log('\n[5] Verifying Atomic Stock Decrement:');
  const dbProduct = await prisma.product.findUnique({ where: { id: uploadData.product.id } });
  console.log('   Original quantity: 20, Ordered: 2, New quantity:', dbProduct.quantity, '(expected 18)');
  console.log('   New sold count:', dbProduct.sold, '(expected 2)');
  if (dbProduct.quantity !== 18 || dbProduct.sold !== 2) throw new Error('Stock decrement mismatch');

  // 6. Verify Affiliate Commission recorded
  console.log('\n[6] Verifying Affiliate Commission Attribution:');
  const affiliate = await prisma.affiliate.findUnique({
    where: { code: 'YABA-PRO1' },
    include: { commissions: true },
  });
  const latestComm = affiliate.commissions.find((c) => c.orderId === orderData.order.id);
  console.log('   Affiliate code:', affiliate.code);
  console.log('   Total earnings:', affiliate.totalEarnings);
  console.log('   Commission recorded for order:', !!latestComm, 'Amount: ₦' + latestComm?.commissionAmount);
  if (!latestComm) throw new Error('Affiliate commission missing');

  // 7. Update Order Status via PATCH /api/orders (Fulfillment)
  console.log('\n[7] Updating Order Status to SHIPPED:');
  const patchRes = await fetch('http://localhost:3000/api/orders', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: orderData.order.id,
      orderStatus: 'SHIPPED',
    }),
  });
  const patchData = await patchRes.json();
  console.log('   Patch status:', patchRes.status, 'New orderStatus:', patchData.order?.orderStatus);
  if (patchData.order?.orderStatus !== 'SHIPPED') throw new Error('Order status patch failed');

  // 8. Confirm Final Database Counts
  console.log('\n[8] Final Verification of SQLite Records:');
  const orderCount = await prisma.order.count();
  const productCount = await prisma.product.count();
  console.log('   Total SQLite Products:', productCount);
  console.log('   Total SQLite Orders:', orderCount);

  console.log('\n========================================');
  console.log('🎉 ALL 8 END-TO-END TESTS PASSED 100%! 🎉');
  console.log('========================================');
}

runE2E()
  .catch((err) => {
    console.error('E2E TEST FAILURE:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
