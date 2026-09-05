import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { SeriesStatus } from '../generated/prisma/enums.js';
import { CreateSeriesDto } from './dto/create-series.dto.js';
import { UpdateSeriesDto } from './dto/update-series.dto.js';
import { BumpChapterDto } from './dto/bump-chapter.dto.js';

@Injectable()
export class SeriesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(status?: SeriesStatus, sort?: string) {
    return this.prisma.series.findMany({
      where: status ? { status } : undefined,
      orderBy: {
        [sort === 'updatedAt' ? 'updatedAt' : 'updatedAt']: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const series = await this.prisma.series.findUnique({
      where: { id },
    });

    if (!series) {
      throw new NotFoundException(`Series with id "${id}" not found`);
    }

    return series;
  }

  create(data: CreateSeriesDto) {
    return this.prisma.series.create({
      data: {
        title: data.title,
        altTitle: data.altTitle,
        type: data.type,
        status: data.status,
        currentChapter: data.currentChapter,
        totalChapter: data.totalChapter,
        rating: data.rating,
        notes: data.notes,
        coverUrl: data.coverUrl,
        sourceUrl: data.sourceUrl,
      },
    });
  }

  async update(id: string, data: UpdateSeriesDto) {
    await this.findOne(id);

    return this.prisma.series.update({
      where: { id },
      data: {
        title: data.title,
        altTitle: data.altTitle,
        type: data.type,
        status: data.status,
        currentChapter: data.currentChapter,
        totalChapter: data.totalChapter,
        rating: data.rating,
        notes: data.notes,
        coverUrl: data.coverUrl,
        sourceUrl: data.sourceUrl,
      },
    });
  }

  async bump(id: string, data: BumpChapterDto) {
    const series = await this.findOne(id);

    const amount = data.amount ?? 1;
    const currentChapter = Math.max(0, series.currentChapter + amount);

    return this.prisma.series.update({
      where: { id },
      data: { currentChapter },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.series.delete({
      where: { id },
    });
  }
}
