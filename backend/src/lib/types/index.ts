export type TROLES = 'student' | 'lecturer' | 'admin';

export type TAppErrorResponse = {
  statusCode: number;
  response: string | object;
  timestamp: string;
};

export interface decoded {
  userId: number;
  email: string;
  role: TROLES;
  iat?: number;
  exp?: number;
}
