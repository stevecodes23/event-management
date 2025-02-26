import { Body, Controller, Patch, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/sign-up')
  create(@Body() signUpDto: SignUpDto) {
    return this.authService.create(signUpDto);
  }
  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  @Patch('/reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Request() req) {
    console.log(req.user.sub);
    return this.authService.resetPassword(req.user.sub, resetPasswordDto);
  }
}
