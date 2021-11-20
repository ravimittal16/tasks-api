/* eslint-disable prettier/prettier */
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create.user.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

const userErrorCodes = {
  '23505': { message: 'User already exists' },
};

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createApplicationUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { userName, password, userEmail } = createUserDto;
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = this.create({
        userName,
        password: hashedPassword,
        userEmail,
      });
      await this.save(newUser);
      delete newUser.password;
      return newUser;
    } catch (error) {
      const userError = userErrorCodes[error.code];
      if (userError) {
        throw new ConflictException(userError.message);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
