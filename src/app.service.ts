import { HttpStatus, Injectable } from '@nestjs/common';
import { readFile, writeFile } from 'fs/promises';
import { ContactRequest, ProductDto, ServiceResponse } from './models/dto';
import { resolve } from 'path/posix';

@Injectable()
export class AppService {
  private adminFilePath = resolve(__dirname, '../data/admin.json');
  private contactsFilePath = resolve(__dirname, '../data/contacts.json');

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
