import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

import { Request } from "express";
import { Observable } from "rxjs";
import { envConfig } from "src/env";

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext):  boolean | Promise<boolean> | Observable<boolean> {
    try { 
      const req: Request = context.switchToHttp().getRequest();
      const token = req.headers["x-secret"];

      if (!token) return false;
      else if (token !== envConfig.adminSecret) return false;
      else return true;
    } catch { 
      return false;
    }
  }
}