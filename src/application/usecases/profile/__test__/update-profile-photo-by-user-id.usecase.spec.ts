import { mock } from 'jest-mock-extended';

import { FileManager, Random } from '@/application/utilities';
import { Profile } from '@/domain/profile';
import { UsecaseProxy } from '@/infrastructur/usecase-proxy';

import { UpdateProfileByUserIdUsecase } from '../update-profile-by-user-id.usecase';
import { UpdateProfilePhotoByUserIdUsecase } from '../update-profile-photo-by-user-id.usecase';

describe('Update Profile Photo Usecase', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should orchestrating the update profile photo action when mime is image/jpeg correctly', async () => {
    const now = new Date();
    const expectedProfile = new Profile(
      '1',
      '1',
      now,
      now,
      'My Name',
      'My Bio',
      '082299447777',
      'random-name.jpg',
    );

    const fileManagerMock = mock<FileManager>();
    const randomMock = mock<Random>();
    const updateProfileByUserIdUsecaseMock =
      mock<UpdateProfileByUserIdUsecase>();
    const updateProfileByUserIdUsecaseProxyMock =
      mock<UsecaseProxy<UpdateProfileByUserIdUsecase>>();

    fileManagerMock.writeFile.mockResolvedValue();
    randomMock.generateString.mockResolvedValue('random-name');
    updateProfileByUserIdUsecaseMock.execute.mockResolvedValue(expectedProfile);
    updateProfileByUserIdUsecaseProxyMock.getInstance.mockReturnValue(
      updateProfileByUserIdUsecaseMock,
    );

    const updateProfilePhotoByUserIdUsecase =
      new UpdateProfilePhotoByUserIdUsecase(
        fileManagerMock,
        randomMock,
        updateProfileByUserIdUsecaseProxyMock,
      );

    const profile = await updateProfilePhotoByUserIdUsecase.execute(
      '1',
      Buffer.from([1]),
      'image/jpeg',
    );

    expect(profile).toStrictEqual(expectedProfile);
    expect(fileManagerMock.writeFile).toHaveBeenCalledWith(
      './images/random-name.jpg',
      Buffer.from([1]),
    );
    expect(randomMock.generateString).toHaveBeenCalled();
    expect(
      updateProfileByUserIdUsecaseProxyMock.getInstance,
    ).toHaveBeenCalled();
    expect(updateProfileByUserIdUsecaseMock.execute).toHaveBeenCalledWith(
      '1',
      null,
      null,
      null,
      'random-name.jpg',
    );
  });

  it('should orchestrating the update profile photo action when mime is image/png correctly', async () => {
    const now = new Date();
    const expectedProfile = new Profile(
      '1',
      '1',
      now,
      now,
      'My Name',
      'My Bio',
      '082299447777',
      'random-name.png',
    );

    const fileManagerMock = mock<FileManager>();
    const randomMock = mock<Random>();
    const updateProfileByUserIdUsecaseMock =
      mock<UpdateProfileByUserIdUsecase>();
    const updateProfileByUserIdUsecaseProxyMock =
      mock<UsecaseProxy<UpdateProfileByUserIdUsecase>>();

    fileManagerMock.writeFile.mockResolvedValue();
    randomMock.generateString.mockResolvedValue('random-name');
    updateProfileByUserIdUsecaseMock.execute.mockResolvedValue(expectedProfile);
    updateProfileByUserIdUsecaseProxyMock.getInstance.mockReturnValue(
      updateProfileByUserIdUsecaseMock,
    );

    const updateProfilePhotoByUserIdUsecase =
      new UpdateProfilePhotoByUserIdUsecase(
        fileManagerMock,
        randomMock,
        updateProfileByUserIdUsecaseProxyMock,
      );

    const profile = await updateProfilePhotoByUserIdUsecase.execute(
      '1',
      Buffer.from([1]),
      'image/png',
    );

    expect(profile).toStrictEqual(expectedProfile);
    expect(fileManagerMock.writeFile).toHaveBeenCalledWith(
      './images/random-name.png',
      Buffer.from([1]),
    );
    expect(randomMock.generateString).toHaveBeenCalled();
    expect(
      updateProfileByUserIdUsecaseProxyMock.getInstance,
    ).toHaveBeenCalled();
    expect(updateProfileByUserIdUsecaseMock.execute).toHaveBeenCalledWith(
      '1',
      null,
      null,
      null,
      'random-name.png',
    );
  });

  it('should throw error when mime is not supported', async () => {
    const fileManagerMock = mock<FileManager>();
    const randomMock = mock<Random>();
    const updateProfileByUserIdUsecaseProxyMock =
      mock<UsecaseProxy<UpdateProfileByUserIdUsecase>>();

    const updateProfilePhotoByUserIdUsecase =
      new UpdateProfilePhotoByUserIdUsecase(
        fileManagerMock,
        randomMock,
        updateProfileByUserIdUsecaseProxyMock,
      );

    await expect(
      updateProfilePhotoByUserIdUsecase.execute(
        '1',
        Buffer.from([1]),
        'application/json',
      ),
    ).rejects.toThrow('Image type is not supported');
  });
});
