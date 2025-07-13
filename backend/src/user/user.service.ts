import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  public async findAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  public async findUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  public async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  public async createUser(data: Omit<User, 'id'>): Promise<User> {
    return this.prisma.user.create({ data });
  }

  public async update(
    id: number,
    data: Partial<Omit<User, 'id'>>,
  ): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  public async remove(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}
