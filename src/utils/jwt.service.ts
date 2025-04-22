import { Injectable } from "@nestjs/common";

import { SignJWT,  } from 'jose';
import { CacheService } from "./cache.service";
import { envConfig } from "src/env";

@Injectable()
export class JwtService {
  constructor (private cache: CacheService) {}

  private async create(): Promise<string | string> {
    const jwt = await new SignJWT({ "id": 10101 })
     .setProtectedHeader({ alg: 'HS256' })
     .sign(Buffer.from(envConfig.keySecret, "base64"))

    return jwt;
  }

  async createTokenAuth(id: string): Promise<string> {
    const token = await this.create();

    this.cache.ttl = 600000;
    this.cache.set(token, { "userId": id });

    return token;
  }
}