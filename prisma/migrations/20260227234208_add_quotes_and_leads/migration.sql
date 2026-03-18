-- CreateEnum
CREATE TYPE "QuoteType" AS ENUM ('SOLAR', 'GYM');

-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST');

-- CreateTable
CREATE TABLE "providers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quote_configs" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "type" "QuoteType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quote_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solar_configs" (
    "id" TEXT NOT NULL,
    "quoteConfigId" TEXT NOT NULL,
    "residentialEnergyCost" DOUBLE PRECISION NOT NULL DEFAULT 0.15,
    "residentialFixedCharge" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "residentialTaxRate" DOUBLE PRECISION NOT NULL DEFAULT 21,
    "residentialInflationRate" DOUBLE PRECISION NOT NULL DEFAULT 4,
    "industrialEnergyCost" DOUBLE PRECISION NOT NULL DEFAULT 0.12,
    "industrialFixedCharge" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "industrialDemandCharge" DOUBLE PRECISION DEFAULT 15,
    "industrialTaxRate" DOUBLE PRECISION NOT NULL DEFAULT 21,
    "industrialInflationRate" DOUBLE PRECISION NOT NULL DEFAULT 4,
    "agroEnergyCost" DOUBLE PRECISION NOT NULL DEFAULT 0.13,
    "agroFixedCharge" DOUBLE PRECISION NOT NULL DEFAULT 30,
    "agroTaxRate" DOUBLE PRECISION NOT NULL DEFAULT 10.5,
    "agroInflationRate" DOUBLE PRECISION NOT NULL DEFAULT 4,
    "panelPower" INTEGER NOT NULL DEFAULT 550,
    "panelEfficiency" DOUBLE PRECISION NOT NULL DEFAULT 21,
    "systemLosses" DOUBLE PRECISION NOT NULL DEFAULT 15,
    "degradationRate" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "peakSunHoursDay" DOUBLE PRECISION NOT NULL DEFAULT 6,
    "peakSunHoursNight" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "peakSunHoursMixed" DOUBLE PRECISION NOT NULL DEFAULT 5,
    "panelCost" DOUBLE PRECISION NOT NULL DEFAULT 200,
    "inverterCost" DOUBLE PRECISION NOT NULL DEFAULT 500,
    "inverterCostPerKw" DOUBLE PRECISION NOT NULL DEFAULT 300,
    "installationCostPerKw" DOUBLE PRECISION NOT NULL DEFAULT 150,
    "structureCostPerKw" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "marginPercentage" DOUBLE PRECISION NOT NULL DEFAULT 20,
    "mountingCostRoofSheet" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "mountingCostRoofTile" DOUBLE PRECISION NOT NULL DEFAULT 80,
    "mountingCostGround" DOUBLE PRECISION NOT NULL DEFAULT 120,
    "mountingCostCarport" DOUBLE PRECISION NOT NULL DEFAULT 150,
    "financingEnabled" BOOLEAN NOT NULL DEFAULT true,
    "downPaymentPercentage" DOUBLE PRECISION NOT NULL DEFAULT 20,
    "interestRate" DOUBLE PRECISION NOT NULL DEFAULT 8,
    "termMonths" INTEGER NOT NULL DEFAULT 60,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solar_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotes" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "quoteConfigId" TEXT NOT NULL,
    "type" "QuoteType" NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT,
    "status" "QuoteStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3),
    "input" JSONB NOT NULL,
    "result" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "providers_slug_key" ON "providers"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "quote_configs_providerId_type_key" ON "quote_configs"("providerId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "solar_configs_quoteConfigId_key" ON "solar_configs"("quoteConfigId");

-- CreateIndex
CREATE INDEX "quotes_providerId_idx" ON "quotes"("providerId");

-- CreateIndex
CREATE INDEX "quotes_customerEmail_idx" ON "quotes"("customerEmail");

-- CreateIndex
CREATE INDEX "quotes_status_idx" ON "quotes"("status");

-- CreateIndex
CREATE INDEX "quotes_createdAt_idx" ON "quotes"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "leads_quoteId_key" ON "leads"("quoteId");

-- CreateIndex
CREATE INDEX "leads_status_idx" ON "leads"("status");

-- CreateIndex
CREATE INDEX "leads_createdAt_idx" ON "leads"("createdAt");

-- AddForeignKey
ALTER TABLE "quote_configs" ADD CONSTRAINT "quote_configs_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "providers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solar_configs" ADD CONSTRAINT "solar_configs_quoteConfigId_fkey" FOREIGN KEY ("quoteConfigId") REFERENCES "quote_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "providers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_quoteConfigId_fkey" FOREIGN KEY ("quoteConfigId") REFERENCES "quote_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
