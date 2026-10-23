const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const p = await prisma.product.create({
      data: {
        id: 'test-create-' + Date.now(),
        sellerId: 'admin-official',
        name: 'Test Shirt',
        description: 'Test Shirt Description',
        category: 'Clothing',
        price: 15000,
        images: JSON.stringify(['/logo.png']),
      }
    });
    console.log('SUCCESSFULLY CREATED:', p.id);
    await prisma.product.delete({ where: { id: p.id } });
    console.log('CLEANED UP:', p.id);
  } catch (err) {
    console.error('CREATE ERROR:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
