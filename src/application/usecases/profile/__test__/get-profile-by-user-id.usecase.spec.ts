import { mock } from 'jest-mock-extended';

import { Profile, ProfileRepository } from '@/domain/profile';

import { GetProfileByUserIdUsecase } from '../get-profile-by-user-id.usecase';

describe('Get Profile Or Null By User Id Usecase', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should orchestrating the get profile by user id action correctly', async () => {
    const now = new Date();
    const expectedProfile = new Profile(
      '1',
      '1',
      now,
      now,
      'My Name',
      'My bio',
      '082299447777',
      'some-photo.jpg',
    );

    const profileRepositoryMock = mock<ProfileRepository>();
    profileRepositoryMock.getByUserId.mockResolvedValue(expectedProfile);

    const getProfileByUserIdUsecase = new GetProfileByUserIdUsecase(
      profileRepositoryMock,
    );
    const profile = await getProfileByUserIdUsecase.execute('1');

    expect(profile).toStrictEqual(expectedProfile);
    expect(profileRepositoryMock.getByUserId).toHaveBeenCalledWith('1');
  });

  it('should orchestrating the get profile by user id action correctly when profile not found', async () => {
    const profileRepositoryMock = mock<ProfileRepository>();
    profileRepositoryMock.getByUserId.mockResolvedValue(null);

    const getProfileByUserIdUsecase = new GetProfileByUserIdUsecase(
      profileRepositoryMock,
    );
    const profile = await getProfileByUserIdUsecase.execute('1');

    expect(profile).toBeNull();
    expect(profileRepositoryMock.getByUserId).toHaveBeenCalledWith('1');
  });
});
