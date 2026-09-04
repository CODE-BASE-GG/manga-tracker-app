import { IsIn, IsInt,IsOptional } from "class-validator";

export class BumpChapterDto {
    @IsInt()
    @IsOptional()
    amount?: number;
}