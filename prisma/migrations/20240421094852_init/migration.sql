/*
  Warnings:

  - You are about to drop the `USER` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "USER";

-- CreateTable
CREATE TABLE "user" (
    "pk" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "displayName" TEXT NOT NULL DEFAULT 'Guest',
    "password" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("pk")
);
