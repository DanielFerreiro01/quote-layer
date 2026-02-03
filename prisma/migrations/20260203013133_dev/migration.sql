-- CreateEnum
CREATE TYPE "QuoteType" AS ENUM ('SOLAR', 'GYM');

-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteConfig" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "type" "QuoteType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuoteConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolarConfig" (
    "id" TEXT NOT NULL,
    "quoteConfigId" TEXT NOT NULL,
    "baseCostPerKw" DOUBLE PRECISION NOT NULL,
    "electricityCostPerKwh" DOUBLE PRECISION NOT NULL,
    "annualElectricityIncrease" DOUBLE PRECISION NOT NULL,
    "panelWattCapacity" INTEGER NOT NULL,
    "sunHoursPerDay" DOUBLE PRECISION NOT NULL,
    "systemEfficiency" DOUBLE PRECISION NOT NULL,
    "clientTypeMultiplier" JSONB NOT NULL,
    "mountingTypeMultiplier" JSONB NOT NULL,
    "maintenanceAnnualRate" DOUBLE PRECISION NOT NULL,
    "projectionYears" INTEGER NOT NULL,

    CONSTRAINT "SolarConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "quoteConfigId" TEXT NOT NULL,
    "type" "QuoteType" NOT NULL,
    "input" JSONB NOT NULL,
    "result" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Provider_slug_key" ON "Provider"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "QuoteConfig_providerId_type_key" ON "QuoteConfig"("providerId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "SolarConfig_quoteConfigId_key" ON "SolarConfig"("quoteConfigId");

-- AddForeignKey
ALTER TABLE "QuoteConfig" ADD CONSTRAINT "QuoteConfig_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolarConfig" ADD CONSTRAINT "SolarConfig_quoteConfigId_fkey" FOREIGN KEY ("quoteConfigId") REFERENCES "QuoteConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_quoteConfigId_fkey" FOREIGN KEY ("quoteConfigId") REFERENCES "QuoteConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
