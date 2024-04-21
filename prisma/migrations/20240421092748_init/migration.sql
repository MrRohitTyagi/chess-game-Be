-- CreateTable
CREATE TABLE "USER" (
    "pk" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "displayName" TEXT NOT NULL DEFAULT 'Guest',
    "password" TEXT NOT NULL,

    CONSTRAINT "USER_pkey" PRIMARY KEY ("pk")
);
