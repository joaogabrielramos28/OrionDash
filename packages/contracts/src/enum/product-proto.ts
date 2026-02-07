export interface GetProductsRequest {
  restaurantId: string;
  productIds: string[];
}

export interface ProductData {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  priceVersion: number;
}

export interface GetProductsResponse {
  products: ProductData[];
}

export interface ProductService {
  getProductsForOrder(data: GetProductsRequest): any;
}
