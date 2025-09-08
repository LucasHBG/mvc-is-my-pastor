import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3333', 10),
  apiPrefix: process.env.API_PREFIX || 'api',
  argon2: {
    memorySize: parseInt(process.env.ARGON2_MEMORY_SIZE || '65536', 10),
    timeCost: parseInt(process.env.ARGON2_TIME_COST || '3', 10),
    parallelism: parseInt(process.env.ARGON2_PARALLELISM || '4', 10),
  },
}));
