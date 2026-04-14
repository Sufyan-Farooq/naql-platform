-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SHIPPER', 'CARRIER', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "LoadStatus" AS ENUM ('ACTIVE', 'PENDING_ASSIGNMENT', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BidStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'COUNTERED');

-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('ASSIGNED', 'AT_PICKUP', 'LOADED', 'IN_TRANSIT', 'AT_DELIVERY', 'DELIVERED', 'INVOICED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING',
    "name" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "phone" TEXT,
    "crNumber" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Load" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "refNumber" TEXT NOT NULL,
    "status" "LoadStatus" NOT NULL DEFAULT 'ACTIVE',
    "shipperId" TEXT NOT NULL,
    "cargoContent" TEXT NOT NULL,
    "cargoType" TEXT NOT NULL,
    "cargoWeight" DOUBLE PRECISION NOT NULL,
    "truckType" TEXT NOT NULL,
    "isUrgent" BOOLEAN NOT NULL DEFAULT false,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "pickupDate" TEXT NOT NULL,
    "bidCloseTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Load_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bid" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "BidStatus" NOT NULL DEFAULT 'PENDING',
    "loadId" TEXT NOT NULL,
    "carrierId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "truckPlate" TEXT NOT NULL,
    "etaHours" INTEGER NOT NULL,
    "notes" TEXT,

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "TripStatus" NOT NULL DEFAULT 'ASSIGNED',
    "progress" INTEGER NOT NULL DEFAULT 1,
    "events" JSONB NOT NULL,
    "loadId" TEXT NOT NULL,
    "bidId" TEXT NOT NULL,
    "carrierId" TEXT NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactSubmission" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "source" TEXT,
    "message" TEXT,
    "cargoType" TEXT,
    "cargoWeight" TEXT,
    "typeOfTruck" TEXT,
    "noOfTrucks" TEXT,
    "repeatOrder" TEXT,
    "fleetSize" TEXT,
    "operationalRegions" TEXT,
    "truckTypesAvailable" TEXT[],
    "otherTruckTypes" TEXT,
    "regularContracts" TEXT,

    CONSTRAINT "ContactSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Load_refNumber_key" ON "Load"("refNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Trip_loadId_key" ON "Trip"("loadId");

-- CreateIndex
CREATE UNIQUE INDEX "Trip_bidId_key" ON "Trip"("bidId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Load" ADD CONSTRAINT "Load_shipperId_fkey" FOREIGN KEY ("shipperId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_loadId_fkey" FOREIGN KEY ("loadId") REFERENCES "Load"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_loadId_fkey" FOREIGN KEY ("loadId") REFERENCES "Load"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_bidId_fkey" FOREIGN KEY ("bidId") REFERENCES "Bid"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
