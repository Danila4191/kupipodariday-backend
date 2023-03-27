import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PassportStrategy } from '@nestjs/passport';
import { JWT } from 'src/utils/const';

@Injectable()
export class Jwt extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: `${JWT}`,
    });
  }
  async validate(payload: { sub: number }) {
    const user = this.usersService.getById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
