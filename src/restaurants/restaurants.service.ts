import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  // Notice how we require the country parameter here. This is our Re-BAC enforcement at the database level.
  async findAllByCountry(country: 'INDIA' | 'AMERICA') {
    return this.prisma.restaurant.findMany({
      where: {
        country: country,
      },
      include: {
        menuItems: true,
      },
    });
  }
}