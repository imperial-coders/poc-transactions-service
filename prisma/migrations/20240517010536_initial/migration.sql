-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amountInCents" INTEGER NOT NULL,
    "summary" TEXT,
    "transactionDate" DATETIME NOT NULL,
    "merchant" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
