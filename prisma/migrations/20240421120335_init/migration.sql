-- AlterTable
ALTER TABLE "user" ADD COLUMN     "isSearching" BOOLEAN DEFAULT false,
ALTER COLUMN "displayName" DROP NOT NULL;
