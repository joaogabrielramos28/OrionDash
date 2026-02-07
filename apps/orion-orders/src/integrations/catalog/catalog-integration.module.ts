import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { CatalogClientService } from './catalog-client.service';
const MONOREPO_ROOT = join(__dirname, '..', '..', '..', '..', '..');

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CATALOG_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'product',
          protoPath: join(
            MONOREPO_ROOT,
            'packages/contracts/src/proto/product.proto',
          ),
          url: process.env.CATALOG_GRPC_URL || 'localhost:50051',
        },
      },
    ]),
  ],
  providers: [CatalogClientService],
  exports: [CatalogClientService],
})
export class CatalogIntegrationModule {}
