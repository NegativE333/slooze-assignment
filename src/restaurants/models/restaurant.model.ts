import { Field, ObjectType } from '@nestjs/graphql';
import { MenuItem } from './menu-item.model';

@ObjectType()
export class Restaurant {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  country: string;

  @Field(() => [MenuItem], { nullable: 'itemsAndList' })
  menuItems?: MenuItem[];
}