import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AuthPresenter } from '@/infrastructur/controllers/auth';
import { DatabaseService } from '@/infrastructur/database';
import { AppResponse } from '@/infrastructur/http';

import { createTestingAppModuleE2E } from '../createTestingAppModuleE2E';

describe('auth/refresh-token', () => {
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

  it('should get the new access token correctly', async () => {
    await requestApp
      .post('/auth/register')
      .send({ email: 'some.email@gmail.com', password: 'somePassword' });

    const responseLogin = await requestApp
      .post('/auth/login')
      .send({ email: 'some.email@gmail.com', password: 'somePassword' });

    const responseHeaders: Record<string, any> = responseLogin.headers;
    const response = await requestApp
      .post('/auth/refresh-token')
      .set('Cookie', responseHeaders['set-cookie'] as string[]);

    const responseBody: AppResponse<AuthPresenter> = response.body;

    expect(response.statusCode).toBe(201);
    expect(responseBody.statusCode).toBe(201);
    expect(responseBody.data.accessToken).toBeDefined();
    expect(responseBody.data.refreshToken).toBeUndefined();
    expect(responseBody.message).toBeUndefined();
  });

  it('should not login when the user not registered', async () => {
    const response = await requestApp
      .post('/auth/login')
      .send({ email: 'some.email@gmail.com', password: 'somePassword' });
    const responseBody: AppResponse<AuthPresenter> = response.body;
    const responseHeaders: Record<string, any> = response.headers;

    expect(response.statusCode).toBe(401);
    expect(responseBody.statusCode).toBe(401);
    expect(responseBody.data).toBeUndefined();
    expect(responseBody.message).toBe('Email or password is wrong!');
    expect(responseHeaders['set-cookie']).toBeUndefined();
  });

  it('should not login when the user password is wrong', async () => {
    await requestApp
      .post('/auth/register')
      .send({ email: 'some.email@gmail.com', password: 'somePassword' });

    const response = await requestApp
      .post('/auth/login')
      .send({ email: 'some.email@gmail.com', password: 'somePasswordAlt' });
    const responseBody: AppResponse<AuthPresenter> = response.body;
    const responseHeaders: Record<string, any> = response.headers;

    expect(response.statusCode).toBe(401);
    expect(responseBody.statusCode).toBe(401);
    expect(responseBody.data).toBeUndefined();
    expect(responseBody.message).toBe('Email or password is wrong!');
    expect(responseHeaders['set-cookie']).toBeUndefined();
  });
});
