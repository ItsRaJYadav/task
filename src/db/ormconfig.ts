import { ConfigService } from '@nestjs/config';
import { UserSubscriber } from 'src/entity-subscriber/user-subscriber';
import { DataSourceOptions } from 'typeorm';

export const dataSourceOptions = (
  configService: ConfigService,
): DataSourceOptions => {
  const type = configService.get<'mysql'>('DB_TYPE')!;
  const host = configService.get<string>('DB_HOST')!;
  const portStr = configService.get<string>('DB_PORT')!;
  const port = parseInt(portStr, 10);
  const username = configService.get<string>('DB_USERNAME')!;
  const password = configService.get<string>('DB_PASSWORD')!;
  const database = configService.get<string>('DB_DATABASE')!;
  const useSSL = configService.get<string>('DB_SSL') === 'true';

  const poolMax = 25;
  const connectTimeout = 10_000;

  return {
    type,
    host,
    port,
    username,
    password,
    database,
    synchronize: true,
    logging: ['error', 'warn', 'query'],
    logger: 'advanced-console',
    maxQueryExecutionTime: 5000,
    entities: ['dist/**/*.entity{.ts,.js}'],
    subscribers: [UserSubscriber],
    ssl: useSSL
      ? {
          rejectUnauthorized: false,
        }
      : undefined,
    extra: {
      connectionLimit: poolMax,
      connectTimeout,
      queueLimit: 0,
      waitForConnections: true,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10_000,
    },
  };
};
