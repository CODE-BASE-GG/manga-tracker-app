import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const isRemote = process.env.DATABASE_TARGET === 'remote';
    const databaseUrl = isRemote
      ? process.env.REMOTE_DATABASE_URL
      : process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error(
        isRemote
          ? 'REMOTE_DATABASE_URL is not defined'
          : 'DATABASE_URL is not defined',
      );
    }

    const adapter = new PrismaPg({
      connectionString: databaseUrl,
    });

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
