import { IsEmail, IsNotEmpty, IsString, Validate } from 'class-validator';
import { WeakPasswordValidator } from 'src/shared/validator/weak-password.validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Validate(WeakPasswordValidator)
  password: string;
}
