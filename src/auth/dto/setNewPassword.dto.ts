import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SetNewPasswordDto {
  @IsNotEmpty()
  @IsString()
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  verificationCode: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
