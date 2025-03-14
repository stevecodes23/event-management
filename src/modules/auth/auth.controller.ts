import { Body, Controller, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserRole } from './entities/user.entity';
import { Roles } from 'src/decorator/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/decorator/public.decorator';
import { GetUser } from 'src/decorator/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('/sign-up')
  create(@Body() signUpDto: SignUpDto) {
    return this.authService.create(signUpDto);
  }
  @Public()
  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.USER, UserRole.ORGANISER)
  @Patch('/reset-password')
  resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @GetUser('id') userId: number,
  ) {
    return this.authService.resetPassword(userId, resetPasswordDto);
  }
}
