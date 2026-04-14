import "dotenv/config";
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const prismaClientSingleton = () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

const prisma = prismaClientSingleton()
async function main() {
  // Create shipper user
  const shipperHash = await bcrypt.hash('test1234', 12)
  await prisma.user.upsert({
    where: { email: 'shipper@test.com' },
    update: {},
    create: {
      email: 'shipper@test.com',
      passwordHash: shipperHash,
      name: 'أحمد الشاحن',
      company: 'مؤسسة الشحن الوطنية',
      role: 'SHIPPER',
      status: 'APPROVED',
    },
  })

  // Create carrier user
  const carrierHash = await bcrypt.hash('test1234', 12)
  await prisma.user.upsert({
    where: { email: 'carrier@test.com' },
    update: {},
    create: {
      email: 'carrier@test.com',
      passwordHash: carrierHash,
      name: 'خالد الناقل',
      company: 'شركة النقل السريع',
      role: 'CARRIER',
      status: 'APPROVED',
    },
  })

  // Create admin user
  const adminHash = await bcrypt.hash('Admin@1234', 12)
  await prisma.user.upsert({
    where: { email: 'admin@naql.sa' },
    update: {},
    create: {
      email: 'admin@naql.sa',
      passwordHash: adminHash,
      name: 'نظام الإدارة',
      company: 'ناقل - الإدارة العامة',
      role: 'ADMIN',
      status: 'APPROVED',
    },
  })

  console.log('✅ Seed successful!')
  console.log('   Admin: admin@naql.sa / Admin@1234')
  console.log('   Shipper: shipper@test.com / test1234')
  console.log('   Carrier: carrier@test.com / test1234')
}

main()
  .catch(e => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
