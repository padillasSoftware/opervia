/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `centers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "centers_email_key" ON "centers"("email");
