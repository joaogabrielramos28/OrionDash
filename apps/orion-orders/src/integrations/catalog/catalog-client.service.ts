import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  ProductData,
  ProductService,
  GetProductsRequest,
  GetProductsResponse,
} from '@orion/contracts';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CatalogClientService implements OnModuleInit {
  private productService: ProductService;

  constructor(
    @Inject('CATALOG_PACKAGE')
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.productService =
      this.client.getService<ProductService>('ProductService');
  }

  async getProductsForOrder(
    request: GetProductsRequest,
  ): Promise<ProductData[]> {
    const response: GetProductsResponse = await firstValueFrom(
      this.productService.getProductsForOrder(request),
    );

    return response.products;
  }
}
