import { HttpStatus, Injectable } from '@nestjs/common';
import { readFile, writeFile } from 'fs/promises';
import { ProductDto, ServiceResponse } from './models/dto';
import { resolve } from 'path/posix';

@Injectable()
export class AppService {
  private adminFilePath = resolve(__dirname, '../data/admin.json');

  getHello(): string {
    return 'Hello World!';
  }

  async validateAdmin(
    email: string,
    password: string,
  ): Promise<ServiceResponse<{ token: string }>> {
    const data = JSON.parse(await readFile(this.adminFilePath, 'utf-8'));
    if (email?.toLowerCase() === data.email && password === data.password) {
      const token = `${data.email}${data.password}tracking-product`;

      const response: ServiceResponse<{ token: string }> = {
        message: 'Login successful',
        success: true,
        status: HttpStatus.OK,
        data: { token },
      };
      return response;
    }
    const response: ServiceResponse<{ token: string }> = {
      message: 'Invalid credentials',
      success: false,
      status: HttpStatus.UNAUTHORIZED,
    };
    return response;
  }
}
