/*
  Warnings:

  - The values [CONFIRMED,CANCELLED] on the enum `DealStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Exchange` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OTP` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'RECEIVED');

-- AlterEnum
BEGIN;
CREATE TYPE "DealStatus_new" AS ENUM ('PENDING', 'ACTIVE', 'DECLINED', 'COMPLETED');
ALTER TABLE "Deal" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Deal" ALTER COLUMN "status" TYPE "DealStatus_new" USING ("status"::text::"DealStatus_new");
ALTER TYPE "DealStatus" RENAME TO "DealStatus_old";
ALTER TYPE "DealStatus_new" RENAME TO "DealStatus";
DROP TYPE "DealStatus_old";
ALTER TABLE "Deal" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "Exchange" DROP CONSTRAINT "Exchange_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "Exchange" DROP CONSTRAINT "Exchange_dealId_fkey";

-- DropForeignKey
ALTER TABLE "OTP" DROP CONSTRAINT "OTP_dealId_fkey";

-- AlterTable
ALTER TABLE "Deal" ADD COLUMN     "amountPaid" DOUBLE PRECISION,
ADD COLUMN     "buyerUpiId" TEXT,
ADD COLUMN     "otpCode" TEXT,
ADD COLUMN     "otpExpiresAt" TIMESTAMP(3),
ADD COLUMN     "otpUsed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "qrCodeUrl" TEXT;

-- DropTable
DROP TABLE "Exchange";

-- DropTable
DROP TABLE "OTP";

-- CreateIndex
CREATE INDEX "Deal_otpCode_idx" ON "Deal"("otpCode");
