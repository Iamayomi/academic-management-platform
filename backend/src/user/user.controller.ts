import { Controller, Request, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { GuardRoute, RoleAllowed } from '../lib';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @RoleAllowed('admin')
  @GuardRoute()
  @Get()
  async findAll() {
    return this.userService.findAllUsers();
  }

  @GuardRoute()
  @Get('me')
  async getAUser(@Request() req) {
    return this.userService.findUserById(req.user.userId);
  }
}
