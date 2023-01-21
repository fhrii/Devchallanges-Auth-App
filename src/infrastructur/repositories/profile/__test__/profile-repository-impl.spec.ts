import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Prisma, Profile as ProfileEntity } from '@prisma/client';

import { Profile } from '@/domain/profile';
import { DatabaseService } from '@/infrastructur/database';

import { ProfileRepositoryImpl } from '../profile-repository-impl';

describe('Profile Repository Implementation', () => {
  let databaseService: DatabaseService;
  let profileRepositoryImpl: ProfileRepositoryImpl;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [DatabaseService, ProfileRepositoryImpl],
    }).compile();

    databaseService = await moduleRef.resolve(DatabaseService);
    profileRepositoryImpl = moduleRef.get<ProfileRepositoryImpl>(
      ProfileRepositoryImpl,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Get Profile By User Id Action', () => {
    it('should get the profile by user id correctly', async () => {
      const now = new Date();
      const profileEntity: ProfileEntity = {
        id: '1',
        userId: '1',
        name: 'some name',
        bio: 'some bio',
        photo: 'profile-photo.jpg',
        phone: '081111111111',
        createdAt: now,
        updatedAt: now,
      };
      const expectedProfile = new Profile(
        '1',
        '1',
        now,
        now,
        'some name',
        'some bio',
        '081111111111',
        'profile-photo.jpg',
      );

      const profileEntityToProfileDomainSpy = jest.spyOn(
        ProfileRepositoryImpl,
        'profileEntityToProfileDomain',
      );
      jest
        .spyOn(databaseService.profile, 'findFirst')
        .mockResolvedValue(profileEntity);

      const profile = await profileRepositoryImpl.getByUserId('1');

      expect(profile).toStrictEqual(expectedProfile);
      expect(databaseService.profile.findFirst).toHaveBeenCalledWith({
        where: { userId: '1' },
      });
      expect(profileEntityToProfileDomainSpy).toHaveBeenCalledWith(
        profileEntity,
      );
    });

    it('should return null when profile not found', async () => {
      const profileEntityToProfileDomainSpy = jest.spyOn(
        ProfileRepositoryImpl,
        'profileEntityToProfileDomain',
      );
      jest.spyOn(databaseService.profile, 'findFirst').mockResolvedValue(null);

      const profile = await profileRepositoryImpl.getByUserId('1');

      expect(profile).toBeNull();
      expect(databaseService.profile.findFirst).toHaveBeenCalledWith({
        where: { userId: '1' },
      });
      expect(profileEntityToProfileDomainSpy).not.toHaveBeenCalled();
    });
  });

  describe('Get Profile By User Id Or Throw Action', () => {
    it('should get the profile by user id correctly', async () => {
      const now = new Date();
      const profileEntity: ProfileEntity = {
        id: '1',
        userId: '1',
        name: 'some name',
        bio: 'some bio',
        photo: 'profile-photo.jpg',
        phone: '081111111111',
        createdAt: now,
        updatedAt: now,
      };
      const expectedProfile = new Profile(
        '1',
        '1',
        now,
        now,
        'some name',
        'some bio',
        '081111111111',
        'profile-photo.jpg',
      );

      const profileEntityToProfileDomainSpy = jest.spyOn(
        ProfileRepositoryImpl,
        'profileEntityToProfileDomain',
      );
      jest
        .spyOn(databaseService.profile, 'findFirstOrThrow')
        .mockResolvedValue(profileEntity);

      const profile = await profileRepositoryImpl.getByUserIdOrThrow('1');

      expect(profile).toStrictEqual(expectedProfile);
      expect(databaseService.profile.findFirstOrThrow).toHaveBeenCalledWith({
        where: { userId: '1' },
      });
      expect(profileEntityToProfileDomainSpy).toHaveBeenCalledWith(
        profileEntity,
      );
    });

    it('should throw error NotFoundException when profile not found', async () => {
      jest
        .spyOn(databaseService.profile, 'findFirstOrThrow')
        .mockRejectedValue(new Prisma.NotFoundError('Profile not found!'));

      await expect(
        profileRepositoryImpl.getByUserIdOrThrow('1'),
      ).rejects.toStrictEqual(new NotFoundException('Profile not found!'));
      expect(databaseService.profile.findFirstOrThrow).toHaveBeenCalledWith({
        where: { userId: '1' },
      });
    });

    it('should throw and forward the error when the error is not instance of Prisma.NotFoundError', async () => {
      jest
        .spyOn(databaseService.profile, 'findFirstOrThrow')
        .mockRejectedValue(new Error('Something happened!'));

      await expect(
        profileRepositoryImpl.getByUserIdOrThrow('1'),
      ).rejects.toStrictEqual(new Error('Something happened!'));
      expect(databaseService.profile.findFirstOrThrow).toHaveBeenCalledWith({
        where: { userId: '1' },
      });
    });
  });

  describe('Update Profile Action', () => {
    it('should update the profile correctly', async () => {
      const now = new Date();
      const profileEntity: ProfileEntity = {
        id: '1',
        userId: '1',
        name: 'some name',
        bio: 'some bio',
        phone: '081111111111',
        photo: 'profile-photo.jpg',
        createdAt: now,
        updatedAt: now,
      };
      const expectedProfile = new Profile(
        '1',
        '1',
        now,
        now,
        'some name',
        'some bio',
        '081111111111',
        'profile-photo.jpg',
      );

      const profileEntityToProfileDomainSpy = jest.spyOn(
        ProfileRepositoryImpl,
        'profileEntityToProfileDomain',
      );
      jest
        .spyOn(databaseService.profile, 'update')
        .mockResolvedValue(profileEntity);

      const profile = await profileRepositoryImpl.update(
        '1',
        'some name',
        'some bio',
        '081111111111',
      );

      expect(profile).toStrictEqual(expectedProfile);
      expect(databaseService.profile.update).toHaveBeenCalledWith({
        where: {
          userId: '1',
        },
        data: {
          name: 'some name',
          bio: 'some bio',
          phone: '081111111111',
        },
      });
      expect(profileEntityToProfileDomainSpy).toHaveBeenCalledWith(
        profileEntity,
      );
    });
  });
});
