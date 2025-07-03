import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { TAppErrorResponse } from '../types';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errorResponse: TAppErrorResponse = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      response: 'Something Unexpected happened. Please Try Again.',
      timestamp: new Date().toISOString(),
    };

    if (exception instanceof HttpException) {
      errorResponse.statusCode = exception.getStatus();
      errorResponse.response = exception.getResponse();
    }

    if (exception instanceof TokenExpiredError) {
      errorResponse.statusCode = HttpStatus.UNAUTHORIZED;
      errorResponse.response = 'Token expired, please log in again.';
    }

    if (exception instanceof JsonWebTokenError) {
      errorResponse.statusCode = HttpStatus.UNAUTHORIZED;
      errorResponse.response = 'Invalid token, please provide a valid token.';
    }

    // Handle Prisma errors for PostgreSQL
    if (
      exception instanceof Error &&
      'code' in exception &&
      typeof (exception as any).code === 'string'
    ) {
      const code = (exception as any).code;
      switch (code) {
        case 'P2002': // Unique constraint violation
          errorResponse.statusCode = HttpStatus.CONFLICT;
          errorResponse.response =
            'Duplicate key error: A record with this value already exists.';
          break;
        case 'P2003': // Foreign key constraint violation
          errorResponse.statusCode = HttpStatus.BAD_REQUEST;
          errorResponse.response =
            'Invalid reference: Related entity does not exist.';
          break;
        case 'P2011': // Null constraint violation
          errorResponse.statusCode = HttpStatus.BAD_REQUEST;
          errorResponse.response = 'A required field is missing.';
          break;
        case 'P2025': // Record not found
          errorResponse.statusCode = HttpStatus.NOT_FOUND;
          errorResponse.response = 'Record does not exist.';
          break;
        default:
          errorResponse.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
          errorResponse.response = 'Database error occurred.';
          break;
      }
    }

    response.status(errorResponse.statusCode).json(errorResponse);

    super.catch(exception, host);
  }
}
