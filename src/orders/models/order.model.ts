import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Order {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  status: string;

  @Field()
  createdAt: Date;
}