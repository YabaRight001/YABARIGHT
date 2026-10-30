const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function runTests() {
  console.log('--- 1. Testing user count and registration stats ---');

  const allUsers = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
    orderBy: { createdAt: 'desc' }
  });

  console.log(`Current users in database: ${allUsers.length}`);
  allUsers.forEach(u => {
    console.log(` - [${u.role}] ${u.name} (${u.email}) - Registered: ${u.createdAt.toISOString()}`);
  });

  // Test Role Counts
  const buyerCount = await prisma.user.count({ where: { role: 'BUYER' } });
  const sellerCount = await prisma.user.count({ where: { role: 'SELLER' } });
  const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
  const affiliateCount = await prisma.user.count({ where: { role: 'AFFILIATE' } });

  console.log('\n--- 2. Role Breakdown Counts ---');
  console.log(`Buyers: ${buyerCount}`);
  console.log(`Sellers: ${sellerCount}`);
  console.log(`Admins: ${adminCount}`);
  console.log(`Affiliates: ${affiliateCount}`);

  // Test Time-based Counts
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const todayCount = await prisma.user.count({ where: { createdAt: { gte: startOfToday } } });
  const weekCount = await prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } });
  const monthCount = await prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } });

  console.log('\n--- 3. Registration Timeframe Counts ---');
  console.log(`Registered Today: ${todayCount}`);
  console.log(`Registered Last 7 Days: ${weekCount}`);
  console.log(`Registered Last 30 Days: ${monthCount}`);

  // Test 4: Dynamic User Creation and Count Verification
  console.log('\n--- 4. Testing Dynamic Registration & Count Increment ---');
  const testEmail = `test.user.${Date.now()}@example.com`;
  const initialTotal = await prisma.user.count();

  const createdUser = await prisma.user.create({
    data: {
      name: 'Test Registration User',
      email: testEmail,
      passwordHash: 'dummy_hash_for_test',
      role: 'BUYER',
      status: 'active',
    }
  });

  console.log(`Created test user: ${createdUser.email} (id: ${createdUser.id})`);

  const updatedTotal = await prisma.user.count();
  const updatedTodayCount = await prisma.user.count({ where: { createdAt: { gte: startOfToday } } });

  console.log(`Total count before: ${initialTotal}, after: ${updatedTotal}`);
  if (updatedTotal !== initialTotal + 1) {
    throw new Error('Total count did not increment as expected!');
  }
  console.log(`Today count after registration: ${updatedTodayCount}`);

  // Clean up test user
  await prisma.user.delete({ where: { id: createdUser.id } });
  const postCleanupTotal = await prisma.user.count();
  console.log(`Cleaned up test user. Total count restored to: ${postCleanupTotal}`);

  if (postCleanupTotal !== initialTotal) {
    throw new Error('Cleanup failed to restore original count!');
  }

  console.log('\n>>> All registration count verification tests PASSED successfully! <<<');
}

runTests()
  .catch(err => {
    console.error('Test failed with error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
