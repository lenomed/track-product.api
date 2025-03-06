import { HttpStatus, Injectable, Scope } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { resolve } from 'path/posix';
import { ServiceResponse, ProductDto } from 'src/models/dto';

@Injectable({ scope: Scope.REQUEST })
export class TrackService {
  private productsFilePath = resolve(__dirname, '../data/products.json');

  async findProduct(
    trackingCode: string,
    productId: string,
  ): Promise<ServiceResponse<ProductDto>> {
    const products: ProductDto[] = JSON.parse(
      await readFile(this.productsFilePath, 'utf-8'),
    );
    const product = products.find(
      (p) => p.trackingId === trackingCode || p.id === productId,
    );
    if (!product) {
      const response: ServiceResponse<ProductDto> = {
        message: 'Product not found',
        success: false,
        status: HttpStatus.NOT_FOUND,
      };
      return response;
    }
    const response: ServiceResponse<ProductDto> = {
      message: 'Successful',
      success: true,
      status: HttpStatus.OK,
      data: product,
    };
    return response;
  }
}
