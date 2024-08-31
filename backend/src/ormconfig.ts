import { DataSource } from 'typeorm';
import { Measure } from './entities/Measure';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Measure],
  synchronize: true, // Em produção, é recomendável desativar isso
});
