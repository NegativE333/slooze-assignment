import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './models/restaurant.model';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser, AuthUser } from '../auth/current-user.decorator';

@Resolver(() => Restaurant)
export class RestaurantsResolver {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Query(() => [Restaurant], { name: 'restaurants' })
  @UseGuards(GqlAuthGuard)
  @Roles('ADMIN', 'MANAGER', 'MEMBER') // RBAC: All roles can access this
  getRestaurants(@CurrentUser() user: AuthUser) {
    
    // Re-BAC: Pass the user's country to the service so they only see local restaurants
    return this.restaurantsService.findAllByCountry(user.country);
  }
}