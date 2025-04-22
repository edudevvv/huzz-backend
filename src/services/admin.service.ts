import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/prisma/prisma.service";

@Injectable() 
export class AdminService { 
  constructor (private prisma: PrismaService) {}

  async getAuth(action: string) {
    if (action === 'all') {
      return await this.prisma.users.findMany();
    } else if (action.length >= 19) {
      return await this.prisma.users.findUnique({ where: { id: action } });
    }
  }

  async getUptime() {
    return 
  }
}