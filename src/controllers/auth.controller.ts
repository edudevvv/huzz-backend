import { Controller, Get, Query, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";

import { AuthCreateDto, AuthCallbackDto } from "@/dto/auth.dto";
import { AuthService } from "@/services/auth.service";

import { JwtService } from "@/utils/jwt.service";
import { CacheService } from "@/utils/cache.service";

@Controller({ host: "auth.huzz.wtf", version: "1.0" })
export class AuthController {
  constructor (
    private service: AuthService,  
    private jwt: JwtService,
    private cache: CacheService
  ) {}

  @Get()
  async handlerCreateAuth(@Query() data: AuthCreateDto, @Res() response: Response) {
    const jwt = await this.jwt.createTokenAuth(data["id"]);

    return response.redirect(await this.service.handleCreateURL(jwt));
  }

  @Get("callback")
  async handlerAuth(@Query() data: AuthCallbackDto, @Res() response: Response, @Req() request: Request) {
    const findToken = await this.cache.get(data["state"]);
    if (!findToken) return response.sendStatus(401);
  
    const user = await this.service.handleCreateUser(data["code"], request?.ip as string);
    if (!user) return response.sendStatus(401);

    return response.redirect("https://discord.com/channels/1259145997431472188/1280096728837521438");
  }
}