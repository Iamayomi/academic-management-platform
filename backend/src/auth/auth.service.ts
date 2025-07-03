import { Injectable, UnauthorizedException } from '@nestjs/common';
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

    await this.prisma.user.create({
      data: { email: dto.email, password: dto.password, role: dto.role },
    });
    return { message: 'User registered successfully' };
  }

  public async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email, password: dto.password, role: dto.role },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ sub: user.email, role: user.role });

    if (!token) throw new UnauthorizedException('Token generation failed');

    return { access_token: token, token_type: 'bearer' };
  }
}
