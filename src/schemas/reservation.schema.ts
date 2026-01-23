import type { Book } from "./book.schema";
import type { User } from "./user.schema";

export interface Reservation {
  id: string;
  createdAt: Date;
  expiresAt: Date;
  status: "READY" | "QUEUED" | "EXPIRED"
  user: User;
  book: Book;
}

export type ReservationListResponse = Reservation[];

export type ReservationResponse = Reservation;
