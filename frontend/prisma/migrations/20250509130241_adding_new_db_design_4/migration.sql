-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('ACTIVE', 'DELETED', 'FULLFILLED');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "status" "STATUS" NOT NULL DEFAULT 'ACTIVE';
