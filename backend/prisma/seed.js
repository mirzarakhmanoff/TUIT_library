import dotenv from "dotenv"; // Используем import
dotenv.config();
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createLibrarySeedData() {
  await prisma.borrow.deleteMany();
  await prisma.book.deleteMany();
  await prisma.student.deleteMany();
  await prisma.author.deleteMany();
  await prisma.category.deleteMany();
  await prisma.review.deleteMany();

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
    { name: "Лев Толстой", bio: "Русский писатель, автор 'Война и мир'." },
    {
      name: "Федор Достоевский",
      bio: "Русский писатель, автор 'Преступление и наказание'.",
    },
    { name: "Александр Пушкин", bio: "Русский поэт, автор 'Евгений Онегин'." },
    {
      name: "Михаил Булгаков",
      bio: "Русский писатель, автор 'Мастер и Маргарита'.",
    },
    { name: "Лев Толстой", bio: "Русский писатель, автор 'Детство'." },
    { name: "Ойбек", bio: "Автор известного произведения 'Навои'." },
    { name: "Абдулла Каххар", bio: "Автор произведения 'Сароб'." },
    { name: "Абдурауф Фитрат", bio: "Автор произведения 'Оила'." },
    { name: "Эркин Вахидов", bio: "Автор произведения 'Тонг нафаси'." },
    { name: "Чолпон", bio: "Автор произведения 'Кеча ва кундуз'." },
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

  const books = [
    // Зарубежные книги
    {
      title: "1984",
      authorId: createdAuthors[0]?.id,
      categoryId: createdCategories[0]?.id,
      publishedAt: new Date("1949-06-08"),
      rating: 4.8,
      image: "https://example.com/images/1984.jpg",
    },
    {
      title: "Brave New World",
      authorId: createdAuthors[1]?.id,
      categoryId: createdCategories[1]?.id,
      publishedAt: new Date("1932-08-01"),
      rating: 4.5,
      image: "https://example.com/images/brave_new_world.jpg",
    },
    {
      title: "To Kill a Mockingbird",
      authorId: createdAuthors[2]?.id,
      categoryId: createdCategories[2]?.id,
      publishedAt: new Date("1960-07-11"),
      rating: 4.9,
      image: "https://example.com/images/to_kill_a_mockingbird.jpg",
    },
    {
      title: "The Great Gatsby",
      authorId: createdAuthors[3]?.id,
      categoryId: createdCategories[3]?.id,
      publishedAt: new Date("1925-04-10"),
      rating: 4.4,
      image: "https://example.com/images/the_great_gatsby.jpg",
    },
    {
      title: "Moby Dick",
      authorId: createdAuthors[4]?.id,
      categoryId: createdCategories[4]?.id,
      publishedAt: new Date("1851-10-18"),
      rating: 4.1,
      image: "https://example.com/images/moby_dick.jpg",
    },

    // Русская литература
    {
      title: "Война и мир",
      authorId: createdAuthors[5]?.id,
      categoryId: createdCategories[5]?.id,
      publishedAt: new Date("1869-01-01"),
      rating: 4.9,
      image: "https://example.com/images/war_and_peace.jpg",
    },
    {
      title: "Преступление и наказание",
      authorId: createdAuthors[6]?.id,
      categoryId: createdCategories[6]?.id,
      publishedAt: new Date("1866-01-01"),
      rating: 4.8,
      image: "https://example.com/images/crime_and_punishment.jpg",
    },
    {
      title: "Евгений Онегин",
      authorId: createdAuthors[7]?.id,
      categoryId: createdCategories[7]?.id,
      publishedAt: new Date("1833-01-01"),
      rating: 4.7,
      image: "https://example.com/images/eugene_onegin.jpg",
    },
    {
      title: "Мастер и Маргарита",
      authorId: createdAuthors[8]?.id,
      categoryId: createdCategories[8]?.id,
      publishedAt: new Date("1940-01-01"),
      rating: 4.9,
      image: "https://example.com/images/master_and_margarita.jpg",
    },
    {
      title: "Детство",
      authorId: createdAuthors[9]?.id,
      categoryId: createdCategories[9]?.id,
      publishedAt: new Date("1852-01-01"),
      rating: 4.5,
      image: "https://example.com/images/childhood.jpg",
    },

    // Узбекская литература
    {
      title: "Ойбек - Навои",
      authorId: createdAuthors[10]?.id,
      categoryId: createdCategories[10]?.id,
      publishedAt: new Date("1944-01-01"),
      rating: 4.7,
      image: "https://example.com/images/oybek_navoi.jpg",
    },
    {
      title: "Абдулла Каххар - Сароб",
      authorId: createdAuthors[11]?.id,
      categoryId: createdCategories[11]?.id,
      publishedAt: new Date("1936-01-01"),
      rating: 4.6,
      image: "https://example.com/images/sarob.jpg",
    },
    {
      title: "Абдурауф Фитрат - Оила",
      authorId: createdAuthors[12]?.id,
      categoryId: createdCategories[12]?.id,
      publishedAt: new Date("1923-01-01"),
      rating: 4.8,
      image: "https://example.com/images/oila.jpg",
    },
    {
      title: "Эркин Вахидов - Тонг нафаси",
      authorId: createdAuthors[13]?.id,
      categoryId: createdCategories[13]?.id,
      publishedAt: new Date("1976-01-01"),
      rating: 4.9,
      image: "https://example.com/images/tong_nafasi.jpg",
    },
    {
      title: "Чолпон - Кеча ва кундуз",
      authorId: createdAuthors[14]?.id,
      categoryId: createdCategories[14]?.id,
      publishedAt: new Date("1926-01-01"),
      rating: 4.8,
      image: "https://example.com/images/kecha_va_kunduz.jpg",
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
          rating: book.rating,
          image: book.image,
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
