import { IsNotEmpty, Length, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @Length(2, 64)
  @IsNotEmpty()
  username: string;
  @Length(0, 200)
  @IsOptional()
  about: string;
  @IsOptional()
  avatar: string;
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}
