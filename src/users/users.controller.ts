import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Req,
  Param,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from 'src/guards/guards';
import { User } from './entities/user.entity';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('/me')
  async getUser(@Req() { user }: { user: User }) {
    const data = await this.usersService.getById(user.id);
    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }
  @Patch('/me')
  async updateUser(@Body() body: UpdateUserDto, @Req() { user }) {
    return await this.usersService.updateUser(user.id, body, body.password);
  }
  @Get('/me/wishes')
  async getMyUserWishes(@Req() { user }: { user: User }) {
    return await this.usersService.getUserWishes(user.username);
  }
  @Get('/:username/wishes')
  async getUserWishes(@Param('username') username: string) {
    return await this.usersService.getUserWishes(username);
  }
  @Post('/find')
  async findMany(@Body() body: { query: string }) {
    const user = await this.usersService.find(body.query);
    if (!user) {
      return new NotFoundException();
    }
    return user;
  }
  @Get('/:username')
  async getUserName(@Param('username') username: string) {
    const user = await this.usersService.getUserByName(username);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }
}
