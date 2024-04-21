export class CreateEbookDto {
  title: string;
  publisher: string;
  author: number;
  overview: string;
  price: number;
  stock: number;
  fileData?: string; //base64
}