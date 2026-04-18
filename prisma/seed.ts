import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.restaurant.deleteMany();

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