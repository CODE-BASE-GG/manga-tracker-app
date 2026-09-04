import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { SeriesService } from './series.service.js';
import { SeriesStatus } from '../generated/prisma/enums.js';
import { CreateSeriesDto } from './dto/create-series.dto.js';
import { UpdateSeriesDto } from './dto/update-series.dto.js';
import { BumpChapterDto } from './dto/bump-chapter.dto.js';

@Controller('series')
export class SeriesController {
    constructor(private readonly seriesService: SeriesService) {}

    @Get()
    findAll(
        @Query('status') status?: SeriesStatus,
        @Query('sort') sort?: string,
    ) {
        return this.seriesService.findAll(status, sort);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.seriesService.findOne(id);
    }

    @Post()
    create(@Body() createSeriesDto: CreateSeriesDto) {
        return this.seriesService.create(createSeriesDto);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateSeriesDto: UpdateSeriesDto,
    ) {
        return this.seriesService.update(id, updateSeriesDto);
    }

    @Patch(':id/bump')
    bump(
        @Param('id') id: string,
        @Body() bumpChapterDto: BumpChapterDto,
    ) {
        return this.seriesService.bump(id, bumpChapterDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string) {
        await this.seriesService.remove(id);
    }
}
