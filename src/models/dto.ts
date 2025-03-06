import { HttpStatus } from '@nestjs/common';

export interface ProductDto {
  id: string;
  name: string;
  description: string;
  senderName: string;
  receiverName: string;
  origin: string;
  destination: string;
  departureDate: string;
  arrivalDate: string;
  status: string;
  trackingId: string;
}

export interface ServiceResponse<T = null> {
  message: string;
  success: boolean;
  status: HttpStatus;
  data?: T | null;
}

export interface ContactRequest {
  id: string;
  message: string;
  email: string;
  name: string;
  subject: string;
}
