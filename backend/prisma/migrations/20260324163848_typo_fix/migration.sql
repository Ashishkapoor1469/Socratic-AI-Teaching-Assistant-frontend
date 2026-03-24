/*
  Warnings:

  - You are about to drop the column `tiitle` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the `Messsages` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `title` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Messsages" DROP CONSTRAINT "Messsages_chatId_fkey";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "tiitle",
ADD COLUMN     "title" TEXT NOT NULL;

-- DropTable
DROP TABLE "Messsages";

-- CreateTable
CREATE TABLE "Messages" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "role" "MessageRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chatId" TEXT NOT NULL,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
