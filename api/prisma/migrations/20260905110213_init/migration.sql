-- CreateEnum
CREATE TYPE "SeriesType" AS ENUM ('MANGA', 'MANHWA', 'MANHUA');

-- CreateEnum
CREATE TYPE "SeriesStatus" AS ENUM ('READING', 'PLAN_TO_READ', 'ON_HOLD', 'DROPPED', 'COMPLETED');

-- CreateTable
CREATE TABLE "Series" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "altTitle" TEXT,
    "type" "SeriesType" NOT NULL,
    "status" "SeriesStatus" NOT NULL DEFAULT 'PLAN_TO_READ',
    "currentChapter" INTEGER NOT NULL DEFAULT 0,
    "totalChapter" INTEGER,
    "rating" INTEGER,
    "notes" TEXT,
    "coverUrl" TEXT,
    "sourceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Series_pkey" PRIMARY KEY ("id")
);
