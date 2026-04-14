const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

async function seed() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const hash = await bcrypt.hash('Admin@1234', 12);
  const user = await prisma.user.upsert({
    where: { email: 'admin@naql.sa' },
    update: {},
    create: {
      email: 'admin@naql.sa',
      passwordHash: hash,
      name: 'Admin NAQL',
      company: 'NAQL Platform',
      role: 'ADMIN',
      status: 'APPROVED',
    },
  });

  console.log('✅ Admin created:', user.email);
  await prisma.$disconnect();
  pool.end();
}

seed().catch(e => { console.error(e); process.exit(1); });
