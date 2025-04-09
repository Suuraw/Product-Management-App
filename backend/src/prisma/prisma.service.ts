import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL, // Ensures the URL is loaded from .env
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect(); // Connects to MongoDB when the module starts
  }

  async onModuleDestroy() {
    await this.$disconnect(); // Disconnects when the app shuts down
  }
}