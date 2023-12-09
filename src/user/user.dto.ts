import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsPhoneNumber, MinLength } from 'class-validator';

export class CreateOrLoginUserDto {
  @ApiProperty({ example: 'vanlam@gmail.com' })
  @IsEmail()
  email: 'string';

  @ApiProperty({ example: '*******' })
  @MinLength(6, { message: 'Password too short' })
  password: 'string';
}

export class ChangePasswordDto {
  @ApiProperty()
  oldPassword: string;

  @ApiProperty()
  @MinLength(6, { message: 'Password too short' })
  newPassword: string;

  @ApiProperty()
  confirmPassword: string;
}

export class EditProfileDto {
  @ApiPropertyOptional({ example: 'Le Van Lam' })
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ example: 'vanlam@gmail.com' })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '0999999999' })
  @IsOptional()
  @IsPhoneNumber('VN')
  phone: string;
}
