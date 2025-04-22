import { Controller, Get, Param, Res, UseGuards } from "@nestjs/common";

import { AdminGuard } from "@/guards/admin.guard";
import { AdminService } from "@/services/admin.service";
import { Response } from "express";

@Controller({ host: "admin.huzz.wtf", version: "1.0" })
export class AdminController {
  constructor (private service: AdminService) {}

  @Get()
  @UseGuards(AdminGuard)
  async handleHome(@Res() response: Response) {
    return response.sendStatus(200);
  }
  
  @Get("auth/:action")
  @UseGuards(AdminGuard)
  async handleGetAuth(@Param('action') action: string) {
    return this.service.getAuth(action);
  }

  @Get("uptime")
  @UseGuards(AdminGuard)
  async handleUpdate() {
    return this.service.getUptime();
  }
}