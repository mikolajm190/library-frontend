export interface Book {
  id: string;
  title: string;
  author: string;
  totalCopies: number;
  availableCopies: number;
}

export type BookListResponse = Book[];

export type BookResponse = Book;
