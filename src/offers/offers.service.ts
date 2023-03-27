import { Injectable } from '@nestjs/common';
import { BadRequestException, NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}
  async create(body: CreateOfferDto, user: User) {
    const wish = await this.wishesService.findById(body.itemId);
    if (!wish) {
      throw new NotFoundException();
    }
    const { name, description, image, price } = wish;
    const sum = wish.raised + body.amount;
    sum.toFixed(2);
    const newWish = await this.wishesService.updateRised(
      body.itemId,
      {
        name,
        description,
        image,
        price,
      },
      sum,
    );
    if (wish.owner.id === user.id) {
      throw new BadRequestException('Это ваш подарок');
    }
    if (sum > wish.price) {
      throw new BadRequestException('Слишком много');
    }
    return await this.offersRepository.save({
      ...body,
      user: user,
      item: newWish,
    });
  }
  async findAll() {
    return await this.offersRepository.find({
      relations: ['item', 'user'],
    });
  }
}
