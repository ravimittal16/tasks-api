import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserAuthenticateDto } from './dto/auth.dto';
import { CreateUserDto } from './dto/create.user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() body: CreateUserDto) {
    return await this.authService.signup(body);
  }

  @Post('/signin')
  async signin(@Body() userAuth: UserAuthenticateDto) {
    return await this.authService.signIn(userAuth);
  }
}
