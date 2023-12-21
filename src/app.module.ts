import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { UserModule } from './user/user.module';
import { DishModule } from './dish/dish.module';
import { APP_FILTER } from '@nestjs/core';
import { CustomExceptionFilter } from './filters/custom-filter';
import { IngredientModule } from './ingredient/ingredient.module';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.MONGOOSE_USER}:${process.env.MONGOOSE_PASSWORD}@cluster0.51mece7.mongodb.net/?retryWrites=true&w=majority`,
    ),
    UserModule,
    DishModule,
    IngredientModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
  ],
})
export class AppModule {}
