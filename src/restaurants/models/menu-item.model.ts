import { Field, ObjectType, Float } from '@nestjs/graphql';

@ObjectType()
export class MenuItem {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => Float)
  price: number;

  @Field()
  restaurantId: string;
}