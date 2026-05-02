import "dotenv/config";
import { prisma } from "../src/core/prisma.js";

async function main() {
  const a1 = await prisma.autor.create({
    data: { nome: "Machado de Assis" },
  });
  const a2 = await prisma.autor.create({
    data: { nome: "Clarice Lispector" },
  });

  const s1 = await prisma.assunto.create({
    data: { descricao: "Romance" },
  });
  const s2 = await prisma.assunto.create({
    data: { descricao: "Ficção" },
  });

  const livro1 = await prisma.livro.create({
    data: {
      titulo: "Dom Casmurro",
      editora: "Garnier",
      edicao: 1,
      anoPublicacao: "1899",
      valor: 49.9,
    },
  });

  await prisma.livroAutor.createMany({
    data: [
      { livroCodl: livro1.codl, autorCodAu: a1.codAu },
      { livroCodl: livro1.codl, autorCodAu: a2.codAu },
    ],
  });

  await prisma.livroAssunto.createMany({
    data: [
      { livroCodl: livro1.codl, assuntoCodAs: s1.codAs },
      { livroCodl: livro1.codl, assuntoCodAs: s2.codAs },
    ],
  });

  const livro2 = await prisma.livro.create({
    data: {
      titulo: "A hora da estrela",
      editora: "Rocco",
      edicao: 3,
      anoPublicacao: "1977",
      valor: 35,
    },
  });

  await prisma.livroAutor.createMany({
    data: [{ livroCodl: livro2.codl, autorCodAu: a2.codAu }],
  });

  await prisma.livroAssunto.createMany({
    data: [{ livroCodl: livro2.codl, assuntoCodAs: s1.codAs }],
  });

  console.log("Seed concluído.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
