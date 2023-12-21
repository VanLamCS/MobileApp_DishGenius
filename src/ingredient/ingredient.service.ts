import { Injectable } from '@nestjs/common';
import axios from 'axios';
import 'multer';

@Injectable()
export class IngredientService {
  async detectIngredients(image: Express.Multer.File) {
    try {
      const blobImage = new Blob([image.buffer], { type: image.mimetype });
      const formData = new FormData();
      formData.append('image', blobImage, image.originalname);
      const response = await axios.post(
        'https://api.logmeal.es/v2/image/segmentation/complete/v1.0',
        formData,
        {
          params: {
            language: 'eng',
          },
          headers: {
            Authorization: `Bearer ${process.env.LOG_MEAL_TOKEN}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      let ingredients: Set<string> = new Set();
      response.data['segmentation_results'].map((segment) => {
        segment['recognition_results'].map((obj) => {
          if (obj['foodType']['id'] === 2) {
            ingredients.add(obj['name']);
          }
        });
      });
      return ingredients;
    } catch (error) {
      throw error;
    }
  }
}
