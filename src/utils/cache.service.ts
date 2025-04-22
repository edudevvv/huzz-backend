import { Injectable } from "@nestjs/common";
import { LRUCache } from "lru-cache";

@Injectable()
export class CacheService extends LRUCache<string, any> {
  constructor () {
    super({ 
      ttlAutopurge: true,
      ttl: 1000 * 60 * 60 * 24
    })
  }
}