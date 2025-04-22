import { Module } from '@nestjs/common';

import { AdminModule } from './modules/admin.module';
import { AuthModule } from './modules/auth.module';

@Module({
  imports: [AdminModule, AuthModule]
})

export class AppModule {}
