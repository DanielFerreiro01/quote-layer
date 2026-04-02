/*
  Warnings:

  - You are about to drop the column `installationCostPerKw` on the `solar_configs` table. All the data in the column will be lost.
  - You are about to drop the column `mountingCostCarport` on the `solar_configs` table. All the data in the column will be lost.
  - You are about to drop the column `mountingCostGround` on the `solar_configs` table. All the data in the column will be lost.
  - You are about to drop the column `mountingCostRoofSheet` on the `solar_configs` table. All the data in the column will be lost.
  - You are about to drop the column `mountingCostRoofTile` on the `solar_configs` table. All the data in the column will be lost.
  - You are about to drop the column `structureCostPerKw` on the `solar_configs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "solar_configs" DROP COLUMN "installationCostPerKw",
DROP COLUMN "mountingCostCarport",
DROP COLUMN "mountingCostGround",
DROP COLUMN "mountingCostRoofSheet",
DROP COLUMN "mountingCostRoofTile",
DROP COLUMN "structureCostPerKw",
ADD COLUMN     "baseInstallationFee" DOUBLE PRECISION NOT NULL DEFAULT 300,
ADD COLUMN     "laborCostPerKw" DOUBLE PRECISION NOT NULL DEFAULT 150,
ADD COLUMN     "mountingMultiplierCarport" DOUBLE PRECISION NOT NULL DEFAULT 1.4,
ADD COLUMN     "mountingMultiplierGround" DOUBLE PRECISION NOT NULL DEFAULT 1.3,
ADD COLUMN     "mountingMultiplierRoofSheet" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
ADD COLUMN     "mountingMultiplierRoofTile" DOUBLE PRECISION NOT NULL DEFAULT 1.2,
ADD COLUMN     "structureCostPerPanel" DOUBLE PRECISION NOT NULL DEFAULT 45,
ADD COLUMN     "systemExtraCostHybrid" DOUBLE PRECISION NOT NULL DEFAULT 600,
ADD COLUMN     "systemExtraCostOffGrid" DOUBLE PRECISION NOT NULL DEFAULT 400,
ALTER COLUMN "peakSunHoursNight" SET DEFAULT 4;
