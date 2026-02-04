import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

const serviceName = process.env.SERVICE_NAME || "orders";

export default new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER || "delivery",
  password: process.env.DB_PASSWORD || "delivery123",
  database: process.env.DB_NAME || "delivery",
  schema: serviceName,
  entities: [`src/**/*.entity.ts`],
  migrations: [`packages/database/src/migrations/${serviceName}/*.ts`],
  synchronize: false,
});
