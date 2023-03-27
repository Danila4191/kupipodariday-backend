import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  Req,
  Body,
  Patch,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from 'src/guards/guards';
import { User } from 'src/users/entities/user.entity';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishService: WishesService) {}
  @UseGuards(JwtGuard)
  @Post()
  async create(@Req() { user }: { user: User }, @Body() body: CreateWishDto) {
    return await this.wishService.create(body, user);
  }
  @Get('/last')
  async findLast() {
    return await this.wishService.findLast();
  }
  @Get('/top')
  async findFirst() {
    return await this.wishService.findFirst();
  }
  @UseGuards(JwtGuard)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.wishService.findById(+id);
  }
  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Req() { user }: { user: User },
    @Param('id') id: string,
    @Body() body: UpdateWishDto,
  ) {
    return await this.wishService.update(+id, user.id, body);
  }
  @UseGuards(JwtGuard)
  @Delete(':id')
  async delete(@Req() { user }: { user: User }, @Param('id') id: string) {
    return await this.wishService.delete(+id, user.id);
  }
  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copy(@Req() { user }: { user: User }, @Param('id') id: string) {
    return await this.wishService.copy(+id, user);
  }
}
