import { Controller } from '@nestjs/common';
import { ProductService } from './product.service';
import { GrpcMethod } from '@nestjs/microservices';
import { GetProductsRequest } from '@orion/contracts';

@Controller()
export class ProductGrpcController {
  constructor(private readonly productService: ProductService) {}

  @GrpcMethod('ProductService', 'GetProductsForOrder')
  async getProductsForOrder(data: GetProductsRequest) {
    return await this.productService.findProductsByIds(data);
  }
}
