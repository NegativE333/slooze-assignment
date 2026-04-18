import { Resolver, Mutation, Args, ObjectType, Field } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { PrismaService } from '../prisma/prisma.service';

@ObjectType()
class PaymentMethodType {
  @Field() id: string;
  @Field() type: string;
}

@Resolver()
export class PaymentsResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Mutation(() => PaymentMethodType)
  @UseGuards(GqlAuthGuard)
  @Roles('ADMIN')
  async addPaymentMethod(
    @Args('type') type: string,
    @Args('lastFour', { nullable: true }) lastFour: string,
  ) {
    return this.prisma.paymentMethod.create({
      data: { type, lastFour },
    });
  }
}