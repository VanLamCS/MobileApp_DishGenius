import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import 'multer';
import { DetectIngredientsDto } from './ingredient.dto';
import { IngredientService } from './ingredient.service';
import { ApiResponse } from 'src/utils/api-response';

@Controller()
@ApiTags('Ingredient')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Post('detect-ingredients')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: DetectIngredientsDto })
  @UseInterceptors(FileInterceptor('image'))
  async detectIngredients(@UploadedFile() image: Express.Multer.File) {
    const res = await this.ingredientService.detectIngredients(image);
    return ApiResponse.success(
      { ingredients: Array.from(res) },
      'Detected ingredients',
    );
  }
}
