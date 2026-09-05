import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SeriesService } from './series.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { SeriesStatus, SeriesType } from '../generated/prisma/enums.js';

describe('SeriesService', () => {
  let service: SeriesService;
  let prisma: {
    series: {
      findMany: ReturnType<typeof vi.fn>;
      findUnique: ReturnType<typeof vi.fn>;
      create: ReturnType<typeof vi.fn>;
      update: ReturnType<typeof vi.fn>;
      delete: ReturnType<typeof vi.fn>;
    };
  };

  beforeEach(async () => {
    prisma = {
      series: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [SeriesService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    service = module.get<SeriesService>(SeriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('finds all series filtered by status and sorted by updatedAt descending', async () => {
    const series = [{ id: 'series-id' }];
    prisma.series.findMany.mockResolvedValue(series);

    await expect(service.findAll(SeriesStatus.READING)).resolves.toBe(series);

    expect(prisma.series.findMany).toHaveBeenCalledWith({
      where: { status: SeriesStatus.READING },
      orderBy: { updatedAt: 'desc' },
    });
  });

  it('finds a series by id', async () => {
    const series = { id: 'series-id', title: 'One Piece' };
    prisma.series.findUnique.mockResolvedValue(series);

    await expect(service.findOne('series-id')).resolves.toBe(series);

    expect(prisma.series.findUnique).toHaveBeenCalledWith({
      where: { id: 'series-id' },
    });
  });

  it('throws when a series does not exist', async () => {
    prisma.series.findUnique.mockResolvedValue(null);

    await expect(service.findOne('missing-id')).rejects.toThrow(
      new NotFoundException('Series with id "missing-id" not found'),
    );
  });

  it('creates a series with the DTO fields', async () => {
    const data = {
      title: 'One Piece',
      altTitle: 'ワンピース',
      type: SeriesType.MANGA,
      status: SeriesStatus.READING,
      currentChapter: 10,
      notes: 'Adventure manga',
    };
    const created = { id: 'series-id', ...data };
    prisma.series.create.mockResolvedValue(created);

    await expect(service.create(data)).resolves.toBe(created);

    expect(prisma.series.create).toHaveBeenCalledWith({
      data: {
        ...data,
        totalChapter: undefined,
        rating: undefined,
        coverUrl: undefined,
        sourceUrl: undefined,
      },
    });
  });

  it('updates an existing series after checking that it exists', async () => {
    const existing = { id: 'series-id' };
    const data = { title: 'Updated title' };
    const updated = { ...existing, ...data };
    prisma.series.findUnique.mockResolvedValue(existing);
    prisma.series.update.mockResolvedValue(updated);

    await expect(service.update('series-id', data)).resolves.toBe(updated);

    expect(prisma.series.update).toHaveBeenCalledWith({
      where: { id: 'series-id' },
      data: { ...data },
    });
  });

  it('bumps the current chapter and clamps it at zero', async () => {
    prisma.series.findUnique.mockResolvedValue({
      id: 'series-id',
      currentChapter: 2,
    });
    prisma.series.update.mockResolvedValue({
      id: 'series-id',
      currentChapter: 0,
    });

    await service.bump('series-id', { amount: -5 });

    expect(prisma.series.update).toHaveBeenCalledWith({
      where: { id: 'series-id' },
      data: { currentChapter: 0 },
    });
  });

  it('removes an existing series', async () => {
    prisma.series.findUnique.mockResolvedValue({ id: 'series-id' });
    prisma.series.delete.mockResolvedValue(undefined);

    await expect(service.remove('series-id')).resolves.toBeUndefined();

    expect(prisma.series.delete).toHaveBeenCalledWith({
      where: { id: 'series-id' },
    });
  });
});
