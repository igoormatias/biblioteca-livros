-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Livro" (
    "Codl" SERIAL NOT NULL,
    "Titulo" VARCHAR(40) NOT NULL,
    "Editora" VARCHAR(40) NOT NULL,
    "Edicao" INTEGER NOT NULL,
    "AnoPublicacao" VARCHAR(4) NOT NULL,
    "Valor" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "Livro_pkey" PRIMARY KEY ("Codl")
);

-- CreateTable
CREATE TABLE "Autor" (
    "CodAu" SERIAL NOT NULL,
    "Nome" VARCHAR(40) NOT NULL,

    CONSTRAINT "Autor_pkey" PRIMARY KEY ("CodAu")
);

-- CreateTable
CREATE TABLE "Assunto" (
    "codAs" SERIAL NOT NULL,
    "Descricao" VARCHAR(20) NOT NULL,

    CONSTRAINT "Assunto_pkey" PRIMARY KEY ("codAs")
);

-- CreateTable
CREATE TABLE "Livro_Autor" (
    "Livro_Codl" INTEGER NOT NULL,
    "Autor_CodAu" INTEGER NOT NULL,

    CONSTRAINT "Livro_Autor_pkey" PRIMARY KEY ("Livro_Codl","Autor_CodAu")
);

-- CreateTable
CREATE TABLE "Livro_Assunto" (
    "Livro_Codl" INTEGER NOT NULL,
    "Assunto_codAs" INTEGER NOT NULL,

    CONSTRAINT "Livro_Assunto_pkey" PRIMARY KEY ("Livro_Codl","Assunto_codAs")
);

-- CreateIndex
CREATE INDEX "Livro_Autor_FKIndex1" ON "Livro_Autor"("Livro_Codl");

-- CreateIndex
CREATE INDEX "Livro_Autor_FKIndex2" ON "Livro_Autor"("Autor_CodAu");

-- CreateIndex
CREATE INDEX "Livro_Assunto_FKIndex1" ON "Livro_Assunto"("Livro_Codl");

-- CreateIndex
CREATE INDEX "Livro_Assunto_FKIndex2" ON "Livro_Assunto"("Assunto_codAs");

-- AddForeignKey
ALTER TABLE "Livro_Autor" ADD CONSTRAINT "Livro_Autor_Livro_Codl_fkey" FOREIGN KEY ("Livro_Codl") REFERENCES "Livro"("Codl") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Livro_Autor" ADD CONSTRAINT "Livro_Autor_Autor_CodAu_fkey" FOREIGN KEY ("Autor_CodAu") REFERENCES "Autor"("CodAu") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Livro_Assunto" ADD CONSTRAINT "Livro_Assunto_Livro_Codl_fkey" FOREIGN KEY ("Livro_Codl") REFERENCES "Livro"("Codl") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Livro_Assunto" ADD CONSTRAINT "Livro_Assunto_Assunto_codAs_fkey" FOREIGN KEY ("Assunto_codAs") REFERENCES "Assunto"("codAs") ON DELETE CASCADE ON UPDATE CASCADE;
