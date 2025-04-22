import { Module } from "@nestjs/common";

import { AuthController } from "@/controllers/auth.controller";
import { AuthCreateDto } from "@/dto/auth.dto";

import { AuthService } from "@/services/auth.service";
import { CacheService } from "@/utils/cache.service";
import { JwtService } from "@/utils/jwt.service";
import { PrismaService } from "src/prisma/prisma.service";

@Module({ 
  controllers: [AuthController],
  providers: [AuthCreateDto, AuthService, CacheService, JwtService, PrismaService]
})

export class AuthModule {}