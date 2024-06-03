import { Ebook, EbooksReader } from "src/ebooks/entities/ebook.entity";
import {v4 as uuid} from "uuid";
import { authorsMap } from "./authors.data";
import { usersMap } from "./users.data";
import { ebooksMap } from "./ebooks.data";

const preEbooksReader = [
    {
        readerId: usersMap["user1"].id,  
        ebookId: ebooksMap["Harry Potter y la piedra filosofal"].id  
    },
    {
        readerId: usersMap["user1"].id,  
        ebookId: ebooksMap["Herejes de Dune (Dune 5)"].id  
    },{
        readerId: usersMap["user1"].id,  
        ebookId: ebooksMap["Dios emperador de Dune (Dune 4)"].id  
    },{
        readerId: usersMap["user1"].id,  
        ebookId: ebooksMap["Dune 1"].id  
    },
    {
        readerId: usersMap["user2"].id,  
        ebookId: ebooksMap["El Hobbit"].id  
    },
    {
        readerId: usersMap["user2"].id,  
        ebookId: ebooksMap["Don Quijote de la Mancha"].id  
    },
];

const ebooksReader: EbooksReader[] = preEbooksReader.map((entry) => {
    return {
        id: uuid(),
        ...entry
    };
});
export default ebooksReader;