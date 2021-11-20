import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAuthenticateDto } from './dto/auth.dto';
import { CreateUserDto } from './dto/create.user.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt.payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    return await this.userRepository.createApplicationUser(createUserDto);
  }

  async signIn(userAuthentication: UserAuthenticateDto) {
    const { userName, password } = userAuthentication;
    const user = await this.userRepository.findOne({ userName: userName });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { userName };
      const accessToken = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
