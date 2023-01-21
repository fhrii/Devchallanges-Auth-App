export type AppResponse<T extends Record<string, any> = any> = {
  statusCode: number;
  data?: T;
  message?: string;
};
