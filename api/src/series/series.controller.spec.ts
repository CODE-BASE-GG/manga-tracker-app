import { Test, TestingModule } from '@nestjs/testing';
import { SeriesController } from './series.controller.js';
import { SeriesService } from './series.service.js';
import { SeriesStatus, SeriesType } from '../generated/prisma/enums.js';

describe('SeriesController', () => {
  let controller: SeriesController;
  let service: {
    findAll: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    bump: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    service = {
      findAll: vi.fn(),
      findOne: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      bump: vi.fn(),
      remove: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeriesController],
      providers: [{ provide: SeriesService, useValue: service }],
    }).compile();

    controller = module.get<SeriesController>(SeriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates findAll with status and sort', () => {
    controller.findAll(SeriesStatus.READING, 'updatedAt');

    expect(service.findAll).toHaveBeenCalledWith(
      SeriesStatus.READING,
      'updatedAt',
    );
  });

  it('delegates findOne, create, update, and bump', () => {
    const createDto = {
      title: 'One Piece',
      altTitle: 'ワンピース',
      notes: 'Adventure manga',
      type: SeriesType.MANGA,
    };
    const updateDto = { title: 'Updated title' };
    const bumpDto = { amount: 2 };

    controller.findOne('series-id');
    controller.create(createDto);
    controller.update('series-id', updateDto);
    controller.bump('series-id', bumpDto);

    expect(service.findOne).toHaveBeenCalledWith('series-id');
    expect(service.create).toHaveBeenCalledWith(createDto);
    expect(service.update).toHaveBeenCalledWith('series-id', updateDto);
    expect(service.bump).toHaveBeenCalledWith('series-id', bumpDto);
  });

  it('awaits remove and returns no content', async () => {
    service.remove.mockResolvedValue(undefined);

    await expect(controller.remove('series-id')).resolves.toBeUndefined();

    expect(service.remove).toHaveBeenCalledWith('series-id');
  });
});
