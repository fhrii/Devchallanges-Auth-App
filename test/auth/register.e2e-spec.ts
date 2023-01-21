import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AuthPresenter } from '@/infrastructur/controllers/auth';
import { DatabaseService } from '@/infrastructur/database';
import { AppResponse } from '@/infrastructur/http';

import { createTestingAppModuleE2E } from '../createTestingAppModuleE2E';

describe('auth/register', () => {
  let app: INestApplication;
  let databaseService: DatabaseService;
  let requestApp: request.SuperTest<request.Test>;

  beforeAll(async () => {
    app = await createTestingAppModuleE2E();
    databaseService = app.get<DatabaseService>(DatabaseService);
    requestApp = request(app.getHttpServer());

    await app.init();
  });

  afterEach(async () => {
    const deleteProfiles = databaseService.profile.deleteMany();
    const deleteUsers = databaseService.user.deleteMany();

    await databaseService.$transaction([deleteProfiles, deleteUsers]);
  });

  afterAll(async () => {
    await databaseService.$disconnect();
    await app.close();
  });

  it('should register correctly', async () => {
    const response = await requestApp
      .post('/auth/register')
      .send({ email: 'some.email@gmail.com', password: 'somePassword' });
    const responseBody: AppResponse<AuthPresenter> = response.body;
    const responseHeaders: Record<string, any> = response.headers;

    expect(response.statusCode).toBe(201);
    expect(responseBody.statusCode).toBe(201);
    expect(responseBody.data.accessToken).toBeDefined();
    expect(responseBody.data.refreshToken).toBeUndefined();
    expect(responseBody.message).toBeUndefined();

    const responseSetCookie: string[] = responseHeaders['set-cookie'];
    const responseSetCookieRefreshToken = responseSetCookie.filter((cookie) =>
      cookie.includes(process.env.REFRESH_TOKEN_COOKIE),
    );

    expect(responseSetCookieRefreshToken).toHaveLength(1);
  });

  it('should not register when the email is not meet the email format', async () => {
    const response = await requestApp
      .post('/auth/register')
      .send({ email: 'some.email', password: 'somePassword' });
    const responseBody: AppResponse<AuthPresenter> = response.body;
    const responseHeaders: Record<string, any> = response.headers;

    expect(response.statusCode).toBe(400);
    expect(responseBody.statusCode).toBe(400);
    expect(responseBody.data).toBeUndefined();
    expect(responseBody.message).toBe('email must be an email');
    expect(responseHeaders['set-cookie']).toBeUndefined();
  });
});
