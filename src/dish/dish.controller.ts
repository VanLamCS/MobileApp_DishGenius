import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { GetDishesDto } from './dish.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { DishService } from './dish.service';
import { ApiResponse as CustomApiResponse } from 'src/utils/api-response';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('api')
@ApiTags('Dish')
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @Post('dish/favorite/:dishId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async loveDish(
    @Param('dishId', new ValidationPipe()) dishId: number,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    const res = await this.dishService.createFavorite(userId, dishId);
    return CustomApiResponse.success(
      null,
      `You loved this dish with dishId ${dishId}`,
    );
  }

  @Get('dishes')
  async getDishes(@Query(new ValidationPipe()) getDishesDto: GetDishesDto) {
    const realData = plainToInstance(GetDishesDto, getDishesDto);
    const res = await this.dishService.getDishes(realData);
    return CustomApiResponse.success(res, 'Retrieve successfully');
  }

  @Get('dish/:dishId')
  async getDishDetail(@Param('dishId', new ValidationPipe()) dishId: number) {
    const detail = await this.dishService.getDishDetail(dishId);
    return detail;
  }

  @Get('my-favorite-dish-ids')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async myFavoriteIds(@Req() req: any) {
    const userId = req.user.userId;
    const ids = await this.dishService.myFavoriteDishIds(userId);
    return CustomApiResponse.success(
      { ids: ids.map((fav) => fav.dishId) },
      'Retrieve list of dish ids which you loved',
    );
  }

  @Get('my-favorite-dishes')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async myFavorite(@Req() req: any) {
    const userId = req.user.userId;
    const dishes = await this.dishService.myFavoriteDishes(userId);
    return CustomApiResponse.success(
      { dishes: dishes },
      'Retrieve list of dish ids which you loved',
    );
  }

  @Delete('dish/favorite/:dishId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async deleteFavorite(
    @Param('dishId', new ValidationPipe()) dishId: number,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    const deleteRes = await this.dishService.deleteFavorite(userId, dishId);
    if (deleteRes.deletedCount > 0) {
      return CustomApiResponse.success(
        null,
        'Remove from favorite list successfully',
      );
    } else {
      return CustomApiResponse.error(400, 'Remove from favorite list failed');
    }
  }
}
