import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createLibrarySeedData() {
  // Удаление существующих данных
  await prisma.borrow.deleteMany();
  await prisma.book.deleteMany();
  await prisma.student.deleteMany();
  await prisma.author.deleteMany();

  // Создание авторов
  const authors = [
    { name: "George Orwell" },
    { name: "Aldous Huxley" },
    { name: "Harper Lee" },
    { name: "F. Scott Fitzgerald" },
    { name: "Herman Melville" },
  ];

  const createdAuthors = await Promise.all(
    authors.map((author) =>
      prisma.author.create({
        data: {
          name: author.name,
        },
      })
    )
  );

  // Создание книг
  const books = [
    {
      title: "1984",
      authorId: createdAuthors[0].id,
      publishedAt: new Date("1949-06-08"),
    },
    {
      title: "Brave New World",
      authorId: createdAuthors[1].id,
      publishedAt: new Date("1932-08-01"),
    },
    {
      title: "To Kill a Mockingbird",
      authorId: createdAuthors[2].id,
      publishedAt: new Date("1960-07-11"),
    },
    {
      title: "The Great Gatsby",
      authorId: createdAuthors[3].id,
      publishedAt: new Date("1925-04-10"),
    },
    {
      title: "Moby Dick",
      authorId: createdAuthors[4].id,
      publishedAt: new Date("1851-10-18"),
    },
  ];

  const createdBooks = await Promise.all(
    books.map((book) =>
      prisma.book.create({
        data: {
          title: book.title,
          authorId: book.authorId,
          publishedAt: book.publishedAt,
        },
      })
    )
  );

  // Создание студентов
  const students = [
    { name: "Alice", email: "alice@example.com" },
    { name: "Bob", email: "bob@example.com" },
    { name: "Charlie", email: "charlie@example.com" },
    { name: "David", email: "david@example.com" },
    { name: "Eve", email: "eve@example.com" },
  ];

  const createdStudents = await Promise.all(
    students.map((student) =>
      prisma.student.create({
        data: {
          name: student.name,
          email: student.email,
        },
      })
    )
  );

  // Создание записей о заимствовании
  const borrows = [
    {
      studentId: createdStudents[0].id,
      bookId: createdBooks[0].id,
      borrowedAt: new Date("2024-11-01"),
    },
    {
      studentId: createdStudents[1].id,
      bookId: createdBooks[1].id,
      borrowedAt: new Date("2024-11-05"),
    },
    {
      studentId: createdStudents[2].id,
      bookId: createdBooks[2].id,
      borrowedAt: new Date("2024-11-10"),
    },
    {
      studentId: createdStudents[3].id,
      bookId: createdBooks[3].id,
      borrowedAt: new Date("2024-11-15"),
    },
    {
      studentId: createdStudents[4].id,
      bookId: createdBooks[4].id,
      borrowedAt: new Date("2024-11-18"),
    },
  ];

  await Promise.all(
    borrows.map((borrow) =>
      prisma.borrow.create({
        data: {
          studentId: borrow.studentId,
          bookId: borrow.bookId,
          borrowedAt: borrow.borrowedAt,
          returnedAt: null,
        },
      })
    )
  );

  console.log("Seed data for library created successfully!");
}

createLibrarySeedData()
  .catch((e) => {
    console.error("Error creating seed data:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
