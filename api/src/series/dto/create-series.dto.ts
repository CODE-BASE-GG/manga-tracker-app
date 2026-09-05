import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { SeriesStatus, SeriesType } from '../../generated/prisma/enums.js';

export class CreateSeriesDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  altTitle: string;

  @IsEnum(SeriesType)
  type: SeriesType;

  @IsEnum(SeriesStatus)
  @IsOptional()
  status?: SeriesStatus;

  @IsInt()
  @Min(0)
  @IsOptional()
  currentChapter?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  totalChapter?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  rating?: number;

  @IsString()
  @IsOptional()
  notes: string;

  @IsString()
  @IsOptional()
  coverUrl?: string;

  @IsString()
  @IsOptional()
  sourceUrl?: string;
}
