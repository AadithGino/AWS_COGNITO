import { IsEmail, IsNotEmpty } from 'class-validator';

export class VerifyEmail {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNotEmpty()
  otp: string;
}
