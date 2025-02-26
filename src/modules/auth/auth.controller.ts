import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/sign-up')
  create(@Body() signUpDto: SignUpDto) {
    return this.authService.create(signUpDto);
  }
}
