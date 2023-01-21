import { mock } from 'jest-mock-extended';
import * as uuid from 'uuid';

import { RandomImpl } from '../random-impl';

describe('Random String Implementation', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Generate random string action', () => {
    it('should generate the string correctly', async () => {
      const expectedRandomString = 'someRandomString';

      const uuidMock = mock<typeof uuid>();
      uuidMock.v4.mockReturnValue(expectedRandomString);

      const random = new RandomImpl(uuidMock.v4);
      const string = await random.generateString();

      expect(string).toBe(expectedRandomString);
    });
  });
});
