import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC = 'isPublic';
/** Kalitsiz ochiq endpoint (faqat /health). */
export const Public = () => SetMetadata(IS_PUBLIC, true);
