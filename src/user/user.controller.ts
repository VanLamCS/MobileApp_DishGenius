import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import {
  ChangePasswordDto,
  CreateOrLoginUserDto,
  EditProfileDto,
} from './user.dto';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { ApiResponse as CustomApiResponse } from 'src/utils/api-response';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('User')
@Controller('api')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('user/register')
  @ApiBody({ type: CreateOrLoginUserDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Register successfully',
  })
  async register(
    @Body(new ValidationPipe()) createUserDto: CreateOrLoginUserDto,
  ) {
    try {
      const res = await this.userService.add(createUserDto);
      const userData = {
        userId: res._id,
        email: res.email,
        phone: res.phone,
        name: res.name,
      };
      const token = this.jwtService.sign(userData, {
        secret: process.env.SECRET_KEY,
        expiresIn: process.env.EXPIRES_IN,
      });
      return CustomApiResponse.success(
        { user: userData, token: token },
        'Register successfully',
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post('user/login')
  @HttpCode(200)
  @ApiResponse({ status: HttpStatus.OK, description: 'Login successfully' })
  @ApiBody({ type: CreateOrLoginUserDto })
  async login(@Body(new ValidationPipe()) loginUserDto: CreateOrLoginUserDto) {
    const res = await this.userService.login(loginUserDto);
    const userData = {
      userId: res._id,
      email: res.email,
      phone: res.phone,
      name: res.name,
    };
    const token = this.jwtService.sign(userData, {
      secret: process.env.SECRET_KEY,
      expiresIn: process.env.EXPIRES_IN,
    });
    return CustomApiResponse.success(
      { user: userData, token: token },
      'Login successfully',
    );
  }

  @Patch('user/edit-profile')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async editProfile(
    @Body(new ValidationPipe({ always: true })) editProfileDto: EditProfileDto,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    const res = await this.userService.editProfile(userId, editProfileDto);
    return CustomApiResponse.success(
      { name: res.name, email: res.email, phone: res.phone },
      'Update successfully',
    );
  }

  @Patch('user/change-password')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async changePassword(
    @Body(new ValidationPipe()) changePasswordDto: ChangePasswordDto,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException('Password does not match');
    }
    await this.userService.changePassword(userId, changePasswordDto);
    return CustomApiResponse.success(null, 'Update password successfully');
  }
}
