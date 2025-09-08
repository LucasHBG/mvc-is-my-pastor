import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { V1Module } from './v1/v1.module';

// Configuration imports
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import appConfig from './config/app.config';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, appConfig],
      envFilePath: '.env',
    }),

    // Database (optional for testing while not having dev and prod DB)
    ...(process.env.SKIP_DB !== 'true' ? [
      TypeOrmModule.forRootAsync({
        useFactory: (databaseConfiguration) => ({
          type: 'mysql',
          host: databaseConfiguration.host,
          port: databaseConfiguration.port,
          username: databaseConfiguration.username,
          password: databaseConfiguration.password,
          database: databaseConfiguration.database,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: process.env.NODE_ENV === 'development', // Only in development
          logging: process.env.NODE_ENV === 'development',
          timezone: 'Z',
          charset: 'utf8mb4',
        }),
        inject: [databaseConfig.KEY],
      })
    ] : []),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        // Could add more limit or less depending on the route...
        throttlers: [
          {
            ttl: parseInt(process.env.THROTTLE_TTL || '60', 10) * 1000,
            limit: parseInt(process.env.THROTTLE_LIMIT || '10', 10),
          },
        ],
      }),
    }),

    // Feature modules
    V1Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
