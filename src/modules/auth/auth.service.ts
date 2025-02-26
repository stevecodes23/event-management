import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { compareHash, generateHash } from 'src/utils/app.utils';
import { SignUpDto } from './dto/signup.dto';
import { ENV } from 'src/constants/env.constant';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async create(signUpDto: SignUpDto) {
    try {
      signUpDto.password = await generateHash(signUpDto.password);
      await this.userRepository.save(signUpDto);

      return {};
    } catch (error) {
      if (error.status)
        throw new HttpException(error.message, error.getStatus());
      else
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }
  async login(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;
      const user = await this.userRepository.findOne({
        where: { email: email },
      });
      if (!user)
        throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
      const passwordValid = await compareHash(password, user.password);
      if (!passwordValid)
        throw new HttpException('Incorrect Password', HttpStatus.UNAUTHORIZED);
      const jwtPayload = {
        sub: user.id,
        type: user.role,
      };
      const accessToken = await this.jwtService.signAsync(jwtPayload, {
        secret: ENV.JWT.SECRET,
        expiresIn: ENV.JWT.EXPIRY,
      });
      return { accessToken };
    } catch (error) {
      if (error.status)
        throw new HttpException(error.message, error.getStatus());
      else
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }
  async resetPassword(id: number, resetPasswordDto: ResetPasswordDto) {
    try {
      const userToUpdate = await this.userRepository.findOne({
        where: { id: Number(id) },
      });
      if (!userToUpdate)
        throw new HttpException('User Does Not Exist', HttpStatus.NOT_FOUND);
      const passwordValid = await compareHash(
        resetPasswordDto.previousPassword,
        userToUpdate.password,
      );
      if (!passwordValid)
        throw new HttpException('Incorrect Password', HttpStatus.UNAUTHORIZED);
      const password = await generateHash(resetPasswordDto.currentPassword);
      await this.userRepository.update(id, {
        password: password,
      });
      return {};
    } catch (error) {
      if (error.status)
        throw new HttpException(error.message, error.getStatus());
      else
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }
}
