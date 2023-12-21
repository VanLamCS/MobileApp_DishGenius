import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type FavoriteDocument = HydratedDocument<Favorite>;

@Schema()
export class Favorite {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: Number,
    require: true,
  })
  dishId: number;
}

const FavoriteSchema = SchemaFactory.createForClass(Favorite);

FavoriteSchema.index({ userId: 1, dishId: 1 }, { unique: true });

export { FavoriteSchema };
