export interface User {
  id: string;
  username: string;
  role: "USER" | "LIBRARIAN" | "ADMIN";
}

export type UserListResponse = User[];

export type UserResponse = User;