import { Author } from "src/auth/entities/user.entity";

export class InfoAuthorDto {
    id: string;
    name: string;

    constructor(author: Author) {
        this.id = author.id;
        this.name = author.penName;
    }
}