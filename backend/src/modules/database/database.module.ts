import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database.service';
import { EnvironmentService, EnvironmentStrategy } from '../environment';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DatabaseService,
      inject: [EnvironmentService],
    }),
  ],
  providers: [EnvironmentService, EnvironmentStrategy],
})
export class DatabaseModule {}
