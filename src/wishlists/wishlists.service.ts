import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { Repository, In } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    private readonly wishService: WishesService,
    @InjectRepository(Wishlist)
    private wishelistsRepository: Repository<Wishlist>,
  ) {}
  async create(body: CreateWishlistDto, user: User) {
    const wishArr = await this.wishService.find({
      where: { id: In(body.itemsId) },
    });
    const wishList = await this.wishelistsRepository.create({
      ...body,
      owner: user,
      items: wishArr,
    });
    return await this.wishelistsRepository.save(wishList);
  }
  findAll() {
    return this.wishelistsRepository.find({
      relations: {
        owner: true,
      },
    });
  }
  async findId(id: number) {
    const wishlist = await this.wishelistsRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });
    return wishlist;
  }
  async delete(id: number, userId: number) {
    const wishlist = await this.findId(id);
    if (wishlist.owner.id !== userId) {
      throw new BadRequestException('Удалять можно только ваши карточки');
    }
    await this.wishelistsRepository.delete(id);
    return wishlist;
  }
}
