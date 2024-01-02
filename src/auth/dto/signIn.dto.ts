import { IsEmail, IsNotEmpty, Validate } from 'class-validator';
import { WeakPasswordValidator } from 'src/shared/validator/weak-password.validator';

export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  // @Validate(WeakPasswordValidator)
  password: string;
}
