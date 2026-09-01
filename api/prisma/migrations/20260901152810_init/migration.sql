-- CreateTable
CREATE TABLE "Series" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "altTitle" TEXT,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PLAN_TO_READ',
    "currentChapter" INTEGER NOT NULL DEFAULT 0,
    "totalChapter" INTEGER,
    "rating" INTEGER,
    "notes" TEXT,
    "coverUrl" TEXT,
    "sourceUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
