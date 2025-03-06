import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Res,
  HttpStatus,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AdminService } from '../services/admin.service';
import { Response } from 'express';
import { ProductDto } from '../models/dto';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('products')
  @ApiResponse({ status: 201, description: 'Product added successfully' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async addProduct(@Body() product: ProductDto, @Res() res: Response) {
    const response = await this.adminService.addProduct(product);
    res.status(response.status).json(response);
  }

  @Put('products/:productId')
  @ApiResponse({ status: 201, description: 'Product added successfully' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async updateProduct(
    @Body() product: ProductDto,
    @Param('productId') productId: string,
    @Res() res: Response,
  ) {
    const response = await this.adminService.updateProduct(productId, product);
    res.status(response.status).json(response);
  }

  @Delete('products/:productId')
  @ApiResponse({ status: 201, description: 'Product added successfully' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async deleteProduct(
    @Param('productId') productId: string,
    @Res() res: Response,
  ) {
    const response = await this.adminService.deleteProduct(productId);
    res.status(response.status).json(response);
  }

  @Get('products/search')
  @ApiQuery({ name: 'trackingCode', required: false })
  @ApiQuery({ name: 'productId', required: false })
  @ApiResponse({ status: 200, description: 'Product found' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async searchProduct(
    @Query('trackingCode') trackingCode: string,
    @Query('productId') productId: string,
    @Res() res: Response,
  ) {
    const response = await this.adminService.findProduct(
      trackingCode,
      productId,
    );
    res.status(response.status).json(response);
  }

  @Get('products')
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  @ApiResponse({ status: 404, description: 'No products found' })
  async getAllProducts(@Res() res: Response) {
    const products = await this.adminService.getAllProducts();
    if (products.length > 0) {
      res
        .status(HttpStatus.OK)
        .json({ status: HttpStatus.OK, success: true, data: products });
    } else {
      res.status(HttpStatus.NOT_FOUND).json({
        status: HttpStatus.NOT_FOUND,
        success: false,
        message: 'No products found',
      });
    }
  }

  @Get('contacts')
  @ApiResponse({ status: 200, description: 'Contacts retrieved successfully' })
  @ApiResponse({ status: 404, description: 'No contact found' })
  async getAllContacts(@Res() res: Response) {
    const contacts = await this.adminService.getAllContacts();
    if (contacts.length > 0) {
      res
        .status(HttpStatus.OK)
        .json({ status: HttpStatus.OK, success: true, data: contacts });
    } else {
      res.status(HttpStatus.NOT_FOUND).json({
        status: HttpStatus.NOT_FOUND,
        success: false,
        message: 'No contact found',
      });
    }
  }

  @Delete('contacts/:id')
  @ApiResponse({ status: 200, description: 'Thank you for contacting us' })
  @ApiResponse({
    status: 400,
    description: "We couldn't process your request please try again.",
  })
  async deleteContact(@Param('id') id: string, @Res() res: Response) {
    const response = await this.adminService.deleteContact(id);
    return res.status(response.status).json(response);
  }
}
