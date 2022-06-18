import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from './decorator/get-user.decorator';
import { RequestAuthDto } from './dto/request/request-auth.dto';
import { ResponseAuthDto } from './dto/response/response-auth.dto';
import { User } from './entity/user.entity';
import { JwtAuthGuard } from './guard/jwt.guard';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  signUp(@Body() authDto: RequestAuthDto): Promise<ResponseAuthDto> {
    return this.usersService.signUp(authDto);
  }

  @Post('/signin')
  signIn(@Body() authDto: RequestAuthDto): Promise<ResponseAuthDto> {
    return this.usersService.signIn(authDto);
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  getMe(@GetUser() user: User) {
    return this.usersService.getMe(user);
  }

  @Get('/myinfo')
  @UseGuards(JwtAuthGuard)
  getMyInfo(@GetUser() user: User) {
    return this.usersService.getMyInfo(user);
  }

  @Get('/admin/user')
  @UseGuards(JwtAuthGuard)
  findAllUsers(@GetUser() user: User) {
    return this.usersService.findAllUsers(user);
  }

  @Put('/admin/:userId')
  @UseGuards(JwtAuthGuard)
  updateUserInfo(
    @Param() param: { userId: string },
    @GetUser() user: User,
    @Body()
    updateUserInfoDto: {
      email: string | null;
      password: string | null;
    },
  ) {
    return this.usersService.updateUserInfo(param, user, updateUserInfoDto);
  }

  @Delete('/admin/:userId')
  @UseGuards(JwtAuthGuard)
  deleteUser(@Param() param: { userId: string }, @GetUser() user: User) {
    return this.usersService.deleteUser(param, user);
  }
}
