import { HttpStatus, Injectable, Scope } from '@nestjs/common';
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { ContactRequest, ProductDto, ServiceResponse } from '../models/dto';

@Injectable({ scope: Scope.REQUEST })
export class AdminService {
  private productsFilePath = resolve(__dirname, '../../data/products.json');
  private contactsFilePath = resolve(__dirname, '../../data/contacts.json');

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

    if (products) {
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      product.id = `TRK${randomNum}`;

      products.push(product);
    }

    await writeFile(this.productsFilePath, JSON.stringify(products, null, 2));
    const response: ServiceResponse<ProductDto> = {
      message: 'Product added',
      success: true,
      data: product,
      status: HttpStatus.CREATED,
    };
    return response;
  }

  async updateProduct(
    productId: string,
    product: ProductDto,
  ): Promise<ServiceResponse<ProductDto>> {
    let products: ProductDto[] = JSON.parse(
      await readFile(this.productsFilePath, 'utf-8'),
    );

    let productExist = products.find((x) => x.id == productId);
    if (!productExist) {
      const response: ServiceResponse<ProductDto> = {
        message: 'Product not found',
        success: false,
        status: HttpStatus.NOT_FOUND,
      };
      return response;
    }

    products = products.filter((x) => x.id != productId);
    products.push(product);

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
    const newProducts = products.filter((x) => x.id != productId);
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

  async getAllContacts(): Promise<ContactRequest[]> {
    return JSON.parse(await readFile(this.contactsFilePath, 'utf-8'));
  }

  async contact(model: ContactRequest): Promise<ServiceResponse> {
    let data: ContactRequest[] = JSON.parse(
      await readFile(this.contactsFilePath, 'utf-8'),
    );
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    model.id = `contact-${randomNum}`;
    if (data) {
      data.push(model);
    } else {
      data = [{ ...model }];
    }
    await writeFile(this.contactsFilePath, JSON.stringify(data, null, 2));

    const response: ServiceResponse = {
      message: 'Thanks for contacting us',
      success: true,
      status: HttpStatus.CREATED,
    };
    return response;
  }

  async deleteContact(id: string): Promise<ServiceResponse> {
    let data: ContactRequest[] = JSON.parse(
      await readFile(this.contactsFilePath, 'utf-8'),
    );
    data = data.filter((x) => x.id != id);
    await writeFile(this.contactsFilePath, JSON.stringify(data, null, 2));

    const response: ServiceResponse = {
      message: 'Thanks for contacting us',
      success: true,
      status: HttpStatus.CREATED,
    };
    return response;
  }
}
