import { Reader } from "src/auth/entities/user.entity";
import { usersMap } from "./users.data";
import {v4 as uuid} from "uuid";

const preReaders = [
    {
        userId: usersMap["user2"].id,
        favoriteGenre: 'Fiction',
        bookList: 'List of favorite books',
    }
]

const readers: Reader[] = preReaders.map((reader) => {return {id: uuid(), ...reader}})
const readersMap = Object.fromEntries(readers.map((reader) => {return [reader.id, reader]}));

export {readersMap};
export default readers;