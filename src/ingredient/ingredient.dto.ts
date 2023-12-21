import { ApiProperty } from '@nestjs/swagger';

export class DetectIngredientsDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  image: any;
}
