import { Author } from "src/auth/entities/user.entity";

export class CreateEbookDto {
  title: string;
  publisher: string;
  author: Author;
  overview: string;
  price: number;
  stock: number;
  fileData?: string; //base64
}