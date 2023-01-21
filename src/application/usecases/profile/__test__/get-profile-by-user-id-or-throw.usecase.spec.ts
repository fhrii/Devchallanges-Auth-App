import { mock } from 'jest-mock-extended';

import { Profile, ProfileRepository } from '@/domain/profile';

import { GetProfileByUserIdOrThrowUsecase } from '../get-profile-by-user-id-or-throw.usecase';

describe('Get Profile By User Id Usecase', () => {
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
    profileRepositoryMock.getByUserIdOrThrow.mockResolvedValue(expectedProfile);

    const getProfileByUserIdOrThrowUsecase =
      new GetProfileByUserIdOrThrowUsecase(profileRepositoryMock);
    const profile = await getProfileByUserIdOrThrowUsecase.execute('1');

    expect(profile).toStrictEqual(expectedProfile);
    expect(profileRepositoryMock.getByUserIdOrThrow).toHaveBeenCalledWith('1');
  });
});
