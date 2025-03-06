import { Controller, Get, Query, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('login')
  @ApiQuery({ name: 'username', required: true })
  @ApiQuery({ name: 'password', required: true })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Query('email') email: string,
    @Query('password') password: string,
    @Res() res: Response,
  ) {
    const response = await this.appService.validateAdmin(email, password);
    return res.status(response.status).json(response);
  }
}
