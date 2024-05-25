import { User } from "src/auth/entities/user.entity";
import { RoleEnum } from "src/auth/enum/role.enum"
import {v4 as uuid} from "uuid";

const preUsers = [
    {
        username: 'gMartin',
        password: 'universalPass123',
        email: 'user1@example.com',
        role: RoleEnum.AUTHOR
    },
    {
        username: 'jRowling',
        password: 'universalPass123',
        email: 'user2@example.com',
        role: RoleEnum.AUTHOR,
    },
    {
        username: 'jTolkien',
        password: 'universalPass123',
        email: 'user3@example.com',
        role: RoleEnum.AUTHOR,
    },
    {
        username: 'mCervantes',
        password: 'universalPass123',
        email: 'user4@example.com',
        role: RoleEnum.AUTHOR,
    },
    {
        username: 'sKing',
        password: 'universalPass123',
        email: 'user5@example.com',
        role: RoleEnum.AUTHOR,
    },
    {
        username: 'fHerbert',
        password: 'universalPass123',
        email: 'user6@example.com',
        role: RoleEnum.AUTHOR,
    },
];

const users: User[] = preUsers.map((user) => {return {id: uuid(), orders: [], votes: [], ...user}})
const usersMap = Object.fromEntries(users.map((user) => [user.username, user]));

export {usersMap};
export default users;