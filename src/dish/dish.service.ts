import { BadRequestException, Injectable } from '@nestjs/common';
import { GetDishesDto } from './dish.dto';
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Favorite } from './favorite.schema';

@Injectable()
export class DishService {
  constructor(
    @InjectModel('Favorite') private readonly favoriteModel: Model<Favorite>,
  ) {}
  async getDishes(getDishesDto: GetDishesDto) {
    const offset = (getDishesDto.page - 1) * getDishesDto.limit;
    const options = {
      method: 'GET',
      url: 'https://tasty.p.rapidapi.com/recipes/list',
      params: {
        from: offset,
        size: getDishesDto.limit,
        q: getDishesDto.q,
      },
      headers: {
        'X-RapidAPI-Key': process.env.X_RAPID_API_KEY,
        'X-RapidAPI-Host': process.env.X_RAPID_API_HOST,
      },
    };
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getDishDetail(dishId: number) {
    const options = {
      method: 'GET',
      url: 'https://tasty.p.rapidapi.com/recipes/get-more-info',
      params: { id: dishId },
      headers: {
        'X-RapidAPI-Key': process.env.X_RAPID_API_KEY,
        'X-RapidAPI-Host': process.env.X_RAPID_API_HOST,
      },
    };

    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createFavorite(userId, dishId: number) {
    try {
      const checkDish = await this.getDishDetail(dishId);
      if (!checkDish) {
        throw new BadRequestException('Dish is invalid');
      }
      const newFav = await this.favoriteModel.create({
        userId: userId,
        dishId: dishId,
      });
      await newFav.save();
      return newFav;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('You have loved this dish');
      } else throw error;
    }
  }

  async myFavoriteDishIds(userId) {
    const ids = await this.favoriteModel.find({ userId: userId });
    return ids;
  }

  async myFavoriteDishes(userId) {
    const ids = await this.favoriteModel.find({ userId: userId });
    let dishes = [];
    for (const id of ids) {
      try {
        const dish = await this.getDishDetail(id.dishId);
        if (dish) {
          dishes.push(dish);
        }
      } catch (error) {
        console.error(error);
      }
    }
    return dishes;
  }

  async deleteFavorite(userId, dishId: number) {
    const deleteRes = await this.favoriteModel
      .deleteOne({
        userId: userId,
        dishId: dishId,
      })
      .exec();
    return deleteRes;
  }
}
