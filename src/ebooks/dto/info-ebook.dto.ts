import { Ebook } from "../entities/ebook.entity";

export class InfoEbookDto {
    title: string;
    publisher: string;
    author: string;
    overview: string;
    price: number;
    stock: number;
    fileUrl: string;
    isbn: string;
    version: string;
    rating: number;
    
    constructor(ebook: Ebook) {
        console.log(ebook);
        this.title = ebook.title;
        this.publisher = ebook.publisher;
        this.author = ebook.author.penName;
        this.overview = ebook.overview;
        this.price = ebook.price;
        this.stock = ebook.stock;
        this.fileUrl = ebook.fileData;
        this.isbn = ebook.isbn;
        this.version = ebook.version;
        this.rating = ebook.rating;
    }
}