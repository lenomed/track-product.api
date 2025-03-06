import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { ContactRequest } from './models/dto';

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

  @Post('contacts')
  @ApiResponse({ status: 201, description: 'Thank you for contacting us' })
  @ApiResponse({
    status: 400,
    description: "We couldn't process your request please try again.",
  })
  async contact(@Body() model: ContactRequest, @Res() res: Response) {
    const response = await this.appService.contact(model);
    return res.status(response.status).json(response);
  }
}
