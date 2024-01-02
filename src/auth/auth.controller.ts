import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SetNewPasswordDto, SignInDto, SignUpDto, VerifyEmail } from './dto';
import { GetUser, Public } from 'src/shared/decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/sign-up')
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Post('/verify-email')
  verifyEmail(@Body() dto: VerifyEmail) {
    return this.authService.verifyEmail(dto);
  }

  @Public()
  @Post('/sign-in')
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @Public()
  @Post('/forgot-password')
  forgotPassword(@Body() dto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Public()
  @Post('/set-new-password')
  setNewPassword(@Body() dto: SetNewPasswordDto) {
    return this.authService.setNewPassword(dto);
  }

  @Get('/profile')
  getProfile(@GetUser() user) {
    return { user };
  }
}
