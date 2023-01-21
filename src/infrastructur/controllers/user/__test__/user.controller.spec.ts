import { Test } from '@nestjs/testing';
import { Request } from 'express';
import { mock } from 'jest-mock-extended';

import {
  GetProfileByUserIdUsecase,
  UpdateProfileByUserIdUsecase,
  UpdateProfilePhotoByUserIdUsecase,
} from '@/application/usecases/profile';
import { Profile } from '@/domain/profile';
import { User } from '@/domain/user';
import {
  UsecaseProxy,
  UsecaseProxyModule,
} from '@/infrastructur/usecase-proxy';
import { UtilitiesModule } from '@/infrastructur/utilities';

import { ProfilePresenter, UpdateProfileDto } from '../../profile';
import { UserController, UserPresenter } from '..';

describe('User Controller', () => {
  let userController: UserController;
  let getProfileByUserIdUsecaseProxy: UsecaseProxy<GetProfileByUserIdUsecase>;
  let updateProfileByUserIdUsecaseProxy: UsecaseProxy<UpdateProfileByUserIdUsecase>;
  let updateProfilePhotoByUserIdUsecaseProxy: UsecaseProxy<UpdateProfilePhotoByUserIdUsecase>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UsecaseProxyModule, UtilitiesModule],
      controllers: [UserController],
    }).compile();

    userController = moduleRef.get<UserController>(UserController);
    getProfileByUserIdUsecaseProxy = moduleRef.get<
      UsecaseProxy<GetProfileByUserIdUsecase>
    >(UsecaseProxyModule.GetProfileByUserIdUsecaseProxy);
    updateProfileByUserIdUsecaseProxy = moduleRef.get<
      UsecaseProxy<UpdateProfileByUserIdUsecase>
    >(UsecaseProxyModule.UpdateProfileByUserIdUsecaseProxy);
    updateProfilePhotoByUserIdUsecaseProxy = moduleRef.get<
      UsecaseProxy<UpdateProfilePhotoByUserIdUsecase>
    >(UsecaseProxyModule.UpdateProfilePhotoByUserIdUsecaseProxy);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMe', () => {
    it('should get the current user correctly', async () => {
      const now = new Date();
      const expectedUser = new User(
        '1',
        'some-email@gmail.com',
        'some-password',
        'EMAIL',
        now,
        now,
      );

      const expressRequestMock = mock<Request>({
        user: expectedUser,
      });
      const getProfileByUserIdUsecaseMock = mock<GetProfileByUserIdUsecase>();

      jest
        .spyOn(getProfileByUserIdUsecaseMock, 'execute')
        .mockResolvedValue(null);
      jest
        .spyOn(getProfileByUserIdUsecaseProxy, 'getInstance')
        .mockReturnValue(getProfileByUserIdUsecaseMock);

      const user = await userController.getMe(expressRequestMock);

      expect(user.id).toBe('1');
      expect(user.email).toBe('some-email@gmail.com');
      expect(user.password).toBe('some-password');
      expect(user.provider).toBe('EMAIL');
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
      expect(user).toBeInstanceOf(UserPresenter);
    });

    it('should get the current user with profile correctly', async () => {
      const now = new Date();
      const expectedProfile = new Profile(
        '1',
        '1',
        now,
        now,
        'Some name',
        'Some bio',
        '081111111111',
        'profile-photo.jpg',
      );
      const expectedUser = new User(
        '1',
        'some-email@gmail.com',
        'some-password',
        'EMAIL',
        now,
        now,
      );

      const expressRequestMock = mock<Request>({
        user: expectedUser,
      });
      const getProfileByUserIdUsecaseMock = mock<GetProfileByUserIdUsecase>();

      jest
        .spyOn(getProfileByUserIdUsecaseMock, 'execute')
        .mockResolvedValue(expectedProfile);
      jest
        .spyOn(getProfileByUserIdUsecaseProxy, 'getInstance')
        .mockReturnValue(getProfileByUserIdUsecaseMock);

      const user = await userController.getMe(expressRequestMock);

      expect(user.id).toBe('1');
      expect(user.email).toBe('some-email@gmail.com');
      expect(user.password).toBe('some-password');
      expect(user.provider).toBe('EMAIL');
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
      expect(user.profile.id).toBe('1');
      expect(user.profile.userId).toBe('1');
      expect(user.profile.name).toBe('Some name');
      expect(user.profile.bio).toBe('Some bio');
      expect(user.profile.phone).toBe('081111111111');
      expect(user.profile.photo).toBe('profile-photo.jpg');
      expect(user.profile.createdAt).toBeDefined();
      expect(user.profile.updatedAt).toBeDefined();
      expect(user).toBeInstanceOf(UserPresenter);
      expect(user.profile).toBeInstanceOf(ProfilePresenter);
    });
  });

  describe('putProfile', () => {
    it("should update or create the user's profile and return user with profile correctly", async () => {
      const now = new Date();
      const expectedProfile = new Profile(
        '1',
        '1',
        now,
        now,
        'Some name',
        'Some bio',
        '081111111111',
        'profile-photo.jpg',
      );
      const expectedUser = new User(
        '1',
        'some-email@gmail.com',
        'some-password',
        'EMAIL',
        now,
        now,
        expectedProfile,
      );

      const expressRequestMock = mock<Request>({
        user: expectedUser,
      });
      const updateProfileByUserIdUsecaseMock =
        mock<UpdateProfileByUserIdUsecase>();

      jest
        .spyOn(updateProfileByUserIdUsecaseProxy, 'getInstance')
        .mockReturnValue(updateProfileByUserIdUsecaseMock);
      updateProfileByUserIdUsecaseMock.execute.mockResolvedValue(
        expectedProfile,
      );

      const updateProfileDto: UpdateProfileDto = {
        name: 'naruto',
        bio: 'alt bio',
        phone: '081111111111',
      };

      const user = await userController.putMe(
        expressRequestMock,
        updateProfileDto,
      );

      expect(user.id).toBe('1');
      expect(user.email).toBe('some-email@gmail.com');
      expect(user.password).toBe('some-password');
      expect(user.provider).toBe('EMAIL');
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
      expect(user.profile.id).toBe('1');
      expect(user.profile.userId).toBe('1');
      expect(user.profile.name).toBe('Some name');
      expect(user.profile.bio).toBe('Some bio');
      expect(user.profile.phone).toBe('081111111111');
      expect(user.profile.photo).toBe('profile-photo.jpg');
      expect(user.profile.createdAt).toBeDefined();
      expect(user.profile.updatedAt).toBeDefined();
      expect(user).toBeInstanceOf(UserPresenter);
      expect(user.profile).toBeInstanceOf(ProfilePresenter);
      expect(updateProfileByUserIdUsecaseMock.execute).toHaveBeenCalledWith(
        '1',
        'naruto',
        'alt bio',
        '081111111111',
      );
    });
  });

  describe('putMeImage', () => {
    it('should update the profile photo correcly', async () => {
      const now = new Date();
      const expectedProfile = new Profile(
        '1',
        '1',
        now,
        now,
        'Some name',
        'Some bio',
        '081111111111',
        'profile-photo.jpg',
      );
      const expectedUser = new User(
        '1',
        'some-email@gmail.com',
        'some-password',
        'EMAIL',
        now,
        now,
        expectedProfile,
      );

      const expressRequestMock = mock<Request>({
        user: expectedUser,
      });
      const updateProfilePhotoByUserIdUsecaseMock =
        mock<UpdateProfilePhotoByUserIdUsecase>();

      jest
        .spyOn(updateProfilePhotoByUserIdUsecaseProxy, 'getInstance')
        .mockReturnValue(updateProfilePhotoByUserIdUsecaseMock);
      updateProfilePhotoByUserIdUsecaseMock.execute.mockResolvedValue(
        expectedProfile,
      );

      const photoFile = {
        buffer: Buffer.from([1]),
        mimetype: 'image/jpeg',
      } as Express.Multer.File;

      const user = await userController.putMeImage(
        expressRequestMock,
        photoFile,
      );

      expect(user.id).toBe('1');
      expect(user.email).toBe('some-email@gmail.com');
      expect(user.password).toBe('some-password');
      expect(user.provider).toBe('EMAIL');
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
      expect(user.profile.id).toBe('1');
      expect(user.profile.userId).toBe('1');
      expect(user.profile.name).toBe('Some name');
      expect(user.profile.bio).toBe('Some bio');
      expect(user.profile.phone).toBe('081111111111');
      expect(user.profile.photo).toBe('profile-photo.jpg');
      expect(user.profile.createdAt).toBeDefined();
      expect(user.profile.updatedAt).toBeDefined();
      expect(user).toBeInstanceOf(UserPresenter);
      expect(user.profile).toBeInstanceOf(ProfilePresenter);
      expect(
        updateProfilePhotoByUserIdUsecaseMock.execute,
      ).toHaveBeenCalledWith('1', Buffer.from([1]), 'image/jpeg');
    });
  });
});
