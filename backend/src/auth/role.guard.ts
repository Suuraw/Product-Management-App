import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) throw new ForbiddenException('No token provided');

    const payload: any = jwt.verify(token, process.env.JWT_SECRET);
    const user = await this.prisma.user.findUnique({ where: { id: payload.userId } });

    if (!user || user.role !== 'ADMIN') {
      throw new ForbiddenException('Admin access required');
    }
    return true;
  }
}