import { Author } from "src/auth/entities/user.entity";
import { Ebook } from "../entities/ebook.entity";
import { InfoAuthorDto } from "./info-author.dto";

export class InfoEbookDto {
    id: string;
    title: string;
    publisher: string;
    author: InfoAuthorDto;
    overview: string;
    price: number;
    stock: number;
    fileUrl: string;
    isbn: string;
    version: string;
    rating: number;
    numVotes: number;
    category:string;
    ebookCover: string;
    
    constructor(ebook: Ebook) {
        this.id = ebook.id;
        this.title = ebook.title;
        this.publisher = ebook.publisher;
        this.author = new InfoAuthorDto(ebook.author);
        this.overview = ebook.overview;
        this.price = ebook.price;
        this.stock = ebook.stock;
        this.fileUrl = ebook.fileData;
        this.isbn = ebook.isbn;
        this.version = ebook.version;
        this.rating = ebook.rating;
        this.numVotes = ebook.votes.length;
        this.category = ebook.category;
        this.ebookCover = ebook.ebookCover;
    }
}