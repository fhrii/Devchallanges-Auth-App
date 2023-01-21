import { mock } from 'jest-mock-extended';

import { Profile, ProfileRepository } from '@/domain/profile';

import { UpdateProfileByUserIdUsecase } from '../update-profile-by-user-id.usecase';

describe('Update Profile Usecase', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should orchestrating the update profile action correctly', async () => {
    const now = new Date();
    const expectedProfile = new Profile(
      '1',
      '1',
      now,
      now,
      'My Name',
      'My Bio',
      '082299447777',
      'some-photo.jpg',
    );

    const profileRepositoryMock = mock<ProfileRepository>();
    profileRepositoryMock.update.mockResolvedValue(expectedProfile);

    const updateProfileByUserIdUsecase = new UpdateProfileByUserIdUsecase(
      profileRepositoryMock,
    );
    const profile = await updateProfileByUserIdUsecase.execute(
      '1',
      'My Name',
      'My Bio',
      '082299447777',
      'some-photo.jpg',
    );

    expect(profile).toStrictEqual(expectedProfile);
    expect(profileRepositoryMock.update).toHaveBeenCalledWith(
      '1',
      'My Name',
      'My Bio',
      '082299447777',
      'some-photo.jpg',
    );
  });
});
