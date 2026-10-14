const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  console.log('TOTAL PRODUCTS IN SQLITE:', products.length);

  const orders = await prisma.order.findMany({ include: { items: true } });
  console.log('TOTAL ORDERS IN SQLITE:', orders.length);

  const vendors = await prisma.vendor.findMany({ include: { user: true } });
  console.log('TOTAL VENDORS IN SQLITE:', vendors.length);

  const users = await prisma.user.findMany();
  console.log('TOTAL USERS IN SQLITE:', users.length);

  const affiliates = await prisma.affiliate.findMany({ include: { commissions: true } });
  console.log('TOTAL AFFILIATES IN SQLITE:', affiliates.length);
}

main().catch(console.error).finally(() => prisma.$disconnect());
