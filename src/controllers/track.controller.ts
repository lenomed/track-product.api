import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TrackService } from 'src/services/track.service';
import { Response } from 'express';

@ApiTags('Track')
@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

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
    const response = await this.trackService.findProduct(
      trackingCode,
      productId,
    );
    res.status(response.status).json(response);
  }
}
