import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './models/order.model';
import { CreateOrderInput } from './dto/create-order.input';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser, AuthUser } from '../auth/current-user.decorator';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Mutation(() => Order)
  @UseGuards(GqlAuthGuard)
  @Roles('ADMIN', 'MANAGER', 'MEMBER')
  createOrder(
    @CurrentUser() user: AuthUser,
    @Args('input') input: CreateOrderInput,
  ) {
    return this.ordersService.createOrder(user, input);
  }
}