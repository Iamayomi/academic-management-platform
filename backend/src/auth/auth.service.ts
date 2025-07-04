import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  public async register(dto: RegisterDto) {
    // Check if the email is already registered
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (user) throw new UnauthorizedException('Email already registered');

    const hashPassword = await bcrypt.hash(dto.password, 10);

    await this.prisma.user.create({
      data: { email: dto.email, password: hashPassword, role: dto.role },
    });
    return { message: 'User registered successfully' };
  }

  public async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email, role: dto.role },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password)))
      throw new UnauthorizedException('Invalid email or password');

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload = { userId: user.id, email: user.email, role: user.role };

    const token = await this.jwtService.signAsync(payload);

    if (!token) throw new UnauthorizedException('Token generation failed');

    return { access_token: token, token_type: 'bearer', user: user };
  }
}
