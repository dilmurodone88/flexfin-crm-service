import { HttpException, HttpStatus } from '@nestjs/common';

export const badRequest = (msg: string) => new HttpException(msg, HttpStatus.BAD_REQUEST);
export const notFound = (msg: string) => new HttpException(msg, HttpStatus.NOT_FOUND);
export const tooMany = (msg: string) => new HttpException(msg, HttpStatus.TOO_MANY_REQUESTS);
export const gatewayTimeout = (msg: string) => new HttpException(msg, HttpStatus.GATEWAY_TIMEOUT);
