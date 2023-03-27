import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Delete,
  Req,
  Body,
  Patch,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { JwtGuard } from 'src/guards/guards';
import { User } from 'src/users/entities/user.entity';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}
  @Get()
  getAll() {
    return this.wishlistsService.findAll();
  }
  @Post()
  async create(
    @Body() body: CreateWishlistDto,
    @Req() { user }: { user: User },
  ) {
    return this.wishlistsService.create(body, user);
  }
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.wishlistsService.findId(+id);
  }
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() { user }: { user: User }) {
    return await this.wishlistsService.delete(+id, user.id);
  }
  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() { user }: { user: User },
  ) {
    return this.wishlistsService.update(+id, user.id, updateWishlistDto);
  }
}
