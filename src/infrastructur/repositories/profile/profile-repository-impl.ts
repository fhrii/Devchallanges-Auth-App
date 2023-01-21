import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Profile as ProfileEntity } from '@prisma/client';

import { Profile, ProfileRepository } from '@/domain/profile';
import { DatabaseService } from '@/infrastructur/database';

@Injectable()
export class ProfileRepositoryImpl implements ProfileRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async getByUserId(id: string) {
    const profileEntity = await this.databaseService.profile.findFirst({
      where: { userId: id },
    });

    if (!profileEntity) return null;

    return ProfileRepositoryImpl.profileEntityToProfileDomain(profileEntity);
  }

  async getByUserIdOrThrow(id: string) {
    try {
      const profileEntity = await this.databaseService.profile.findFirstOrThrow(
        {
          where: { userId: id },
        },
      );
      return ProfileRepositoryImpl.profileEntityToProfileDomain(profileEntity);
    } catch (error) {
      if (error instanceof Prisma.NotFoundError) {
        throw new NotFoundException('Profile not found!');
      }

      throw error;
    }
  }

  async update(
    userId: string,
    name?: string,
    bio?: string,
    phone?: string,
    photo?: string,
  ) {
    const profileEntity = await this.databaseService.profile.update({
      where: { userId },
      data: { name, bio, phone, photo },
    });
    return ProfileRepositoryImpl.profileEntityToProfileDomain(profileEntity);
  }

  static profileEntityToProfileDomain(profile: ProfileEntity): Profile {
    return new Profile(
      profile.id,
      profile.userId,
      profile.createdAt,
      profile.updatedAt,
      profile.name,
      profile.bio,
      profile.phone,
      profile.photo,
    );
  }
}
