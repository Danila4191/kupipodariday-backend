import { Min, IsUrl, IsNotEmpty, Length } from 'class-validator';
export class CreateWishDto {
  @IsNotEmpty()
  @Length(1, 250)
  name: string;
  @IsNotEmpty()
  @IsUrl()
  link: string;
  @IsNotEmpty()
  @IsUrl()
  image: string;
  @Min(1)
  @IsNotEmpty()
  price: number;
  description: string;
  raised?: number;
}
