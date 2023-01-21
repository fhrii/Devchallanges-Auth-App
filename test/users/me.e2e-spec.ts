import * as path from 'node:path';

import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { FileManager } from '@/application/utilities';
import { AuthPresenter } from '@/infrastructur/controllers/auth';
import { UserPresenter } from '@/infrastructur/controllers/user';
import { DatabaseService } from '@/infrastructur/database';
import { AppResponse } from '@/infrastructur/http';

import { createTestingAppModuleE2E } from '../createTestingAppModuleE2E';

describe('users/me', () => {
  let app: INestApplication;
  let databaseService: DatabaseService;
  let fileManager: FileManager;
  let requestApp: request.SuperTest<request.Test>;

  beforeAll(async () => {
    app = await createTestingAppModuleE2E();
    databaseService = app.get<DatabaseService>(DatabaseService);
    fileManager = app.get<FileManager>(FileManager);
    requestApp = request(app.getHttpServer());

    await app.init();
  });

  afterEach(async () => {
    const deleteProfiles = databaseService.profile.deleteMany();
    const deleteUsers = databaseService.user.deleteMany();

    await databaseService.$transaction([deleteProfiles, deleteUsers]);
  });

  afterAll(async () => {
    await fileManager.emptyDir('./images');
    await databaseService.$disconnect();
    await app.close();
  });

  describe('Get Method', () => {
    it('should get current user correctly', async () => {
      await requestApp
        .post('/auth/register')
        .send({ email: 'some.email@gmail.com', password: 'somePassword' });

      const responseLogin = await requestApp
        .post('/auth/login')
        .send({ email: 'some.email@gmail.com', password: 'somePassword' });
      const responseLoginBody: AppResponse<AuthPresenter> = responseLogin.body;
      const response = await requestApp
        .get('/users/me')
        .set('Authorization', `Bearer ${responseLoginBody.data.accessToken}`);

      const responseBody: AppResponse<UserPresenter> = response.body;

      expect(response.statusCode).toBe(200);
      expect(responseBody.statusCode).toBe(200);
      expect(responseBody.message).toBeUndefined();
      expect(responseBody.data.id).toBeDefined();
      expect(responseBody.data.email).toBeDefined();
      expect(responseBody.data.createdAt).toBeDefined();
      expect(responseBody.data.updatedAt).toBeDefined();
      expect(responseBody.data.profile.createdAt).toBeDefined();
      expect(responseBody.data.profile.updatedAt).toBeDefined();
      expect(responseBody.data.profile.name).toBeUndefined();
      expect(responseBody.data.profile.bio).toBeUndefined();
      expect(responseBody.data.profile.phone).toBeUndefined();
      expect(responseBody.data.profile.photo).toBeUndefined();
      expect(responseBody.data.password).toBeUndefined();
      expect(responseBody.data.provider).toBeUndefined();
    });

    it('should get current user with profile correctly', async () => {
      await requestApp
        .post('/auth/register')
        .send({ email: 'some.email@gmail.com', password: 'somePassword' });

      const user = await databaseService.user.findFirstOrThrow({
        where: { email: 'some.email@gmail.com' },
      });

      await databaseService.profile.update({
        where: { userId: user.id },
        data: {
          name: 'John Doe',
          bio: "Hello, it's John Doe",
          phone: '081111111111',
          photo: 'john-doe.png',
        },
      });

      const responseLogin = await requestApp
        .post('/auth/login')
        .send({ email: 'some.email@gmail.com', password: 'somePassword' });
      const responseLoginBody: AppResponse<AuthPresenter> = responseLogin.body;
      const response = await requestApp
        .get('/users/me')
        .set('Authorization', `Bearer ${responseLoginBody.data.accessToken}`);

      const responseBody: AppResponse<UserPresenter> = response.body;

      expect(response.statusCode).toBe(200);
      expect(responseBody.statusCode).toBe(200);
      expect(responseBody.message).toBeUndefined();
      expect(responseBody.data.id).toBeDefined();
      expect(responseBody.data.email).toBeDefined();
      expect(responseBody.data.createdAt).toBeDefined();
      expect(responseBody.data.updatedAt).toBeDefined();
      expect(responseBody.data.password).toBeUndefined();
      expect(responseBody.data.provider).toBeUndefined();
      expect(responseBody.data.profile.id).toBeDefined();
      expect(responseBody.data.profile.name).toBeDefined();
      expect(responseBody.data.profile.bio).toBeDefined();
      expect(responseBody.data.profile.phone).toBeDefined();
      expect(responseBody.data.profile.photo).toBeDefined();
      expect(responseBody.data.profile.userId).toBeUndefined();
      expect(responseBody.data.profile.createdAt).toBeDefined();
      expect(responseBody.data.profile.updatedAt).toBeDefined();
    });

    it('should not get the current user when token is invalid', async () => {
      await requestApp
        .post('/auth/register')
        .send({ email: 'some.email@gmail.com', password: 'somePassword' });

      const responseLogin = await requestApp
        .post('/auth/login')
        .send({ email: 'some.email@gmail.com', password: 'somePassword' });
      const responseLoginBody: AppResponse<AuthPresenter> = responseLogin.body;
      const response = await requestApp
        .get('/users/me')
        .set('Authorization', `Bearer ${responseLoginBody.data.refreshToken}`);
      const responseBody: AppResponse = response.body;

      expect(response.statusCode).toBe(401);
      expect(responseBody.statusCode).toBe(401);
      expect(responseBody.data).toBeUndefined();
      expect(responseBody.message).toBe('Unauthorized');
    });
  });

  describe('Put Method', () => {
    it('should update the profile of current user correctly', async () => {
      await requestApp
        .post('/auth/register')
        .send({ email: 'some.email@gmail.com', password: 'somePassword' });

      const responseLogin = await requestApp
        .post('/auth/login')
        .send({ email: 'some.email@gmail.com', password: 'somePassword' });
      const responseLoginBody: AppResponse<AuthPresenter> = responseLogin.body;
      const response = await requestApp
        .put('/users/me')
        .send({
          name: 'John Doe',
          bio: "Hello, It's John Doe",
          phone: '081111111111',
        })
        .set('Authorization', `Bearer ${responseLoginBody.data.accessToken}`);

      const responseBody: AppResponse<UserPresenter> = response.body;

      expect(response.statusCode).toBe(200);
      expect(responseBody.statusCode).toBe(200);
      expect(responseBody.message).toBeUndefined();
      expect(responseBody.data.id).toBeDefined();
      expect(responseBody.data.email).toBeDefined();
      expect(responseBody.data.createdAt).toBeDefined();
      expect(responseBody.data.updatedAt).toBeDefined();
      expect(responseBody.data.password).toBeUndefined();
      expect(responseBody.data.provider).toBeUndefined();
      expect(responseBody.data.profile.id).toBeDefined();
      expect(responseBody.data.profile.name).toBe('John Doe');
      expect(responseBody.data.profile.bio).toBe("Hello, It's John Doe");
      expect(responseBody.data.profile.phone).toBe('081111111111');
      expect(responseBody.data.profile.photo).toBeUndefined();
      expect(responseBody.data.profile.createdAt).toBeDefined();
      expect(responseBody.data.profile.updatedAt).toBeDefined();
      expect(responseBody.data.profile.userId).toBeUndefined();
    });

    it('should not update the profile of the current user when token is invalid', async () => {
      await requestApp
        .post('/auth/register')
        .send({ email: 'some.email@gmail.com', password: 'somePassword' });

      const responseLogin = await requestApp
        .post('/auth/login')
        .send({ email: 'some.email@gmail.com', password: 'somePassword' });
      const responseLoginBody: AppResponse<AuthPresenter> = responseLogin.body;
      const response = await requestApp
        .put('/users/me')
        .send({
          name: 'John Doe',
          bio: "Hello, It's John Doe",
          phone: '081111111111',
        })
        .set('Authorization', `Bearer ${responseLoginBody.data.refreshToken}`);
      const responseBody: AppResponse = response.body;

      expect(response.statusCode).toBe(401);
      expect(responseBody.statusCode).toBe(401);
      expect(responseBody.data).toBeUndefined();
      expect(responseBody.message).toBe('Unauthorized');
    });
  });

  describe('Put Image Method', () => {
    it("should update the profile image correctly when the file has mimetype 'image/jpeg'", async () => {
      await requestApp
        .post('/auth/register')
        .send({ email: 'some.email@gmail.com', password: 'somePassword' });

      const responseLogin = await requestApp
        .post('/auth/login')
        .send({ email: 'some.email@gmail.com', password: 'somePassword' });
      const responseLoginBody: AppResponse<AuthPresenter> = responseLogin.body;
      const response = await requestApp
        .put('/users/me/image')
        .set('Authorization', `Bearer ${responseLoginBody.data.accessToken}`)
        .attach('image', path.resolve(__dirname, '../filesDummy/dummy.jpg'));
      const responseBody: AppResponse<UserPresenter> = response.body;

      expect(response.statusCode).toBe(200);
      expect(responseBody.statusCode).toBe(200);
      expect(responseBody.message).toBeUndefined();
      expect(responseBody.data.id).toBeDefined();
      expect(responseBody.data.email).toBeDefined();
      expect(responseBody.data.createdAt).toBeDefined();
      expect(responseBody.data.updatedAt).toBeDefined();
      expect(responseBody.data.password).toBeUndefined();
      expect(responseBody.data.provider).toBeUndefined();
      expect(responseBody.data.profile.id).toBeDefined();
      expect(responseBody.data.profile.photo).toBeDefined();
      expect(responseBody.data.profile.createdAt).toBeDefined();
      expect(responseBody.data.profile.updatedAt).toBeDefined();
      expect(responseBody.data.profile.userId).toBeUndefined();
    });

    it("should update the profile image correctly when the file has mimetype 'image/png'", async () => {
      await requestApp
        .post('/auth/register')
        .send({ email: 'some.email@gmail.com', password: 'somePassword' });

      const responseLogin = await requestApp
        .post('/auth/login')
        .send({ email: 'some.email@gmail.com', password: 'somePassword' });
      const responseLoginBody: AppResponse<AuthPresenter> = responseLogin.body;
      const response = await requestApp
        .put('/users/me/image')
        .set('Authorization', `Bearer ${responseLoginBody.data.accessToken}`)
        .attach('image', path.resolve(__dirname, '../filesDummy/dummy.png'));
      const responseBody: AppResponse<UserPresenter> = response.body;

      expect(response.statusCode).toBe(200);
      expect(responseBody.statusCode).toBe(200);
      expect(responseBody.message).toBeUndefined();
      expect(responseBody.data.id).toBeDefined();
      expect(responseBody.data.email).toBeDefined();
      expect(responseBody.data.createdAt).toBeDefined();
      expect(responseBody.data.updatedAt).toBeDefined();
      expect(responseBody.data.password).toBeUndefined();
      expect(responseBody.data.provider).toBeUndefined();
      expect(responseBody.data.profile.id).toBeDefined();
      expect(responseBody.data.profile.photo).toBeDefined();
      expect(responseBody.data.profile.createdAt).toBeDefined();
      expect(responseBody.data.profile.updatedAt).toBeDefined();
      expect(responseBody.data.profile.userId).toBeUndefined();
    });

    it("should not update the profile image when the file's mimetype is not allowed", async () => {
      await requestApp
        .post('/auth/register')
        .send({ email: 'some.email@gmail.com', password: 'somePassword' });

      const responseLogin = await requestApp
        .post('/auth/login')
        .send({ email: 'some.email@gmail.com', password: 'somePassword' });
      const responseLoginBody: AppResponse<AuthPresenter> = responseLogin.body;
      const response = await requestApp
        .put('/users/me/image')
        .set('Authorization', `Bearer ${responseLoginBody.data.accessToken}`)
        .attach('image', path.resolve(__dirname, '../filesDummy/dummy.gif'));
      const responseBody: AppResponse = response.body;

      const profile = await databaseService.profile.findFirst({
        where: { user: { email: 'some.email@gmail.com' } },
      });

      expect(response.statusCode).toBe(400);
      expect(responseBody.statusCode).toBe(400);
      expect(responseBody.data).toBeUndefined();
      expect(responseBody.message).toBe('Image type is not supported');
      expect(profile.photo).toBeNull();
    });
  });
});
