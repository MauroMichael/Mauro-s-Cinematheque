import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  DatabaseModule,
  EnvironmentModule,
  FilmsModule,
  HealthModule,
  UsersModule,
} from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    HealthModule,
    UsersModule,
    FilmsModule,
    EnvironmentModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
