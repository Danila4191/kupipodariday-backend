import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { In, Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  async create(body: CreateWishDto, user: User) {
    await this.wishRepository.save({ ...body, owner: user });
    return {};
  }

  findById(id: number) {
    return this.wishRepository.findOne({
      where: {
        id: id,
      },
      relations: ['owner', 'offers', 'offers.user'],
    });
  }
  async updateRised(id: number, updateData: UpdateWishDto, raised: number) {
    await this.wishRepository.update(id, {
      ...updateData,
      raised: raised,
    });
    return this.findById(id);
  }
  async findFirst() {
    return await this.wishRepository.find({
      take: 20,
      order: { copied: 'desc' },
      relations: ['owner', 'offers.user', 'offers'],
    });
  }
  async findLast() {
    return await this.wishRepository.find({
      take: 40,
      order: { createdAt: 'desc' },
      relations: ['offers', 'owner', 'offers.user'],
    });
  }
  async findArr(idArr: number[]) {
    return this.wishRepository.find({
      where: { id: In(idArr) },
    });
  }
  async update(wishId: number, userId: number, body: UpdateWishDto) {
    const wish = await this.findById(wishId);
    if (wish.owner.id !== userId) {
      throw new ForbiddenException();
    }
    if (wish.raised > 0) {
      throw new ForbiddenException();
    }
    await this.wishRepository.update(wishId, body);
    return wish;
  }
  async delete(id: number, userId: number) {
    const wish = await this.findById(id);
    if (!wish) {
      throw new NotFoundException();
    }
    if (wish.owner.id !== userId) {
      throw new ForbiddenException();
    }
    await this.wishRepository.delete(id);
    return wish;
  }
  async find(options: any) {
    return this.wishRepository.find(options);
  }
  async copy(id: number, user: User) {
    const wish = await this.wishRepository.findOneBy({ id: id });
    if (!wish) {
      throw new NotFoundException();
    }
    delete wish.id;
    await this.wishRepository.update(id, {
      copied: (wish.copied += 1),
    });
    const copyWish = {
      ...wish,
      raised: 0,
      copied: 0,
      offers: [],
      owner: user,
    };
    await this.create(copyWish, user);
    return {};
  }
}
