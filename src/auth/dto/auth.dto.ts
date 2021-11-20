/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';
export class UserAuthenticateDto {
  @IsNotEmpty()
  userName: string;
  @IsNotEmpty()
  password: string;
}
