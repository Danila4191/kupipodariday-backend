import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JWT } from 'src/utils/const';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  auth(user: User) {
    const payload = { sub: user.id };
    const options = `${JWT}`;
    return { access_token: this.jwtService.sign(payload, { secret: options }) };
  }
  async validate(username: string, password: string) {
    const user = await this.usersService.getUserByNameAuth(
      { username: username },
      { password: true },
    );
    if (!user) {
      throw new NotFoundException();
    }
    const isValidPassword: boolean = await bcrypt.compare(
      password,
      user.password,
    );
    if (!isValidPassword) {
      return null;
    }
    const userData = await this.usersService.getUserByName(username);
    console.log(userData);
    return userData;
  }
}
