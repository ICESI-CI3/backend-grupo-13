export class InfoEbookDto {
    title: string;
    publisher: string;
    author: string;
    overview: string;
    price: number;
    stock: number;
    
    constructor(title: string, publisher: string, author: string, overview: string, price: number, stock: number) {
        this.title = title;
        this.publisher = publisher;
        this.author = author;
        this.overview = overview;
        this.price = price;
        this.stock = stock;
    }
}