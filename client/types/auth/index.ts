import { User } from "../interface";

export interface AuthResponse {
  user: User;
  token: string;
}
