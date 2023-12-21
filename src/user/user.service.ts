import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import {
  ChangePasswordDto,
  CreateOrLoginUserDto,
  EditProfileDto,
} from './user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async add(createUserDto: CreateOrLoginUserDto) {
    const newUser = await this.userModel.create(createUserDto);
    return newUser.save();
  }

  async login(loginUserDto: CreateOrLoginUserDto) {
    const user = await this.userModel.findOne({ email: loginUserDto.email });
    if (!user) {
      throw new BadRequestException('User is invalid');
    }
    if (user.password === loginUserDto.password) {
      return user;
    } else {
      throw new BadRequestException('Password is incorrect');
    }
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) {
      throw new BadRequestException('User is invalid');
    }
    if (changePasswordDto.oldPassword === user.password) {
      user.password = changePasswordDto.newPassword;
      await user.save();
    } else {
      throw new BadRequestException('Old password does not match');
    }
    return user;
  }

  async editProfile(userId: string, editProfileDto: EditProfileDto) {
    const user = await this.userModel.findOne({ _id: userId });
    let change = false;
    if (!user) {
      throw new BadRequestException('User is invalid');
    }
    if (
      !editProfileDto['name'] &&
      !editProfileDto['email'] &&
      !editProfileDto['phone']
    ) {
      throw new BadRequestException('There is nothing to update');
    }
    if (editProfileDto['name'] && editProfileDto['name'] !== user.name) {
      user.name = editProfileDto['name'];
      change = true;
    }
    if (editProfileDto['email'] && editProfileDto['email'] !== user.email) {
      user.email = editProfileDto['email'];
      change = true;
    }
    if (editProfileDto['phone'] && editProfileDto['phone'] !== user.phone) {
      user.phone = editProfileDto['phone'];
      change = true;
    }
    if (!change) {
      throw new BadRequestException('There is nothing to update');
    }
    await user.save();
    return user;
  }

  async get(userId: string) {
    const user = await this.userModel.findById(userId)
    return user;
  }
}
