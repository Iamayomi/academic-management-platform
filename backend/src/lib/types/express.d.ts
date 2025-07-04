import { decoded } from './index';

declare module 'express' {
  interface Request {
    user?: decoded;
  }
}
