import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(body: CreateUserDto) {
    const { username } = body;
    const { password, ...res } = body;
    const user = await this.getUserByName(username);
    if (user) {
      throw 'Пользователь с таким email или username уже зарегистрирован';
    }
    const NewPassword = await bcrypt.hash(password, 10);
    return this.userRepository.save({ password: NewPassword, ...res });
  }
  getUserByName(username: string) {
    return this.userRepository.findOneBy({ username });
  }
  async updateUser(id: number, newData: UpdateUserDto) {
    const user = await this.getById(id);
    const { password } = newData;
    const NewPassword = await bcrypt.hash(password, 10);
    const newDataUser: User = {
      ...user,
      password: NewPassword,
      username: newData?.username,
      email: newData?.email,
      about: newData?.about,
      avatar: newData?.avatar,
    };
    await this.userRepository.update(user.id, newDataUser);
    return await this.getById(id);
  }
  async getById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }
  async find(name: string) {
    return await this.userRepository.find({
      where: [{ username: Like(`${name}%`) }],
    });
  }
  async getUserWishes(username: any) {
    const user = await this.userRepository.findOne({
      where: {
        username: username,
      },
      relations: {
        wishes: true,
      },
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user.wishes;
  }
}
