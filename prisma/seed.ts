import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is missing from .env file');
}

const pool = new Pool({ 
  connectionString,
  ssl: { rejectUnauthorized: false }
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.restaurant.deleteMany();

  await prisma.user.upsert({
    where: { id: 'test-member' },
    update: {},
    create: {
      id: 'test-member',
      email: 'member@mock.com',
      password: 'mock-password-123',
      role: 'MEMBER',
      country: 'INDIA',
    },
  });

  await prisma.user.upsert({
    where: { id: 'test-manager' },
    update: {},
    create: {
      id: 'test-manager',
      email: 'manager@mock.com',
      password: 'mock-password-123',
      role: 'MANAGER',
      country: 'INDIA',
    },
  });

  await prisma.user.upsert({
    where: { id: 'test-admin' },
    update: {},
    create: {
      id: 'test-admin',
      email: 'admin@mock.com',
      password: 'mock-password-123',
      role: 'ADMIN',
      country: 'INDIA',
    },
  });

  const indiaRest = await prisma.restaurant.create({
    data: {
      name: 'Pune Spice',
      country: 'INDIA',
      menuItems: {
        create: [
          { name: 'Butter Chicken', price: 350 },
          { name: 'Garlic Naan', price: 50 },
        ],
      },
    },
  });

  const usRest = await prisma.restaurant.create({
    data: {
      name: 'Liberty Burger Co.',
      country: 'AMERICA',
      menuItems: {
        create: [
          { name: 'Classic Cheeseburger', price: 12.5 },
          { name: 'Large Fries', price: 4.0 },
        ],
      },
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });