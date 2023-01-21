import { IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly bio: string;

  @IsString()
  readonly phone: string;
}
