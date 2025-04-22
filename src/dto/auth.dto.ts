import { Injectable } from "@nestjs/common";
import { IsNotEmpty, IsString } from "class-validator";

@Injectable()
export class AuthCreateDto {
  @IsNotEmpty() @IsString()
  id: string;
}

export class AuthCallbackDto {
  @IsNotEmpty() @IsString()
  code: string;
  state: string;
}