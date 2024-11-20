import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createLibrarySeedData() {
  // Удаление существующих данных
  await prisma.borrow.deleteMany(); // Исправлено на правильное имя модели
  await prisma.book.deleteMany();
  await prisma.student.deleteMany();
  await prisma.author.deleteMany();
  await prisma.category.deleteMany();
  await prisma.review.deleteMany();

  // Создание авторов
  const authors = [
    {
      name: "George Orwell",
      bio: "English novelist, essayist, journalist, and critic.",
    },
    { name: "Aldous Huxley", bio: "English writer and philosopher." },
    {
      name: "Harper Lee",
      bio: "American novelist known for 'To Kill a Mockingbird'.",
    },
    {
      name: "F. Scott Fitzgerald",
      bio: "American novelist widely regarded as one of the greatest writers of the 20th century.",
    },
    {
      name: "Herman Melville",
      bio: "American novelist, short story writer, and poet.",
    },
  ];

  const createdAuthors = await Promise.all(
    authors.map((author) =>
      prisma.author.create({
        data: {
          name: author.name,
          bio: author.bio,
        },
      })
    )
  );

  // Создание категорий
  const categories = [
    { name: "Fiction" },
    { name: "Science" },
    { name: "Literature" },
    { name: "Classics" },
    { name: "Non-fiction" },
  ];

  const createdCategories = await Promise.all(
    categories.map((category) =>
      prisma.category.create({
        data: {
          name: category.name,
        },
      })
    )
  );

  // Создание книг
  const books = [
    {
      title: "1984",
      authorId: createdAuthors[0].id,
      categoryId: createdCategories[0].id,
      publishedAt: new Date("1949-06-08"),
    },
    {
      title: "Brave New World",
      authorId: createdAuthors[1].id,
      categoryId: createdCategories[1].id,
      publishedAt: new Date("1932-08-01"),
    },
    {
      title: "To Kill a Mockingbird",
      authorId: createdAuthors[2].id,
      categoryId: createdCategories[2].id,
      publishedAt: new Date("1960-07-11"),
    },
    {
      title: "The Great Gatsby",
      authorId: createdAuthors[3].id,
      categoryId: createdCategories[3].id,
      publishedAt: new Date("1925-04-10"),
    },
    {
      title: "Moby Dick",
      authorId: createdAuthors[4].id,
      categoryId: createdCategories[4].id,
      publishedAt: new Date("1851-10-18"),
    },
  ];

  const createdBooks = await Promise.all(
    books.map((book) =>
      prisma.book.create({
        data: {
          title: book.title,
          authorId: book.authorId,
          categoryId: book.categoryId,
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
      prisma.borrowRecord.create({
        data: {
          studentId: borrow.studentId,
          bookId: borrow.bookId,
          borrowedAt: borrow.borrowedAt,
          returnedAt: null,
        },
      })
    )
  );

  // Создание отзывов
  const reviews = [
    {
      studentId: createdStudents[0].id,
      bookId: createdBooks[0].id,
      content: "A chilling depiction of a dystopian society.",
      rating: 5,
      createdAt: new Date("2024-11-01"),
    },
    {
      studentId: createdStudents[1].id,
      bookId: createdBooks[1].id,
      content: "A thought-provoking novel about technology and control.",
      rating: 4,
      createdAt: new Date("2024-11-05"),
    },
    {
      studentId: createdStudents[2].id,
      bookId: createdBooks[2].id,
      content: "A powerful story about racism and justice.",
      rating: 5,
      createdAt: new Date("2024-11-10"),
    },
  ];

  await Promise.all(
    reviews.map((review) =>
      prisma.review.create({
        data: {
          studentId: review.studentId,
          bookId: review.bookId,
          content: review.content,
          rating: review.rating,
          createdAt: review.createdAt,
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
