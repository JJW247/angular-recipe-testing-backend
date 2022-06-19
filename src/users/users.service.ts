import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { RequestAuthDto } from './dto/request/request-auth.dto';
import { ResponseAuthDto } from './dto/response/response-auth.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  getMe(user: User) {
    return user
      ? {
          userId: user.id,
        }
      : { userId: null };
  }

  async getMyInfo(user: User) {
    const foundUser = await this.usersRepository.findOne({
      where: { id: user.id },
      select: ['id'],
    });
    if (!foundUser) {
      throw new HttpException('User does not exist!', HttpStatus.NOT_FOUND);
    }
    return foundUser;
  }

  async findAllUsers(user: User) {
    const users = await this.usersRepository.find({
      select: ['id', 'email'],
    });
    if (users.length === 0) {
      return null;
    }
    return users;
  }

  async updateUserInfo(
    param: { userId: string },
    user: User,
    updateUserInfoDto: {
      email: string | null;
      password: string | null;
    },
  ) {
    if (user.id !== +param.userId) {
      throw new HttpException('Not authorized!', HttpStatus.FORBIDDEN);
    }
    const existUpdateUser = await this.usersRepository.findOne({
      where: {
        id: +param.userId,
      },
    });
    if (!existUpdateUser) {
      throw new HttpException(
        'Bad request error occured!',
        HttpStatus.BAD_REQUEST,
      );
    }
    existUpdateUser.email = updateUserInfoDto.email
      ? updateUserInfoDto.email
      : existUpdateUser.email;
    existUpdateUser.password = updateUserInfoDto.password
      ? await bcrypt.hash(updateUserInfoDto.password, 10)
      : existUpdateUser.password;
    return await this.usersRepository.save(existUpdateUser);
  }

  async deleteUser(param: { userId: string }, user: User) {
    const existDeleteUser = await this.usersRepository.findOne({
      where: {
        id: +param.userId,
      },
    });
    const result = await this.usersRepository.delete({
      id: existDeleteUser.id,
    });
    return result.affected === 1 ? { ok: true } : { ok: false };
  }

  async signUp(authDto: RequestAuthDto): Promise<ResponseAuthDto> {
    const hashedPassword = await bcrypt.hash(authDto.password, 10);

    const existUser = await this.usersRepository.findOne({
      where: {
        email: authDto.email,
      },
      select: ['id', 'email', 'password'],
    });

    if (existUser) {
      throw new HttpException(
        'This email exists already!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = this.usersRepository.create({
      email: authDto.email,
      password: hashedPassword,
    });

    await this.usersRepository.save(user);

    const token = this.jwtService.sign({ id: user.id });
    const decodedToken = this.jwtService.decode(token);
    const tokenExpirationDate = decodedToken['exp'];

    return {
      idToken: token,
      email: user.email,
      expiresIn: tokenExpirationDate.toString(),
    };
  }

  async signIn(authDto: RequestAuthDto): Promise<ResponseAuthDto> {
    const user = await this.usersRepository.findOne({
      where: {
        email: authDto.email,
      },
      select: ['id', 'email', 'password'],
    });

    if (!user) {
      throw new HttpException(
        'This email does not exist!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const checkPassword = await bcrypt.compare(authDto.password, user.password);

    if (!checkPassword) {
      throw new HttpException(
        'This password is not correct!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const token = this.jwtService.sign({ id: user.id });
    const decodedToken = this.jwtService.decode(token);
    const tokenExpirationDate = decodedToken['exp'];

    return {
      idToken: token,
      email: user.email,
      expiresIn: tokenExpirationDate.toString(),
    };
  }
}
