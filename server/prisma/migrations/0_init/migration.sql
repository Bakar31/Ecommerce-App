-- CreateTable
CREATE TABLE "products" (
    "product_id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "stockquantity" INTEGER NOT NULL,
    "image_path" VARCHAR(255),

    CONSTRAINT "products_pkey" PRIMARY KEY ("product_id")
);

