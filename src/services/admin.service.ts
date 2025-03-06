import { HttpStatus, Injectable, Scope } from '@nestjs/common';
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { ProductDto, ServiceResponse } from '../models/dto';

@Injectable({ scope: Scope.REQUEST })
export class AdminService {
  private productsFilePath = resolve(__dirname, '../../data/products.json');

  async addProduct(product: ProductDto): Promise<ServiceResponse<ProductDto>> {
    const products: ProductDto[] = JSON.parse(
      await readFile(this.productsFilePath, 'utf-8'),
    );

    const productExist = products.find(
      (x) => x.id == product.id || x.trackingId == product.trackingId,
    );
    if (productExist) {
      const response: ServiceResponse<ProductDto> = {
        message: 'Product exist',
        success: false,
        status: HttpStatus.CONFLICT,
      };
      return response;
    }
    if (products) products.push(product);
    await writeFile(this.productsFilePath, JSON.stringify(products, null, 2));
    const response: ServiceResponse<ProductDto> = {
      message: 'Product added',
      success: true,
      data: product,
      status: HttpStatus.CREATED,
    };
    return response;
  }

  async deleteProduct(productId: string): Promise<ServiceResponse> {
    const products = await this.getAllProducts();
    const product = products.find(
      (p) => p.trackingId === productId || p.id === productId,
    );
    if (!product) {
      const response: ServiceResponse = {
        message: 'Product not found',
        success: false,
        status: HttpStatus.NOT_FOUND,
      };
      return response;
    }
    const newProducts = products.filter(
      (x) => x.id != productId || x.trackingId != productId,
    );
    await writeFile(
      this.productsFilePath,
      JSON.stringify(newProducts, null, 2),
    );
    const response: ServiceResponse = {
      message: 'Product deleted',
      success: true,
      status: HttpStatus.OK,
    };
    return response;
  }

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

  async getAllProducts(): Promise<ProductDto[]> {
    return JSON.parse(await readFile(this.productsFilePath, 'utf-8'));
  }
}
