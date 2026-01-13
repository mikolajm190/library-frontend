export interface Book {
  id: string;
  title: string;
  author: string;
  availableCopies: number;
  copiesOnLoan: number;
}

export type BookListResponse = Book[];

export type BookResponse = Book;