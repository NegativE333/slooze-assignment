import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderInput } from './dto/create-order.input';
import { AuthUser } from '../auth/current-user.decorator';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(user: AuthUser, input: CreateOrderInput) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: input.restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if (restaurant.country !== user.country) {
      throw new ForbiddenException('You can only order from restaurants in your assigned country.');
    }

    return this.prisma.order.create({
      data: {
        userId: user.id,
        status: 'PENDING',
        items: {
          create: input.items.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
          })),
        },
      },
    });
  }

  async updateOrderStatus(user: AuthUser, orderId: string, status: 'PAID' | 'CANCELLED') {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true }
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.user.country !== user.country) {
      throw new ForbiddenException('You cannot modify orders outside your assigned country.');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }
}