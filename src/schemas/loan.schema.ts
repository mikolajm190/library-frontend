import type { Book } from "./book.schema";
import type { User } from "./user.schema";

export interface Loan {
  id: string;
  borrowDate: Date;
  returnDate: Date;
  user: User;
  book: Book;
}

export type LoanListResponse = Loan[];

export type LoanResponse = Loan;