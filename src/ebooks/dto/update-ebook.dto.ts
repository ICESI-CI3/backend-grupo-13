export class UpdateEbookDto {
  title?: string;
  publisher?: string;
  overview?: string;
  price?: number;
  stock?: number;
  fileData?: string; //base64
}